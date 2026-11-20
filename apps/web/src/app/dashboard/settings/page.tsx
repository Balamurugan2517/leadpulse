import {
  Settings,
  Shield,
  Key,
  Database,
  Building,
  CheckCircle2,
  Info,
  Sliders,
  Bell,
  Palette,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const isDbConfigured = Boolean(process.env.DATABASE_URL);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings & Operator Console
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure agency branding, discovery connectors, database connections, and outreach compliance rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="space-y-1 p-2 rounded-xl border border-border bg-card">
          <a
            href="#agency"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary/10 text-primary transition-colors"
          >
            <Building className="h-4 w-4" />
            Agency Profile & Branding
          </a>
          <a
            href="#connectors"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <Key className="h-4 w-4" />
            API Keys & Free Connectors
          </a>
          <a
            href="#database"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <Database className="h-4 w-4" />
            Database & System Telemetry
          </a>
          <a
            href="#compliance"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <Shield className="h-4 w-4" />
            Suppression & Compliance
          </a>
        </div>

        {/* Content Area (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Agency Profile */}
          <div id="agency" className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                Agency Profile & Quotation Branding
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Digital Agency Name</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="LeadPulse Digital Systems"
                  className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border font-medium focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Founder / Consultant Name</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="Solo Founder / Agency Principal"
                  className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border font-medium focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Official Contact Email</label>
                <input
                  type="email"
                  readOnly
                  defaultValue="contact@leadpulse.agency"
                  className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border font-medium focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Outreach WhatsApp Phone</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="+91 98400 00000"
                  className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border font-medium focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              These details are populated into the proposal builder and personalized WhatsApp openers.
            </p>
          </div>

          {/* Section 2: Connectors & Free APIs */}
          <div id="connectors" className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                Discovery Connectors (FOSS $0/mo Mode)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                100% Free Mode Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <span className="font-bold block">OpenStreetMap (Overpass API)</span>
                  <span className="text-[11px] text-muted-foreground">Free geographical node queries across Chennai & India</span>
                </div>
                <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected ($0/mo)
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Google Places Official API</span>
                  <span className="text-[11px] text-muted-foreground">Optional API Key (Uses free mock fallback if omitted)</span>
                </div>
                <span className="text-muted-foreground font-medium text-[10px]">
                  Free Offline Fallback
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <span className="font-bold block">YouTube Data API</span>
                  <span className="text-[11px] text-muted-foreground">Optional API Key (Local creator discovery)</span>
                </div>
                <span className="text-muted-foreground font-medium text-[10px]">
                  Free Offline Fallback
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Database & Telemetry */}
          <div id="database" className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                PostgreSQL & Database Telemetry
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isDbConfigured
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {isDbConfigured ? "Neon PostgreSQL Connected" : "Local Development Mode"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/20 border border-border text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Database Engine:</span>
                <span className="font-semibold text-foreground">PostgreSQL 16 / Neon Serverless</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ORM Layer:</span>
                <span className="font-semibold text-foreground">Drizzle ORM (Zero-Overhead SQL)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Queue Mode:</span>
                <span className="font-semibold text-foreground">SELECT ... FOR UPDATE SKIP LOCKED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">SSRF Defense Shield:</span>
                <span className="font-semibold text-emerald-500">Active (Loopback & RFC 1918 Blocked)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Compliance & Suppression */}
          <div id="compliance" className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Ethical Outreach & Anti-Spam Compliance
              </h2>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              LeadPulse strictly enforces a <strong>Human-in-the-Loop</strong> outreach model. No automated cold bot messaging or unauthorized scraping is permitted. Every single WhatsApp and Email touchpoint is presented for founder review and manual 1-click dispatch.
            </p>

            <div className="p-3 rounded-xl bg-muted/20 border border-border text-xs flex items-center justify-between">
              <div>
                <span className="font-bold block">Permanent Suppression List</span>
                <span className="text-[11px] text-muted-foreground">Prospects who opt out are permanently excluded from outreach.</span>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-muted text-muted-foreground">
                Active Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
