import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Phone,
  MessageCircle,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { getLeadsAction, importCsvLeadsAction } from "../../actions/lead-actions";
import { DeleteLeadButton } from "./delete-lead-button";

export default async function LeadExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await searchParams;
  const search = typeof sParams.q === "string" ? sParams.q : undefined;
  const demandTier = typeof sParams.tier === "string" ? sParams.tier : undefined;
  const category = typeof sParams.category === "string" ? sParams.category : undefined;

  const leads = await getLeadsAction({ search, demandTier, category });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lead Explorer</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage, filter, and prioritize discovered B2B clients across Chennai & Tamil Nadu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/leads/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <form className="relative flex-1 w-full" method="GET">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={search || ""}
            placeholder="Search by business name, phone, or category..."
            className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          {[
            { label: "All Leads", tier: "ALL" },
            { label: "🔥 Actively Looking", tier: "ACTIVELY_LOOKING" },
            { label: "⚡ High Demand", tier: "HIGH_DEMAND" },
            { label: "💡 Medium", tier: "MEDIUM_DEMAND" },
          ].map((item) => {
            const isActive = (demandTier || "ALL") === item.tier;
            return (
              <Link
                key={item.tier}
                href={`/dashboard/leads?tier=${item.tier}${search ? `&q=${search}` : ""}`}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Business & Category</th>
                <th className="px-6 py-3.5">Demand Tier</th>
                <th className="px-6 py-3.5">Identified Gap / Intent</th>
                <th className="px-6 py-3.5">Contact & WhatsApp</th>
                <th className="px-6 py-3.5">Prototype Preview</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <p className="text-sm font-medium">No leads match your selected filters.</p>
                    <p className="text-xs mt-1">Try clearing your search query or import a CSV file.</p>
                  </td>
                </tr>
              ) : (
                leads.map((item: any) => {
                  const b = item.business;
                  const s = item.score;
                  const p = item.pipeline;
                  const cleanPhone = (b.whatsappNumber || b.phone || "").replace(/[^0-9]/g, "");
                  const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

                  const tierStyles: Record<string, string> = {
                    ACTIVELY_LOOKING: "bg-primary/10 text-primary border-primary/30",
                    HIGH_DEMAND: "bg-amber-500/10 text-amber-500 border-amber-500/30",
                    MEDIUM_DEMAND: "bg-blue-500/10 text-blue-500 border-blue-500/30",
                    LOW_DEMAND: "bg-slate-500/10 text-slate-400 border-slate-500/30",
                  };

                  return (
                    <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                      {/* Name & Category */}
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/leads/${b.id}`} className="font-semibold text-foreground hover:text-primary transition-colors block">
                          {b.name}
                        </Link>
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          {b.category} • {b.city}
                        </span>
                      </td>

                      {/* Demand Tier Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierStyles[s?.demandTier || "LOW_DEMAND"]}`}>
                          {s?.demandTier === "ACTIVELY_LOOKING" && "🔥 Actively Looking"}
                          {s?.demandTier === "HIGH_DEMAND" && "⚡ High Demand"}
                          {s?.demandTier === "MEDIUM_DEMAND" && "💡 Medium Demand"}
                          {(!s?.demandTier || s?.demandTier === "LOW_DEMAND") && "⏳ Low Demand"}
                        </span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          Score: {s?.priorityScore || "0"}/100
                        </span>
                      </td>

                      {/* Identified Gap / Reason */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-foreground font-medium truncate">
                          {s?.scoreReasons?.[0] || (b.sourceUrl ? "Audit Pending" : "No Website")}
                        </p>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Source: {b.sourceType}
                        </span>
                      </td>

                      {/* Phone & 1-Click WhatsApp */}
                      <td className="px-6 py-4">
                        {b.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono">{b.phone}</span>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open WhatsApp"
                                className="h-6 w-6 rounded bg-emerald-600/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No Phone</span>
                        )}
                      </td>

                      {/* Live Prototype Link */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/preview/${slug}?name=${encodeURIComponent(b.name)}&category=${encodeURIComponent(b.category)}&phone=${encodeURIComponent(b.phone || "")}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                        >
                          <Sparkles className="h-3 w-3" />
                          View Prototype ↗
                        </Link>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/dashboard/leads/${b.id}`}
                            className="px-2.5 py-1 rounded bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
                          >
                            Details
                          </Link>
                          <Link
                            href={`/dashboard/outreach?leadId=${b.id}`}
                            className="px-2.5 py-1 rounded bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                          >
                            Outreach
                          </Link>
                          <DeleteLeadButton leadId={b.id} leadName={b.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Quick Import Section */}
      <div className="p-6 rounded-xl border border-dashed border-border bg-card/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              Quick CSV Lead Import
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Paste or upload business records from any CSV or spreadsheet. Automatic formula sanitization & deduplication enabled.
            </p>
          </div>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            const text = formData.get("csvContent") as string;
            if (text && text.trim()) {
              await importCsvLeadsAction(text);
            }
          }}
          className="mt-4 space-y-3"
        >
          <textarea
            name="csvContent"
            rows={3}
            placeholder={`Business Name,Category,Phone,Website,City\n"Adyar Dental Studio",Dental,+919876543210,https://adyardental.in,Chennai\n"Marina Seafood Cafe",Restaurant,9840112233,,Chennai`}
            className="w-full p-3 bg-muted/30 border border-border rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors shadow-sm"
          >
            <Upload className="h-3.5 w-3.5" />
            Process & Import Leads
          </button>
        </form>
      </div>
    </div>
  );
}
