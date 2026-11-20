import Link from "next/link";
import {
  Send,
  MessageCircle,
  Sparkles,
  Flame,
  Zap,
  Clock,
  Filter,
} from "lucide-react";
import { getLeadsForOutreachDesk } from "../../actions/outreach-actions";
import { OutreachClient } from "./outreach-client";

interface OutreachPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OutreachDeskPage({ searchParams }: OutreachPageProps) {
  const sParams = await searchParams;
  const selectedTier = (typeof sParams.tier === "string" ? sParams.tier : "ALL").toUpperCase();

  const leads = await getLeadsForOutreachDesk(selectedTier);

  const tiers = [
    { label: "All Tiers", value: "ALL" },
    { label: "🔥 Actively Looking (24h)", value: "ACTIVELY_LOOKING" },
    { label: "⚡ High Demand (48h)", value: "HIGH_DEMAND" },
    { label: "💡 Medium Demand (Weekly)", value: "MEDIUM_DEMAND" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Send className="h-6 w-6 text-primary" />
            Outreach Desk & WhatsApp Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review personalized, evidence-backed WhatsApp and Email pitches with 1-click live prototype preview links.
          </p>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
          {tiers.map((t) => (
            <Link
              key={t.value}
              href={`/dashboard/outreach?tier=${t.value}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedTier === t.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Outreach Client */}
      <OutreachClient initialLeads={leads} currentTier={selectedTier} />
    </div>
  );
}
