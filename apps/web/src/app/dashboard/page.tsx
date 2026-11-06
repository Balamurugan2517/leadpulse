import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  Send,
  Kanban,
  Clock,
  ArrowUpRight,
  Plus,
  Compass,
} from "lucide-react";

export default function DashboardCommandCentre() {
  const kpis = [
    {
      title: "Actively Looking",
      badge: "Tier 1: 24h SLA",
      count: "3",
      desc: "Explicit buying requests & RFPs",
      color: "border-primary/40 bg-primary/5 text-primary",
    },
    {
      title: "High Demand Gaps",
      badge: "Tier 2: Hot Leads",
      count: "14",
      desc: "No website or broken SSL/404s",
      color: "border-amber-500/40 bg-amber-500/5 text-amber-500",
    },
    {
      title: "Outreach Pending",
      badge: "Ready to Review",
      count: "8",
      desc: "WhatsApp & Email drafts ready",
      color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-500",
    },
    {
      title: "Pipeline Value",
      badge: "Active Discussions",
      count: "₹1,45,000",
      desc: "5 deals currently in discussion",
      color: "border-border bg-card text-foreground",
    },
  ];

  const quickActions = [
    {
      title: "Run Free Discovery",
      desc: "Search OpenStreetMap for Chennai businesses",
      href: "/dashboard/discovery",
      icon: Compass,
    },
    {
      title: "Review Outreach Queue",
      desc: "Inspect & 1-click send WhatsApp touchpoints",
      href: "/dashboard/outreach",
      icon: Send,
    },
    {
      title: "Track Sales Pipeline",
      desc: "Update meeting notes and close deals",
      href: "/dashboard/pipeline",
      icon: Kanban,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Command Centre</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here is your daily prospecting and revenue overview for Chennai & Tamil Nadu.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`p-5 rounded-xl border ${kpi.color} shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{kpi.title}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-current">
                {kpi.badge}
              </span>
            </div>
            <div className="text-3xl font-extrabold my-2">{kpi.count}</div>
            <p className="text-xs text-muted-foreground">{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              href={action.href}
              className="p-5 rounded-xl border border-border bg-card hover:border-primary/60 transition-all flex items-start gap-4 shadow-sm group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Today's Action Queue Table Preview */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">Priority Action Queue</h2>
            <p className="text-xs text-muted-foreground">Highest priority leads requiring review or follow-up today</p>
          </div>
          <Link
            href="/dashboard/leads"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all leads →
          </Link>
        </div>

        <div className="divide-y divide-border">
          {[
            {
              name: "Adyar Dental Studio",
              cat: "Dental Clinic",
              loc: "Adyar, Chennai",
              tier: "ACTIVELY_LOOKING",
              trigger: 'Posted on public directory: "Need website redesign & appointment booking"',
              gap: "Website Redesign",
            },
            {
              name: "Velachery Diagnostic Lab",
              cat: "Healthcare / Clinic",
              loc: "Velachery, Chennai",
              tier: "HIGH_DEMAND",
              trigger: "Active Google Maps presence (4.7 stars), but NO website found",
              gap: "No Website",
            },
            {
              name: "Marina Bay Seafood Cafe",
              cat: "Restaurant / Cafe",
              loc: "Mylapore, Chennai",
              tier: "HIGH_DEMAND",
              trigger: "Website target returns expired SSL certificate warning",
              gap: "Expired SSL",
            },
          ].map((lead, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{lead.name}</span>
                  <span className="text-xs text-muted-foreground">({lead.cat})</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lead.tier === "ACTIVELY_LOOKING"
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-amber-500/20 text-amber-500 border border-amber-500/40"
                  }`}>
                    {lead.tier === "ACTIVELY_LOOKING" ? "Actively Looking" : "High Demand"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{lead.trigger}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/outreach"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Send className="h-3 w-3" />
                  Review Draft
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
