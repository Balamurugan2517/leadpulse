import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
  date,
  index,
} from "drizzle-orm/pg-core";

// --- 1. Workspaces & Tenancy ---
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// --- 2. Users & Sessions (Better Auth Native Schema) ---
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// --- 3. Canonical Businesses ---
export const businesses = pgTable(
  "businesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    industry: varchar("industry", { length: 100 }),
    description: text("description"),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    whatsappNumber: varchar("whatsapp_number", { length: 50 }),
    addressLine1: text("address_line1"),
    city: varchar("city", { length: 100 }).default("Chennai").notNull(),
    state: varchar("state", { length: 100 }).default("Tamil Nadu").notNull(),
    country: varchar("country", { length: 100 }).default("India").notNull(),
    postalCode: varchar("postal_code", { length: 20 }),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),
    googlePlaceId: varchar("google_place_id", { length: 255 }),
    sourceType: varchar("source_type", { length: 50 }).notNull(), // 'OSM', 'MANUAL_ASSISTED', 'CSV', 'RSS', etc.
    sourceUrl: text("source_url"),
    sourceRetrievedAt: timestamp("source_retrieved_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    verificationStatus: varchar("verification_status", { length: 50 })
      .default("UNVERIFIED")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_businesses_workspace").on(table.workspaceId),
    index("idx_businesses_category").on(table.category),
    index("idx_businesses_city").on(table.city),
  ]
);

// --- 4. Digital Assets (Websites, Social Links) ---
export const businessDigitalAssets = pgTable(
  "business_digital_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .references(() => businesses.id, { onDelete: "cascade" })
      .notNull(),
    assetType: varchar("asset_type", { length: 50 }).notNull(), // 'WEBSITE', 'INSTAGRAM', 'FACEBOOK', etc.
    url: text("url").notNull(),
    status: varchar("status", { length: 50 }).default("ACTIVE").notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_assets_business").on(table.businessId)]
);

// --- 5. Technical Website Audits ---
export const websiteAudits = pgTable(
  "website_audits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .references(() => businesses.id, { onDelete: "cascade" })
      .notNull(),
    targetUrl: text("target_url").notNull(),
    finalUrl: text("final_url"),
    httpStatus: integer("http_status"),
    dnsResolves: boolean("dns_resolves").default(false).notNull(),
    sslValid: boolean("ssl_valid").default(false).notNull(),
    sslExpiresAt: timestamp("ssl_expires_at", { withTimezone: true }),
    redirectCount: integer("redirect_count").default(0).notNull(),
    isMobileResponsive: boolean("is_mobile_responsive"),
    lighthousePerformance: numeric("lighthouse_performance", { precision: 4, scale: 1 }),
    lighthouseAccessibility: numeric("lighthouse_accessibility", { precision: 4, scale: 1 }),
    lighthouseSeo: numeric("lighthouse_seo", { precision: 4, scale: 1 }),
    hasContactForm: boolean("has_contact_form"),
    hasBookingEngine: boolean("has_booking_engine"),
    hasWhatsappButton: boolean("has_whatsapp_button"),
    rawFindings: jsonb("raw_findings").default([]).notNull(),
    auditCompletedAt: timestamp("audit_completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_audits_business").on(table.businessId)]
);

// --- 6. Lead Scoring & Categorization ---
export const leadScores = pgTable("lead_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id")
    .references(() => businesses.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  needFitScore: numeric("need_fit_score", { precision: 5, scale: 2 }).default("0").notNull(),
  intentScore: numeric("intent_score", { precision: 5, scale: 2 }).default("0").notNull(),
  businessFitScore: numeric("business_fit_score", { precision: 5, scale: 2 }).default("0").notNull(),
  reachabilityScore: numeric("reachability_score", { precision: 5, scale: 2 }).default("0").notNull(),
  evidenceConfidence: numeric("evidence_confidence", { precision: 5, scale: 2 }).default("0").notNull(),
  priorityScore: numeric("priority_score", { precision: 5, scale: 2 }).default("0").notNull(),
  demandTier: varchar("demand_tier", { length: 50 }).default("LOW_DEMAND").notNull(),
  recommendedServices: jsonb("recommended_services").default([]).notNull(),
  scoreReasons: jsonb("score_reasons").default([]).notNull(),
  calculatedAt: timestamp("calculated_at", { withTimezone: true }).defaultNow().notNull(),
});

// --- 7. Sales Pipeline & Tracking ---
export const leadsPipeline = pgTable(
  "leads_pipeline",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .references(() => businesses.id, { onDelete: "cascade" })
      .unique()
      .notNull(),
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    stage: varchar("stage", { length: 50 }).default("DISCOVERED").notNull(),
    dealValueEstimate: numeric("deal_value_estimate", { precision: 12, scale: 2 }),
    lostReason: text("lost_reason"),
    nextFollowUpDate: date("next_follow_up_date"),
    assignedTo: uuid("assigned_to"),
    lastContactedAt: timestamp("last_contacted_at", { withTimezone: true }),
    notesSummary: text("notes_summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_pipeline_workspace_stage").on(table.workspaceId, table.stage),
    index("idx_pipeline_business").on(table.businessId),
  ]
);

// --- 8. Outreach Drafts ---
export const outreachDrafts = pgTable("outreach_drafts", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .references(() => leadsPipeline.id, { onDelete: "cascade" })
    .notNull(),
  channel: varchar("channel", { length: 50 }).notNull(), // 'WHATSAPP', 'EMAIL'
  recipientTarget: varchar("recipient_target", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  bodyText: text("body_text").notNull(),
  status: varchar("status", { length: 50 }).default("DRAFT").notNull(),
  evidenceReferenced: jsonb("evidence_referenced").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// --- 9. Communication Logs ---
export const communicationLogs = pgTable("communication_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .references(() => leadsPipeline.id, { onDelete: "cascade" })
    .notNull(),
  channel: varchar("channel", { length: 50 }).notNull(),
  interactionType: varchar("interaction_type", { length: 50 }).notNull(), // 'WHATSAPP_CLICKED', 'MANUAL_CALL', etc.
  outcomeSummary: text("outcome_summary"),
  followUpScheduledFor: timestamp("follow_up_scheduled_for", { withTimezone: true }),
  recordedBy: uuid("recorded_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// --- 10. Durable Background Job Queue ---
export const jobsQueue = pgTable(
  "jobs_queue",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    taskType: varchar("task_type", { length: 100 }).notNull(), // 'WEBSITE_AUDIT', 'OSM_DISCOVERY', etc.
    payload: jsonb("payload").notNull(),
    status: varchar("status", { length: 50 }).default("PENDING").notNull(), // 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'
    retryCount: integer("retry_count").default(0).notNull(),
    maxRetries: integer("max_retries").default(3).notNull(),
    lastError: text("last_error"),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    lockedBy: varchar("locked_by", { length: 100 }),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_jobs_status_scheduled").on(table.status, table.scheduledFor),
    index("idx_jobs_workspace").on(table.workspaceId),
  ]
);
