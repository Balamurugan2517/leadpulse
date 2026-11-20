"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Kanban,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  FileText,
  MessageSquare,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  PhoneCall,
  Video,
  MapPin,
  Check,
  AlertCircle,
  Trophy,
} from "lucide-react";
import {
  PipelineDeal,
  PipelineStage,
  PipelineRevenueMetrics,
} from "@leadpulse/domain";
import {
  updateDealStageAction,
  logMeetingNoteAction,
} from "../../actions/pipeline-actions";

interface PipelineClientProps {
  initialDeals: PipelineDeal[];
  metrics: PipelineRevenueMetrics;
}

const STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: "DISCOVERED", label: "Discovered", color: "border-slate-500/30 text-slate-400" },
  { key: "CONTACTED", label: "Pitched / Contacted", color: "border-blue-500/30 text-blue-400" },
  { key: "IN_DISCUSSION", label: "In Discussion", color: "border-amber-500/30 text-amber-400" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent", color: "border-purple-500/30 text-purple-400" },
  { key: "DEAL_WON", label: "Deal Won (Closed)", color: "border-emerald-500/30 text-emerald-400" },
];

export function PipelineClient({ initialDeals, metrics: initialMetrics }: PipelineClientProps) {
  const [deals, setDeals] = useState<PipelineDeal[]>(initialDeals);
  const [isPending, startTransition] = useTransition();
  const [activeModalDeal, setActiveModalDeal] = useState<PipelineDeal | null>(null);

  // Meeting log modal state
  const [meetingType, setMeetingType] = useState("PHONE_CALL");
  const [outcomeSummary, setOutcomeSummary] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleStageChange = (dealId: string, businessId: string, newStage: PipelineStage) => {
    startTransition(async () => {
      await updateDealStageAction(businessId, newStage);
      setDeals((prev) =>
        prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
      );
      setToastMessage(`Deal moved to ${newStage.replace(/_/g, " ")}`);
      setTimeout(() => setToastMessage(null), 3000);
    });
  };

  const handleSaveMeetingNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalDeal) return;

    startTransition(async () => {
      await logMeetingNoteAction({
        businessId: activeModalDeal.businessId,
        interactionType: meetingType,
        outcomeSummary,
        nextFollowUpDate: followUpDate || undefined,
      });

      setDeals((prev) =>
        prev.map((d) =>
          d.businessId === activeModalDeal.businessId
            ? { ...d, notesSummary: outcomeSummary, nextFollowUpDate: followUpDate || d.nextFollowUpDate }
            : d
        )
      );

      setActiveModalDeal(null);
      setOutcomeSummary("");
      setFollowUpDate("");
      setToastMessage("Meeting note and follow-up date recorded!");
      setTimeout(() => setToastMessage(null), 3000);
    });
  };

  // Compute live totals
  const totalPipeline = deals
    .filter((d) => !["DEAL_WON", "DEAL_LOST", "SUPPRESSED"].includes(d.stage))
    .reduce((sum, d) => sum + (d.dealValueEstimate || 0), 0);

  const totalWon = deals
    .filter((d) => d.stage === "DEAL_WON")
    .reduce((sum, d) => sum + (d.dealValueEstimate || 0), 0);

  const totalMrr = deals
    .filter((d) => d.stage === "DEAL_WON")
    .reduce((sum, d) => sum + (d.monthlyRecurringEstimate || 3500), 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* Financial KPIs Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Active Pipeline Value
          </span>
          <p className="text-xl font-extrabold text-foreground tracking-tight">
            ₹{totalPipeline.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-muted-foreground block">
            Across {deals.filter((d) => !["DEAL_WON", "DEAL_LOST", "SUPPRESSED"].includes(d.stage)).length} active deals
          </span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-emerald-500" />
            Closed Won Revenue
          </span>
          <p className="text-xl font-extrabold text-emerald-500 tracking-tight">
            ₹{totalWon.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-muted-foreground block">
            {deals.filter((d) => d.stage === "DEAL_WON").length} projects signed
          </span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5 text-purple-400" />
            Projected Monthly MRR
          </span>
          <p className="text-xl font-extrabold text-purple-400 tracking-tight">
            ₹{totalMrr.toLocaleString("en-IN")}/mo
          </p>
          <span className="text-[10px] text-muted-foreground block">Hosting & SEO retainers</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Kanban className="h-3.5 w-3.5 text-blue-400" />
            Win Rate & Average Deal
          </span>
          <p className="text-xl font-extrabold text-foreground tracking-tight">
            {initialMetrics.winRatePercentage}%
          </p>
          <span className="text-[10px] text-muted-foreground block">
            Avg: ₹{initialMetrics.averageDealSizeInr.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colDeals = deals.filter((d) => d.stage === col.key);
          const colTotal = colDeals.reduce((sum, d) => sum + (d.dealValueEstimate || 0), 0);

          return (
            <div
              key={col.key}
              className="flex flex-col rounded-2xl border border-border bg-card/60 min-w-[260px] max-w-full shadow-sm"
            >
              {/* Column Header */}
              <div className={`p-3.5 border-b border-border bg-muted/20 flex items-center justify-between`}>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${col.key === "DEAL_WON" ? "bg-emerald-500" : "bg-primary"}`} />
                    {col.label}
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ₹{colTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {colDeals.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[650px]">
                {colDeals.length === 0 ? (
                  <div className="p-6 text-center text-[11px] text-muted-foreground border border-dashed border-border/60 rounded-xl">
                    No deals
                  </div>
                ) : (
                  colDeals.map((deal) => {
                    const slug = deal.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    const previewHref = `/preview/${slug}?name=${encodeURIComponent(
                      deal.businessName
                    )}&category=${encodeURIComponent(deal.category)}`;

                    return (
                      <div
                        key={deal.id}
                        className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors shadow-sm space-y-2.5 text-xs"
                      >
                        {/* Title & Category */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-foreground text-xs leading-snug">
                              {deal.businessName}
                            </h4>
                            <span className="text-[10px] text-muted-foreground">
                              {deal.category} • {deal.city}
                            </span>
                          </div>
                          <span className="text-[11px] font-extrabold text-foreground px-1.5 py-0.5 rounded bg-muted/50 border border-border font-mono shrink-0">
                            ₹{deal.dealValueEstimate.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Notes snippet */}
                        {deal.notesSummary && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 bg-muted/20 p-1.5 rounded border border-border/40">
                            💬 {deal.notesSummary}
                          </p>
                        )}

                        {/* Follow up tag */}
                        {deal.nextFollowUpDate && (
                          <div className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Follow up: {deal.nextFollowUpDate}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-2 border-t border-border flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveModalDeal(deal);
                                setOutcomeSummary(deal.notesSummary || "");
                                setFollowUpDate(deal.nextFollowUpDate || "");
                              }}
                              title="Log meeting notes"
                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </button>
                            <Link
                              href={`/dashboard/pipeline/proposal/${deal.businessId}`}
                              title="View Proposal"
                              className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                              href={previewHref}
                              target="_blank"
                              title="Live Prototype"
                              className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </Link>
                          </div>

                          {/* Stage Mover Selector */}
                          <select
                            value={deal.stage}
                            disabled={isPending}
                            onChange={(e) =>
                              handleStageChange(deal.id, deal.businessId, e.target.value as PipelineStage)
                            }
                            className="text-[10px] font-semibold bg-muted px-1.5 py-1 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="DISCOVERED">Discovered</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="IN_DISCUSSION">In Discussion</option>
                            <option value="PROPOSAL_SENT">Proposal Sent</option>
                            <option value="DEAL_WON">Deal Won 🎉</option>
                            <option value="DEAL_LOST">Lost / Archived</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Meeting Logger Modal */}
      {activeModalDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  Log Interaction: {activeModalDeal.businessName}
                </h3>
                <span className="text-xs text-muted-foreground">Record call or meeting notes</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalDeal(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMeetingNote} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">Interaction Channel</label>
                <select
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="PHONE_CALL">📞 Phone Consultation</option>
                  <option value="WHATSAPP_CHAT">💬 WhatsApp Discussion</option>
                  <option value="IN_PERSON">📍 In-Person Clinic/Store Visit</option>
                  <option value="GOOGLE_MEET">💻 Online Video Call</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Meeting Outcome & Client Notes</label>
                <textarea
                  rows={4}
                  required
                  value={outcomeSummary}
                  onChange={(e) => setOutcomeSummary(e.target.value)}
                  placeholder="e.g. Founder wants appointment scheduler + WhatsApp notification. Agreed to review proposal..."
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Next Follow-Up Date (Optional)</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setActiveModalDeal(null)}
                  className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                >
                  Save Interaction Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
