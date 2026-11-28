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
import { MultiChannelConnectors } from "./multi-channel-connectors";
import { BookmarkletButton } from "./bookmarklet-button";
import { DiscoverySearchForm } from "./discovery-search-form";
import { ImportAllButton, SaveSingleLeadButton } from "./import-leads-controls";

interface DiscoveryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DiscoveryStudioPage({ searchParams }: DiscoveryPageProps) {
  const sParams = await searchParams;
  const selectedLocality = (typeof sParams.locality === "string" ? sParams.locality : "ALL_CHENNAI").toUpperCase();
  const selectedCategory = (typeof sParams.category === "string" ? sParams.category : "CLINIC").toUpperCase() as any;
  const selectedLimit = typeof sParams.limit === "string" ? Math.min(parseInt(sParams.limit, 10) || 25, 1000) : 25;
  const selectedRadius = typeof sParams.radius === "string" ? parseInt(sParams.radius, 10) || 5 : 5;
  const selectedSource = (typeof sParams.source === "string" ? sParams.source : "OSM").toUpperCase() as any;

  // Run discovery query
  const discoveryResult = await runOsmDiscoveryAction({
    category: selectedCategory,
    locality: selectedLocality,
    radiusKm: selectedRadius,
    source: selectedSource,
    limit: selectedLimit,
  });

  const intentSignals = await getIntentSignalsAction();
  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const bookmarkletCode = generateBrowserBookmarkletCode(appBaseUrl);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Discovery Studio</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Scan open geographical data and public syndication feeds across PAN India with zero paid API subscriptions.
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

          <DiscoverySearchForm
            initialLocality={selectedLocality}
            initialCategory={selectedCategory}
            initialLimit={selectedLimit}
            initialRadius={selectedRadius}
            initialSource={selectedSource}
          />
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
            <BookmarkletButton bookmarkletCode={bookmarkletCode} />
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

          <ImportAllButton leads={discoveryResult.leads.map((l) => l.business)} />
        </div>

        {/* Scrollable Results List (ENH-011) */}
        <div className="max-h-[540px] overflow-y-auto leadpulse-scroll divide-y divide-border border-t border-border mt-4 pr-2">
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

                  <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>📍 {b.addressLine1}, {b.city}, {b.state}</span>
                    <span>📞 <strong className="text-foreground">{b.phone || "No phone listed"}</strong></span>
                    {b.email && <span>✉️ {b.email}</span>}
                    <span>🌐 {b.sourceUrl ? (
                      <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {b.sourceUrl}
                      </a>
                    ) : (
                      <span className="text-amber-500 font-semibold">No Website (High Demand Gap)</span>
                    )}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <SaveSingleLeadButton business={b} />
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

      {/* Multi-Channel Connectors (Google Places, YouTube & Social Profile Analysis) */}
      <MultiChannelConnectors />

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
