import { eq, and, or, ilike, desc, sql } from "drizzle-orm";
import { schema } from "../index";
import { CreateBusinessInput, CsvLeadRow, DemandTier } from "@leadpulse/contracts";
import { calculateLeadDemandScore, deduplicateLeads, ExistingLeadIdentity } from "@leadpulse/domain";

export interface ListBusinessesOptions {
  workspaceId: string;
  search?: string;
  category?: string;
  city?: string;
  demandTier?: DemandTier;
  stage?: string;
  limit?: number;
  offset?: number;
}

export class BusinessRepository {
  constructor(private db: any) {}

  /**
   * Retrieves paginated businesses with their latest lead score and sales stage.
   */
  async list(options: ListBusinessesOptions) {
    const {
      workspaceId,
      search,
      category,
      city,
      demandTier,
      stage,
      limit = 25,
      offset = 0,
    } = options;

    const conditions = [eq(schema.businesses.workspaceId, workspaceId)];

    if (category) {
      conditions.push(ilike(schema.businesses.category, `%${category}%`));
    }

    if (city) {
      conditions.push(ilike(schema.businesses.city, `%${city}%`));
    }

    if (search) {
      conditions.push(
        or(
          ilike(schema.businesses.name, `%${search}%`),
          ilike(schema.businesses.phone, `%${search}%`),
          ilike(schema.businesses.email, `%${search}%`),
          ilike(schema.businesses.category, `%${search}%`)
        )!
      );
    }

    // Join with lead_scores and leads_pipeline
    let query = this.db
      .select({
        business: schema.businesses,
        score: schema.leadScores,
        pipeline: schema.leadsPipeline,
      })
      .from(schema.businesses)
      .leftJoin(schema.leadScores, eq(schema.leadScores.businessId, schema.businesses.id))
      .leftJoin(schema.leadsPipeline, eq(schema.leadsPipeline.businessId, schema.businesses.id))
      .where(and(...conditions))
      .orderBy(desc(schema.businesses.createdAt))
      .limit(limit)
      .offset(offset);

    const rows = await query;

    // Filter in-memory if demandTier or stage was requested (or can be done via SQL conditions)
    let filtered = rows;
    if (demandTier) {
      filtered = filtered.filter((r: any) => r.score?.demandTier === demandTier);
    }
    if (stage) {
      filtered = filtered.filter((r: any) => r.pipeline?.stage === stage);
    }

    return filtered;
  }

  /**
   * Retrieves single business by ID with full details (assets, audits, score, pipeline, notes).
   */
  async getById(id: string, workspaceId: string) {
    const [businessRecord] = await this.db
      .select()
      .from(schema.businesses)
      .where(and(eq(schema.businesses.id, id), eq(schema.businesses.workspaceId, workspaceId)))
      .limit(1);

    if (!businessRecord) return null;

    const assets = await this.db
      .select()
      .from(schema.businessDigitalAssets)
      .where(eq(schema.businessDigitalAssets.businessId, id));

    const audits = await this.db
      .select()
      .from(schema.websiteAudits)
      .where(eq(schema.websiteAudits.businessId, id))
      .orderBy(desc(schema.websiteAudits.createdAt));

    const [score] = await this.db
      .select()
      .from(schema.leadScores)
      .where(eq(schema.leadScores.businessId, id))
      .limit(1);

    const [pipeline] = await this.db
      .select()
      .from(schema.leadsPipeline)
      .where(eq(schema.leadsPipeline.businessId, id))
      .limit(1);

    return {
      business: businessRecord,
      assets,
      audits,
      score: score || null,
      pipeline: pipeline || null,
    };
  }

  /**
   * Creates a business, creates its digital asset if URL provided, initializes pipeline to DISCOVERED,
   * calculates initial demand tier score, and enqueues an audit job if website provided.
   */
  async create(input: CreateBusinessInput) {
    return await this.db.transaction(async (tx: any) => {
      // 1. Insert business
      const [newBusiness] = await tx
        .insert(schema.businesses)
        .values({
          workspaceId: input.workspaceId,
          name: input.name,
          category: input.category,
          industry: input.industry,
          description: input.description,
          phone: input.phone,
          email: input.email,
          whatsappNumber: input.whatsappNumber || input.phone,
          addressLine1: input.addressLine1,
          city: input.city || "Chennai",
          state: input.state || "Tamil Nadu",
          country: input.country || "India",
          postalCode: input.postalCode,
          latitude: input.latitude ? String(input.latitude) : null,
          longitude: input.longitude ? String(input.longitude) : null,
          sourceType: input.sourceType || "MANUAL_ASSISTED",
          sourceUrl: input.sourceUrl,
          verificationStatus: input.verificationStatus || "UNVERIFIED",
        })
        .returning();

      // 2. Insert primary digital asset if sourceUrl exists
      if (input.sourceUrl) {
        await tx.insert(schema.businessDigitalAssets).values({
          businessId: newBusiness.id,
          assetType: "WEBSITE",
          url: input.sourceUrl,
          isPrimary: true,
          status: "ACTIVE",
        });
      }

      // 3. Initialize pipeline record (DISCOVERED)
      const [pipeline] = await tx
        .insert(schema.leadsPipeline)
        .values({
          businessId: newBusiness.id,
          workspaceId: input.workspaceId,
          stage: "DISCOVERED",
        })
        .returning();

      // 4. Calculate initial score & demand tier
      const initialScore = calculateLeadDemandScore({ business: newBusiness });
      await tx.insert(schema.leadScores).values({
        businessId: newBusiness.id,
        needFitScore: String(initialScore.needFitScore),
        intentScore: String(initialScore.intentScore),
        businessFitScore: String(initialScore.businessFitScore),
        reachabilityScore: String(initialScore.reachabilityScore),
        evidenceConfidence: String(initialScore.evidenceConfidence),
        priorityScore: String(initialScore.priorityScore),
        demandTier: initialScore.demandTier,
        recommendedServices: initialScore.recommendedServices,
        scoreReasons: initialScore.scoreReasons,
      });

      // 5. If website exists, enqueue background audit job
      if (input.sourceUrl) {
        await tx.insert(schema.jobsQueue).values({
          workspaceId: input.workspaceId,
          taskType: "WEBSITE_AUDIT",
          payload: {
            businessId: newBusiness.id,
            targetUrl: input.sourceUrl,
          },
          status: "PENDING",
        });
      }

      return { business: newBusiness, pipeline, score: initialScore };
    });
  }

