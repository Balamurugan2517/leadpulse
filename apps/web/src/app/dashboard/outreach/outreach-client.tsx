"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Send,
  MessageCircle,
  Mail,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  ShieldBan,
  Phone,
  Flame,
  Zap,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  recordMessageSentAction,
  suppressLeadAction,
} from "../../actions/outreach-actions";

interface OutreachClientProps {
  initialLeads: any[];
  currentTier: string;
}

export function OutreachClient({ initialLeads, currentTier }: OutreachClientProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    initialLeads[0]?.business.id || ""
  );
  const [activeChannel, setActiveChannel] = useState<"WHATSAPP_CASUAL" | "WHATSAPP_VALUE" | "EMAIL">("WHATSAPP_VALUE");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedItem = leads.find((l) => l.business.id === selectedLeadId) || leads[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkSent = (businessId: string, channel: string) => {
    startTransition(async () => {
      await recordMessageSentAction(businessId, channel);
      setLeads((prev) =>
        prev.map((l) =>
          l.business.id === businessId
            ? {
                ...l,
                pipeline: {
                  ...l.pipeline,
                  stage: "CONTACTED",
                  lastContactedAt: new Date(),
                },
              }
            : l
        )
      );
      setToastMessage("Lead stage updated to CONTACTED in pipeline!");
      setTimeout(() => setToastMessage(null), 3000);
    });
  };

  const handleSuppress = (businessId: string) => {
    if (!confirm("Are you sure you want to suppress this lead? They will be permanently skipped.")) return;

    startTransition(async () => {
      await suppressLeadAction(businessId, "MANUAL_OPT_OUT");
      setLeads((prev) => prev.filter((l) => l.business.id !== businessId));
      setToastMessage("Lead marked as SUPPRESSED.");
      setTimeout(() => setToastMessage(null), 3000);
    });
  };

  if (!selectedItem) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
        <Send className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
        <h3 className="font-bold text-base">All Caught Up!</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          No leads currently pending outreach in this tier. Discover new prospects via the Discovery Studio or import CSV leads.
        </p>
        <Link
          href="/dashboard/discovery"
          className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
        >
          Open Discovery Studio
        </Link>
      </div>
    );
  }

  const { business, score, outreachPack, pipeline } = selectedItem;
  const isAlreadyContacted = pipeline.stage === "CONTACTED";

  // Pick the active message template
  let currentMessageText = "";
  let currentDeepLink: string | undefined = undefined;

  if (activeChannel === "WHATSAPP_CASUAL") {
    currentMessageText = outreachPack.whatsappCasual.bodyText;
    currentDeepLink = outreachPack.whatsappCasual.whatsappDeepLink;
  } else if (activeChannel === "WHATSAPP_VALUE") {
    currentMessageText = outreachPack.whatsappConsultative.bodyText;
    currentDeepLink = outreachPack.whatsappConsultative.whatsappDeepLink;
  } else {
    currentMessageText = outreachPack.emailFormal?.bodyText || "No email available for this prospect.";
    currentDeepLink = outreachPack.emailFormal?.emailDeepLink;
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* Main 2-Column Split: Queue on Left, Message Drafter on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Lead Selection Queue (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Prospect Queue ({leads.length})
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold">
              Filter: {currentTier}
            </span>
          </div>

          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {leads.map((item) => {
              const b = item.business;
              const s = item.score;
              const isSelected = b.id === selectedLeadId;
              const contacted = item.pipeline.stage === "CONTACTED";

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedLeadId(b.id)}
                  className={`w-full text-left p-4 transition-colors flex items-start justify-between gap-3 ${
                    isSelected ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{b.name}</span>
                      {contacted && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                          Contacted
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {b.category} • {b.city}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.demandTier === "ACTIVELY_LOOKING"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : s.demandTier === "HIGH_DEMAND"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        }`}
                      >
                        {s.demandTier === "ACTIVELY_LOOKING" && "🔥 24h SLA"}
                        {s.demandTier === "HIGH_DEMAND" && "⚡ 48h SLA"}
                        {s.demandTier === "MEDIUM_DEMAND" && "💡 Weekly"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Score: {Math.round(s.priorityScore)}/100
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isSelected ? "text-primary translate-x-1" : "text-muted-foreground opacity-40"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Message Desk & Launch Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Business Context Card */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">{business.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {business.category} • {business.addressLine1 || business.city}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={
                    outreachPack.previewUrl.startsWith("http")
                      ? outreachPack.previewUrl.replace(/^https?:\/\/[^\/]+/, "")
                      : outreachPack.previewUrl
                  }
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Live Prototype
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleSuppress(business.id)}
                  title="Suppress lead"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <ShieldBan className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Evidence & Diagnosis Callout */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border text-xs space-y-1">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Identified Digital Presence Gap:
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {outreachPack.defectEvidence === "NO_WEBSITE" &&
                  "No independent website detected. Business currently loses inbound client searches and relies only on phone or social channels."}
                {outreachPack.defectEvidence === "EXPIRED_SSL" &&
                  "Expired SSL certificate warning. Browsers block prospective visitors with a security alert."}
                {outreachPack.defectEvidence === "SLOW_MOBILE" &&
                  "Mobile page speed is slow (> 5s load). High bounce rate on smartphone visits."}
                {outreachPack.defectEvidence === "GENERAL_IMPROVEMENT" &&
                  "Lacks 1-click WhatsApp appointment booking and modern mobile call-to-actions."}
              </p>
            </div>
          </div>

          {/* Interactive Message Drafter Card */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Outreach Draft Composer
              </span>

              {/* Angle Switcher */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveChannel("WHATSAPP_VALUE")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                    activeChannel === "WHATSAPP_VALUE"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MessageCircle className="h-3 w-3 text-emerald-500" />
                  WhatsApp Consultative
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel("WHATSAPP_CASUAL")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                    activeChannel === "WHATSAPP_CASUAL"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Zap className="h-3 w-3 text-amber-500" />
                  Quick Opener
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel("EMAIL")}
                  disabled={!business.email}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                    activeChannel === "EMAIL"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground disabled:opacity-40"
                  }`}
                >
                  <Mail className="h-3 w-3 text-blue-500" />
                  Email
                </button>
              </div>
            </div>

            {/* Email Subject Line (if email selected) */}
            {activeChannel === "EMAIL" && outreachPack.emailFormal && (
              <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-xs">
                <span className="font-semibold text-muted-foreground">Subject: </span>
                <span className="font-medium text-foreground">{outreachPack.emailFormal.subject}</span>
              </div>
            )}

            {/* Message Body Viewport */}
            <div className="relative">
              <textarea
                readOnly
                rows={7}
                value={currentMessageText}
                className="w-full p-4 rounded-xl bg-muted/20 border border-border text-xs font-mono leading-relaxed focus:outline-none resize-none select-all text-foreground"
              />
              <button
                type="button"
                onClick={() => handleCopy(currentMessageText)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-background/80 border border-border text-muted-foreground hover:text-foreground shadow-sm text-xs flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Launch Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                Target: {business.whatsappNumber || business.phone || business.email || "No contact info"}
              </div>

              <div className="flex items-center gap-2">
                {/* 1-Click WhatsApp or Email launcher */}
                {currentDeepLink ? (
                  <a
                    href={currentDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleMarkSent(business.id, activeChannel)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    1-Click Send & Update Pipeline
                  </a>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold cursor-not-allowed"
                  >
                    No Direct Deep Link
                  </button>
                )}

                {/* Manual Acknowledgment */}
                {!isAlreadyContacted && (
                  <button
                    type="button"
                    onClick={() => handleMarkSent(business.id, activeChannel)}
                    disabled={isPending}
                    className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-xs font-semibold hover:bg-muted/40 transition-colors"
                  >
                    Mark Sent
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
