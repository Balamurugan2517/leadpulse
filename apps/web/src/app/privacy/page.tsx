import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/20 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to LeadPulse AI
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              LP
            </div>
            <span className="font-bold text-base tracking-tight">LeadPulse AI</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 md:py-16 space-y-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Ethical Data & Privacy Commitment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last Updated: November 21, 2026 • Compliant with DPDPA 2023 & Ethical Outreach Guidelines
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              1. Information We Collect & Sourcing Ethics
            </h2>
            <p>
              LeadPulse AI operates exclusively as a B2B business intelligence and website diagnostics platform for digital service agencies. We collect solely publicly accessible commercial business listings from:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>OpenStreetMap (OSM) public geographical nodes and commercial points of interest.</li>
              <li>Publicly listed business websites, public domain DNS records, and TLS certificate transparency logs.</li>
              <li>Public commercial directory listings and registered business contact channels.</li>
            </ul>
            <p className="font-semibold text-foreground">
              We never scrape private personal consumer records, non-business social media feeds, personal chats, or confidential credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              2. How Business Data Is Used
            </h2>
            <p>Collected business information (such as enterprise name, public contact phone, website URL, and published locality) is processed exclusively for:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Running non-invasive technical website diagnostics (SSL certificate validity, mobile responsiveness, and page speed).</li>
              <li>Generating digital modernization recommendations and consultative evidence packs.</li>
              <li>Facilitating direct, human-reviewed, non-automated business inquiries by qualified agency founders.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              3. Human-in-the-Loop & Anti-Spam Guarantee
            </h2>
            <p>
              LeadPulse AI enforces a strict zero-automation policy for cold outreach. Our software does not execute headless mass messaging bots, unconsented email blasts, or automated telephony robocalls. Every single touchpoint is prepared as an interactive draft for human founder inspection, personal evaluation, and manual 1-click dispatch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              4. Permanent Suppression & Opt-Out Rights
            </h2>
            <p>
              Under the Digital Personal Data Protection Act (DPDPA 2023) and global privacy standards, any business or principal owner has the right to request immediate and permanent exclusion from LeadPulse AI search indexes and operator directories.
            </p>
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-xs text-foreground">
                To request permanent domain or phone suppression, contact our privacy officer at{" "}
                <span className="font-mono text-primary font-bold">privacy@leadpulse.agency</span> or use the 1-click <strong>Suppress Lead</strong> action inside the LeadPulse dashboard. All suppression records are permanently enforced across all future searches.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-card/20 text-xs text-muted-foreground">
        <div className="container mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} LeadPulse AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/" className="hover:text-foreground">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