  /**
   * Batch imports leads from CSV with deduplication against existing database records.
   */
  async batchImportCsv(workspaceId: string, rows: CsvLeadRow[]) {
    // 1. Fetch existing identity records for deduplication
    const existing = await this.db
      .select({
        name: schema.businesses.name,
        phone: schema.businesses.phone,
        website: schema.businesses.sourceUrl,
        city: schema.businesses.city,
      })
      .from(schema.businesses)
      .where(eq(schema.businesses.workspaceId, workspaceId));

    // 2. Deduplicate
    const { uniqueRows, duplicatesCount } = deduplicateLeads(rows, existing);

    const inserted: any[] = [];

    // 3. Insert unique rows inside a single transaction
    if (uniqueRows.length > 0) {
      await this.db.transaction(async (tx: any) => {
        for (const row of uniqueRows) {
          const [b] = await tx
            .insert(schema.businesses)
            .values({
              workspaceId,
              name: row.name,
              category: row.category,
              phone: row.phone,
              email: row.email,
              whatsappNumber: row.whatsappNumber || row.phone,
              addressLine1: row.address,
              city: row.city || "Chennai",
              sourceType: "CSV",
              sourceUrl: row.website,
              description: row.notes,
              verificationStatus: "UNVERIFIED",
            })
            .returning();

          if (row.website) {
            await tx.insert(schema.businessDigitalAssets).values({
              businessId: b.id,
              assetType: "WEBSITE",
              url: row.website,
              isPrimary: true,
            });

            // Enqueue audit job
            await tx.insert(schema.jobsQueue).values({
              workspaceId,
              taskType: "WEBSITE_AUDIT",
              payload: { businessId: b.id, targetUrl: row.website },
              status: "PENDING",
            });
          }

          // Initialize pipeline & score
          await tx.insert(schema.leadsPipeline).values({
            businessId: b.id,
            workspaceId,
            stage: "DISCOVERED",
          });

          const initialScore = calculateLeadDemandScore({ business: b });
          await tx.insert(schema.leadScores).values({
            businessId: b.id,
            needFitScore: String(initialScore.needFitScore),
            intentScore: String(initialScore.intentScore),
            businessFitScore: String(initialScore.businessFitScore),
            reachabilityScore: String(initialScore.reachabilityScore),
            evidenceConfidence: String(initialScore.evidenceConfidence),
            priorityScore: String(initialScore.priorityScore),
            demandTier: initialScore.demandTier,
            recommendedServices: initialScore.recommendedServices,
            scoreReasons: initialScore.scoreReasons,
          });

          inserted.push(b);
        }
      });
    }

    return {
      importedCount: inserted.length,
      skippedDuplicateCount: duplicatesCount,
      totalProcessed: rows.length,
    };
  }

  /**
   * Updates business properties.
   */
  async update(id: string, workspaceId: string, updates: Partial<CreateBusinessInput>) {
    const [updated] = await this.db
      .update(schema.businesses)
      .set({
        ...updates,
        latitude: updates.latitude ? String(updates.latitude) : undefined,
        longitude: updates.longitude ? String(updates.longitude) : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.businesses.id, id), eq(schema.businesses.workspaceId, workspaceId)))
      .returning();

    return updated;
  }

  /**
   * Suppresses or deletes a lead so it is excluded from future searches.
   */
  async suppress(id: string, workspaceId: string) {
    await this.db.transaction(async (tx: any) => {
      await tx
        .update(schema.businesses)
        .set({ verificationStatus: "SUPPRESSED", updatedAt: new Date() })
        .where(and(eq(schema.businesses.id, id), eq(schema.businesses.workspaceId, workspaceId)));

      await tx
        .update(schema.leadsPipeline)
        .set({ stage: "SUPPRESSED", updatedAt: new Date() })
        .where(and(eq(schema.leadsPipeline.businessId, id), eq(schema.leadsPipeline.workspaceId, workspaceId)));
    });

    return true;
  }
}
