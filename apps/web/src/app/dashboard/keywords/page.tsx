import {
  Tag,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  Clock,
  ShieldCheck,
  Search,
  IndianRupee,
} from "lucide-react";
import {
  SEED_KEYWORD_PACKS,
  DEFAULT_SERVICE_CATALOG,
  matchKeywordsInText,
} from "@leadpulse/domain";

interface KeywordsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function KeywordsAndScoringPage({ searchParams }: KeywordsPageProps) {
  const sParams = await searchParams;
  const testText = typeof sParams.test === "string" ? sParams.test : "";

  const matchResult = testText ? matchKeywordsInText(testText) : null;

  const packDescriptions: Record<string, { label: string; desc: string; badgeColor: string }> = {
    NO_WEBSITE: {
      label: "No Website (Absence Signals)",
      desc: "Detects businesses relying solely on Google Maps, WhatsApp, or Instagram.",
      badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    BROKEN_WEBSITE: {
      label: "Broken Website (Defects & Errors)",
      desc: "Detects expired SSL security certificates, 404s, 500 server crashes, and broken forms.",
      badgeColor: "bg-destructive/10 text-destructive border-destructive/20",
    },
    OUTDATED_WEBSITE: {
      label: "Outdated Website (Mobile & Speed)",
      desc: "Detects desktop-only layouts, slow mobile load time (> 5s), and outdated designs.",
      badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    LOW_REVIEWS: {
      label: "Low Review Volume",
      desc: "Flags local businesses with very few reviews compared to category peers in Chennai.",
      badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    NEGATIVE_SENTIMENT: {
      label: "Recent Negative Sentiment Themes",
      desc: "Identifies recurring operational complaints regarding booking bottlenecks or phone delays.",
      badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },
    BUYING_INTENT: {
      label: "Explicit Buying Intent (Tier 1 Signals)",
      desc: "High-priority requests actively seeking a web developer, website redesign, or RFP.",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
    },
    NEGATIVE_EXCLUSIONS: {
      label: "Negative Keyword Exclusions",
      desc: "Filters out job postings, resumes, tutorials, and free website builder queries.",
      badgeColor: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Keyword Taxonomy & Service Catalog</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configurable search signals, demand qualification packs, and service deliverable packages with pricing in INR.
        </p>
      </div>

      {/* Interactive Signal Matcher Simulator */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Live Keyword Signal Matcher
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test any public post, review snippet, or business description against the taxonomy engine.
          </p>
        </div>

        <form method="GET" className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="test"
            defaultValue={testText}
            placeholder='e.g. "Looking for a web developer to build an appointment booking site for our dental clinic in Anna Nagar"'
            className="flex-1 px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm shrink-0"
          >
            <Search className="h-4 w-4" />
            Evaluate Text
          </button>
        </form>

        {matchResult && (
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Matched Signals:</span>
              <span className="font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                Intent Score: {matchResult.intentScore}/100
              </span>
            </div>

            {matchResult.isExcluded ? (
              <p className="text-destructive font-semibold">
                ⚠️ Contains negative exclusion keyword. Lead automatically skipped.
              </p>
            ) : matchResult.matchedPacks.length === 0 ? (
              <p className="text-muted-foreground">No explicit signals detected in the evaluated text.</p>
            ) : (
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-2">
                  {matchResult.matchedPacks.map((pack) => (
                    <span key={pack} className="px-2.5 py-1 rounded-md bg-card border border-border font-semibold">
                      Pack: {pack}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Matched Keywords: <strong className="text-foreground">{matchResult.matchedKeywords.join(", ")}</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5 Core Seed Keyword Packs */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          5 Mandatory Discovery Keyword Packs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(SEED_KEYWORD_PACKS).map(([key, keywords]) => {
            const info = packDescriptions[key] || {
              label: key,
              desc: "Custom keyword pack",
              badgeColor: "bg-muted text-muted-foreground border-border",
            };

            return (
              <div key={key} className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-sm text-foreground">{info.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${info.badgeColor}`}>
                      {keywords.length} terms
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{info.desc}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                  {keywords.map((kw, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-muted/40 text-[11px] font-mono text-foreground border border-border/60">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Catalog & Deliverables */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Service Catalog & Packaging (Pricing in INR)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Targeted service offerings matched to detected digital gaps with predefined deliverable checklists.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_SERVICE_CATALOG.map((service) => (
            <div key={service.code} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-foreground leading-snug">{service.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                    {service.code}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border text-xs space-y-1">
                  <span className="font-bold text-muted-foreground block text-[10px] uppercase">Typical Trigger:</span>
                  <p className="text-foreground">{service.typicalTrigger}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground block">Included Deliverables:</span>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {service.deliverables.map((deliv, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Indicative Pricing</span>
                  <span className="text-sm font-extrabold text-foreground flex items-center">
                    ₹{service.indicativePriceInr.min.toLocaleString()} – ₹{service.indicativePriceInr.max.toLocaleString()}
                  </span>
                </div>

                {service.recurringSupportOption && (
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                    + Maintenance Retainer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
