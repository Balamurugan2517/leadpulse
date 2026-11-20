import { ServiceCatalogItem, DEFAULT_SERVICE_CATALOG } from "./keyword-taxonomy";

export type PipelineStage =
  | "DISCOVERED"
  | "CONTACTED"
  | "IN_DISCUSSION"
  | "PROPOSAL_SENT"
  | "DEAL_WON"
  | "DEAL_LOST"
  | "SUPPRESSED";

export interface PipelineDeal {
  id: string;
  businessId: string;
  businessName: string;
  category: string;
  city: string;
  phone?: string;
  email?: string;
  stage: PipelineStage;
  dealValueEstimate: number; // in INR
  monthlyRecurringEstimate?: number; // in INR (e.g. maintenance / SEO support)
  lastContactedAt?: Date | null;
  nextFollowUpDate?: string | null;
  notesSummary?: string;
  recommendedServices?: string[];
}

export interface PipelineRevenueMetrics {
  totalPipelineValueInr: number;
  closedWonRevenueInr: number;
  projectedMrrInr: number;
  activeDealsCount: number;
  closedWonCount: number;
  closedLostCount: number;
  winRatePercentage: number;
  averageDealSizeInr: number;
}

export interface ProposalDeliverable {
  serviceCode: string;
  title: string;
  deliverables: string[];
  priceInr: number;
  hasRecurringMaintenance: boolean;
}

export interface GeneratedProposal {
  proposalId: string;
  businessName: string;
  clientCategory: string;
  city: string;
  dateCreated: string;
  validUntil: string;
  services: ProposalDeliverable[];
  totalInvestmentInr: number;
  advanceDepositInr: number;
  balanceDueOnLaunchInr: number;
  optionalMonthlySupportInr: number;
  estimatedDeliveryDays: number;
  prototypeUrl?: string;
}

/**
 * Calculates financial revenue and conversion metrics across all pipeline deals.
 */
export function calculatePipelineRevenueMetrics(deals: PipelineDeal[]): PipelineRevenueMetrics {
  let totalPipelineValueInr = 0;
  let closedWonRevenueInr = 0;
  let projectedMrrInr = 0;
  let closedWonCount = 0;
  let closedLostCount = 0;
  let activeDealsCount = 0;

  for (const deal of deals) {
    const val = deal.dealValueEstimate || 0;
    const mrr = deal.monthlyRecurringEstimate || 0;

    if (deal.stage === "DEAL_WON") {
      closedWonRevenueInr += val;
      projectedMrrInr += mrr;
      closedWonCount++;
    } else if (deal.stage === "DEAL_LOST" || deal.stage === "SUPPRESSED") {
      closedLostCount++;
    } else {
      // Active in flight (DISCOVERED, CONTACTED, IN_DISCUSSION, PROPOSAL_SENT)
      totalPipelineValueInr += val;
      activeDealsCount++;
    }
  }

  const finishedDeals = closedWonCount + closedLostCount;
  const winRatePercentage = finishedDeals > 0 ? Math.round((closedWonCount / finishedDeals) * 100) : 0;
  const averageDealSizeInr = closedWonCount > 0 ? Math.round(closedWonRevenueInr / closedWonCount) : 30000;

  return {
    totalPipelineValueInr,
    closedWonRevenueInr,
    projectedMrrInr,
    activeDealsCount,
    closedWonCount,
    closedLostCount,
    winRatePercentage,
    averageDealSizeInr,
  };
}

/**
 * Generates an itemized proposal scope and pricing based on selected service catalog items.
 */
export function generateProposalData(params: {
  proposalId: string;
  businessName: string;
  clientCategory: string;
  city?: string;
  serviceCodes: string[];
  advancePercent?: number; // defaults to 50%
  prototypeUrl?: string;
}): GeneratedProposal {
  const {
    proposalId,
    businessName,
    clientCategory,
    city = "Chennai",
    serviceCodes,
    advancePercent = 50,
    prototypeUrl,
  } = params;

  const services: ProposalDeliverable[] = [];
  let totalInvestmentInr = 0;
  let optionalMonthlySupportInr = 0;

  for (const code of serviceCodes) {
    const found = DEFAULT_SERVICE_CATALOG.find((s) => s.code === code);
    if (found) {
      // Pick median of indicative price range
      const price = Math.round((found.indicativePriceInr.min + found.indicativePriceInr.max) / 2);
      totalInvestmentInr += price;
      if (found.recurringSupportOption) {
        optionalMonthlySupportInr += 3500; // standard monthly retainer in INR
      }

      services.push({
        serviceCode: found.code,
        title: found.title,
        deliverables: found.deliverables,
        priceInr: price,
        hasRecurringMaintenance: found.recurringSupportOption,
      });
    }
  }

  // Fallback if no valid codes matched
  if (services.length === 0) {
    const defaultService = DEFAULT_SERVICE_CATALOG[0];
    const price = 35000;
    totalInvestmentInr = price;
    services.push({
      serviceCode: defaultService.code,
      title: defaultService.title,
      deliverables: defaultService.deliverables,
      priceInr: price,
      hasRecurringMaintenance: true,
    });
  }

  const advanceDepositInr = Math.round((totalInvestmentInr * advancePercent) / 100);
  const balanceDueOnLaunchInr = totalInvestmentInr - advanceDepositInr;

  const now = new Date();
  const validUntil = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days validity

  return {
    proposalId,
    businessName,
    clientCategory,
    city,
    dateCreated: now.toISOString().split("T")[0],
    validUntil: validUntil.toISOString().split("T")[0],
    services,
    totalInvestmentInr,
    advanceDepositInr,
    balanceDueOnLaunchInr,
    optionalMonthlySupportInr,
    estimatedDeliveryDays: 10,
    prototypeUrl,
  };
}
