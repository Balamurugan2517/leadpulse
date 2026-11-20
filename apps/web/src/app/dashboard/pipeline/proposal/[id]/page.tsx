import Link from "next/link";
import {
  FileText,
  Printer,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { getProposalDetailsAction } from "../../../../actions/pipeline-actions";

interface ProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalViewPage({ params }: ProposalPageProps) {
  const { id } = await params;
  const proposal = await getProposalDetailsAction(id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navigation & Print Controls */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/dashboard/pipeline"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pipeline
        </Link>

        <button
          type="button"
          // @ts-ignore
          onClick="window.print()"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Printer className="h-3.5 w-3.5" />
          Print / Save PDF
        </button>
      </div>

      {/* Official Proposal Document Card */}
      <div className="p-8 sm:p-12 rounded-3xl border border-border bg-card shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                LP
              </div>
              <span className="font-extrabold text-xl tracking-tight">LeadPulse Digital</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Modern Web Engineering & High-Conversion Digital Systems
            </p>
            <p className="text-xs text-muted-foreground">Chennai, Tamil Nadu • contact@leadpulse.agency</p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20">
              Commercial Proposal
            </span>
            <p className="font-mono text-xs text-foreground font-bold mt-2">{proposal.proposalId}</p>
            <p className="text-xs text-muted-foreground">Date: {proposal.dateCreated}</p>
            <p className="text-xs text-muted-foreground">Valid Until: {proposal.validUntil}</p>
          </div>
        </div>

        {/* Client Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-muted/20 border border-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Prepared Exclusively For:
            </span>
            <h2 className="text-base font-bold text-foreground">{proposal.businessName}</h2>
            <p className="text-xs text-muted-foreground">
              {proposal.clientCategory} • {proposal.city}
            </p>
          </div>

          {proposal.prototypeUrl && (
            <div className="sm:text-right flex flex-col justify-center sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Interactive Live Prototype:
              </span>
              <Link
                href={proposal.prototypeUrl}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Launch Live Concept Preview <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Deliverables Scope Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Scope of Work & Deliverables
          </h3>

          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden">
            {proposal.services.map((service, idx) => (
              <div key={idx} className="p-6 space-y-3 bg-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    {service.title}
                  </h4>
                  <span className="font-mono font-extrabold text-sm text-foreground">
                    ₹{service.priceInr.toLocaleString("en-IN")}
                  </span>
                </div>

                <ul className="space-y-1.5 pl-2">
                  {service.deliverables.map((item, dIdx) => (
                    <li key={dIdx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Summary & Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
          {/* Milestone Schedule */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
              Payment Milestones & Terms
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <span className="font-bold block">1. Initial Deposit (50%)</span>
                  <span className="text-[11px] text-muted-foreground">Due upon proposal agreement & kickoff</span>
                </div>
                <span className="font-mono font-bold">
                  ₹{proposal.advanceDepositInr.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <span className="font-bold block">2. Final Balance (50%)</span>
                  <span className="text-[11px] text-muted-foreground">Due upon official domain launch</span>
                </div>
                <span className="font-mono font-bold">
                  ₹{proposal.balanceDueOnLaunchInr.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Total Investment Card */}
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Total Fixed Investment
              </span>
              <p className="text-3xl font-extrabold text-primary font-mono tracking-tight mt-1">
                ₹{proposal.totalInvestmentInr.toLocaleString("en-IN")}
              </p>
              <span className="text-[11px] text-muted-foreground block mt-1">
                Estimated Delivery: {proposal.estimatedDeliveryDays} business days
              </span>
            </div>

            {proposal.optionalMonthlySupportInr > 0 && (
              <div className="pt-3 border-t border-primary/10 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Optional Monthly Retainer: </span>
                ₹{proposal.optionalMonthlySupportInr.toLocaleString("en-IN")}/mo for continuous hosting, SSL renewals, and priority maintenance.
              </div>
            )}
          </div>
        </div>

        {/* Sign-off / Acceptance Footer */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            To accept this proposal, reply via WhatsApp or Email referencing {proposal.proposalId}.
          </p>
          <div className="font-medium text-foreground">
            LeadPulse AI Systems • Chennai, TN
          </div>
        </div>
      </div>
    </div>
  );
}
