import Link from "next/link";
import {
  Compass,
  MapPin,
  Building2,
  Sparkles,
  Download,
  Bookmark,
  Radio,
  ExternalLink,
  CheckCircle2,
  Phone,
  MessageCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  runOsmDiscoveryAction,
  importDiscoveredLeadsAction,
  getIntentSignalsAction,
} from "../../actions/discovery-actions";
import { generateBrowserBookmarkletCode } from "@leadpulse/infrastructure";

interface DiscoveryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DiscoveryStudioPage({ searchParams }: DiscoveryPageProps) {
  const sParams = await searchParams;
  const selectedLocality = (typeof sParams.locality === "string" ? sParams.locality : "ALL_CHENNAI").toUpperCase();
  const selectedCategory = (typeof sParams.category === "string" ? sParams.category : "CLINIC").toUpperCase() as any;

  // Run discovery query
  const discoveryResult = await runOsmDiscoveryAction({
    category: selectedCategory,
    locality: selectedLocality,
  });

  const intentSignals = await getIntentSignalsAction();
  const bookmarkletCode = generateBrowserBookmarkletCode("http://localhost:3000");

  const localities = [
    { label: "All Chennai", value: "ALL_CHENNAI" },
    { label: "Anna Nagar", value: "ANNA_NAGAR" },
    { label: "Adyar", value: "ADYAR" },
    { label: "T. Nagar", value: "T_NAGAR" },
    { label: "Velachery", value: "VELACHERY" },
    { label: "Mylapore", value: "MYLAPORE" },
    { label: "Tambaram", value: "TAMBARAM" },
  ];

  const categories = [
    { label: "Dental & Clinics", value: "CLINIC" },
    { label: "Tuition & Coaching", value: "EDUCATION" },
    { label: "Restaurants & Cafes", value: "RESTAURANT" },
    { label: "CA & Professionals", value: "PROFESSIONAL" },
    { label: "Salons & Services", value: "SERVICES" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Discovery Studio</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Scan open geographical data and public syndication feeds across Chennai with zero paid API subscriptions.
        </p>
      </div>

      {/* Top Banner: Free & OpenStreetMap Powered */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overpass Query Form Card */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              OpenStreetMap (Overpass) Discovery
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              100% Free / ODbL
            </span>
          </div>

          <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Target Locality in Chennai
              </label>
              <select
                name="locality"
                defaultValue={selectedLocality}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {localities.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Target Industry / Category
              </label>
              <select
                name="category"
                defaultValue={selectedCategory}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Compass className="h-4 w-4" />
                Run Discovery Scan
              </button>
            </div>
          </form>
        </div>

        {/* 1-Click Browser Bookmarklet Card */}
        <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Bookmark className="h-4 w-4" />
            Quick-Capture Bookmarklet
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Drag the button below to your browser’s bookmarks bar. While browsing Google Maps or Instagram, click it to instantly import the business into your LeadPulse database!
          </p>

          <div className="pt-2">
            <a
              href={bookmarkletCode}
              onClick={(e) => {
                // If clicked, copy code or prompt
                navigator.clipboard.writeText(bookmarkletCode);
                alert("Bookmarklet link copied! Drag it to your bookmarks bar or paste into a new bookmark.");
              }}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-grab active:cursor-grabbing"
              title="Drag this button to your bookmarks bar"
            >
              <Sparkles className="h-3.5 w-3.5" />
              + LeadPulse Capture (Drag Me)
            </a>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            Zero scraping scripts. Safe and compliant with all platform terms.
          </p>
        </div>
      </div>

      {/* Discovered Leads Section */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>Discovered Prospects in {selectedLocality.replace(/_/g, " ")}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {discoveryResult.totalFound} found
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Source: OpenStreetMap data ({discoveryResult.source}). Automatic demand scoring applied.
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              const rawBusinesses = discoveryResult.leads.map((l) => l.business);
              await importDiscoveredLeadsAction(rawBusinesses);
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" />
              Import All {discoveryResult.totalFound} to CRM
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="divide-y divide-border border-t border-border mt-4">
          {discoveryResult.leads.map((item, idx) => {
            const b = item.business;
            const s = item.score;
            const cleanPhone = (b.whatsappNumber || b.phone || "").replace(/[^0-9]/g, "");

            return (
              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{b.name}</span>
                    <span className="text-xs text-muted-foreground">({b.category})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.demandTier === "ACTIVELY_LOOKING"
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : s.demandTier === "HIGH_DEMAND"
                          ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                      }`}
                    >
                      {s.demandTier === "ACTIVELY_LOOKING" && "🔥 Actively Looking"}
                      {s.demandTier === "HIGH_DEMAND" && "⚡ High Demand"}
                      {s.demandTier === "MEDIUM_DEMAND" && "💡 Medium Demand"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
                    <span>📍 {b.addressLine1}</span>
                    <span>📞 {b.phone || "No phone listed"}</span>
                    <span>🌐 {b.sourceUrl ? b.sourceUrl : "No Website (Gap Detected)"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {cleanPhone && (
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  )}
                  <Link
                    href={`/preview/${b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}?name=${encodeURIComponent(b.name)}&category=${encodeURIComponent(b.category)}&phone=${encodeURIComponent(b.phone || "")}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    Preview
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Public Opportunity / RFP Intent Feeds Section */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary animate-pulse" />
            Live High-Intent Signals & RFPs
          </h2>
          <span className="text-xs text-muted-foreground">Scanned every 6 hours</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intentSignals.map((signal) => (
            <div key={signal.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-xs leading-snug text-foreground">{signal.title}</h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary shrink-0">
                  Intent Score: {signal.intentScore}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{signal.summary}</p>
              <div className="flex items-center justify-between pt-2 text-[10px] text-muted-foreground border-t border-border">
                <span>Feed: {signal.sourceFeed}</span>
                <a
                  href={signal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  View Original Post <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
