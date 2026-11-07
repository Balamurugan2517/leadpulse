import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Mail,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Send,
  Trash2,
  ExternalLink,
  Kanban,
  CheckCircle2,
} from "lucide-react";
import { getLeadDetailAction, suppressLeadAction } from "../../../actions/lead-actions";
import { generateOutreachDrafts } from "@leadpulse/domain";
import { redirect } from "next/navigation";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const leadData = await getLeadDetailAction(id);

  if (!leadData) {
    notFound();
  }

  const { business, assets, audits, score, pipeline } = leadData;
  const cleanPhone = (business.whatsappNumber || business.phone || "").replace(/[^0-9]/g, "");
  const slug = business.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Generate customized message drafts with prototype preview link
  const drafts = generateOutreachDrafts(
    business as any,
    audits?.[0] as any || null,
    score as any || { needFitScore: 50, scoreReasons: [] },
    "http://localhost:3000"
  );

  const whatsappDraft = drafts.find((d) => d.channel === "WHATSAPP");

  async function handleSuppress() {
    "use server";
    await suppressLeadAction(id);
    redirect("/dashboard/leads");
  }

  const tierStyles: Record<string, string> = {
    ACTIVELY_LOOKING: "bg-primary/10 text-primary border-primary/30",
    HIGH_DEMAND: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    MEDIUM_DEMAND: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    LOW_DEMAND: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/leads"
            className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">{business.name}</h1>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tierStyles[score?.demandTier || "LOW_DEMAND"]}`}>
                {score?.demandTier === "ACTIVELY_LOOKING" && "🔥 Actively Looking"}
                {score?.demandTier === "HIGH_DEMAND" && "⚡ High Demand"}
                {score?.demandTier === "MEDIUM_DEMAND" && "💡 Medium Demand"}
                {(!score?.demandTier || score?.demandTier === "LOW_DEMAND") && "⏳ Low Demand"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {business.category} • {business.city}, {business.state} • Stage:{" "}
              <strong className="text-foreground">{pipeline?.stage || "DISCOVERED"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {whatsappDraft?.whatsappDeepLink && (
            <a
              href={whatsappDraft.whatsappDeepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Send WhatsApp Pitch
            </a>
          )}
          <form action={handleSuppress}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/10 transition-colors"
              title="Suppress lead from future searches"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Suppress
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contact & Audit Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Micro-Site Prototype Banner Card */}
          <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary tracking-wider uppercase mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Instant Live Prototype (ADR-008)
                </span>
                <h3 className="text-base font-bold text-foreground">Interactive Website Demo Ready to Share</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-lg">
                  A high-speed prototype has been compiled for {business.name}. Share this link in your outreach so the client sees their own brand, rating, and 1-click booking live on their phone.
                </p>
              </div>

              <Link
                href={`/preview/${slug}?name=${encodeURIComponent(business.name)}&category=${encodeURIComponent(business.category)}&phone=${encodeURIComponent(business.phone || "")}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0 shadow-sm"
              >
                Open Live Preview
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Technical Audit Findings */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Technical Audit & Digital Gap Evidence
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-border bg-muted/20">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Website Status</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">
                  {business.sourceUrl ? "Target URL Found" : "No Website Found"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-muted/20">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">SSL Security</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">
                  {audits?.[0]?.sslValid === false ? "⚠️ Expired / Invalid" : business.sourceUrl ? "Valid SSL" : "N/A (No Site)"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-muted/20">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Mobile Performance</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">
                  {audits?.[0]?.lighthousePerformance ? `${audits[0].lighthousePerformance}/100` : "Audit Queued"}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-foreground block">Score Evaluation Reasons:</span>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {score?.scoreReasons?.length ? (
                  score.scoreReasons.map((reason: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {reason}
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    Standard qualification pending complete worker crawl.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Contact & Location Details */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-base">Business Intelligence Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>Phone: <strong className="text-foreground">{business.phone || "Not listed"}</strong></span>
              </div>

              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>Email: <strong className="text-foreground">{business.email || "Not listed"}</strong></span>
              </div>

              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Globe className="h-4 w-4 text-primary shrink-0" />
                <span>Website: <strong className="text-foreground">{business.sourceUrl || "None"}</strong></span>
              </div>

              <div className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Location: <strong className="text-foreground">{business.addressLine1 || business.city}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-drafted WhatsApp & Pipeline Status */}
        <div className="space-y-6">
          {/* WhatsApp Pitch Draft Box */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                Prepared WhatsApp Outreach
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                Ready to Send
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs leading-relaxed font-sans text-foreground">
              {whatsappDraft?.bodyText}
            </div>

            {whatsappDraft?.whatsappDeepLink ? (
              <a
                href={whatsappDraft.whatsappDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                Launch WhatsApp Web (1-Click)
              </a>
            ) : (
              <p className="text-xs text-muted-foreground text-center">Add a phone number to enable 1-click WhatsApp.</p>
            )}
          </div>

          {/* Demand Score Card */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <h3 className="font-bold text-sm">Demand Score Summary</h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-foreground">{score?.priorityScore || "0"}</span>
              <span className="text-xs text-muted-foreground font-semibold">out of 100</span>
            </div>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Need Fit Score:</span>
                <strong className="text-foreground">{score?.needFitScore || "0"}/100</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Buying Intent:</span>
                <strong className="text-foreground">{score?.intentScore || "0"}/100</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Reachability:</span>
                <strong className="text-foreground">{score?.reachabilityScore || "0"}/100</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
