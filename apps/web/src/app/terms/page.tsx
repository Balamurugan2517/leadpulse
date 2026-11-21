import Link from "next/link";
import { Scale, ArrowLeft, ShieldAlert, CheckCircle, Terminal } from "lucide-react";

export default function TermsOfServicePage() {
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
            <Scale className="h-3.5 w-3.5" />
            Operational & Commercial Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Effective Date: November 21, 2026 • Governing Business Operations and Permitted Usage
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              1. Platform Purpose & Scope of License
            </h2>
            <p>
              LeadPulse AI grants authorized agency operators a non-exclusive, revocable license to utilize our software platform for legitimate commercial lead discovery, website diagnostics, proposal drafting, and client relationship management.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              2. Acceptable Use & Prohibited Activities
            </h2>
            <p>Users of LeadPulse AI agree never to utilize the service for:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>High-frequency automated botting, unsolicited bulk spamming, or phishing campaigns.</li>
              <li>Attempting to bypass server-side request forgery (SSRF) filters or probe internal network endpoints.</li>
              <li>Contacting individuals or entities that have requested inclusion in the Permanent Suppression list.</li>
              <li>Reselling raw lead exports to unauthorized third-party broker databases.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              3. Accuracy of Website Diagnostics & Prototype Demos
            </h2>
            <p>
              Website audits (including SSL certificate expiry, mobile responsiveness heuristics, and Lighthouse indicators) represent point-in-time automated observations conducted over public network interfaces. Prototype preview mockups are provided solely as consultative sales aids and do not constitute authorized client assets until formal contract execution.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              4. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising in connection with the platform shall be subject to the exclusive jurisdiction of the competent courts in Chennai, Tamil Nadu.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-card/20 text-xs text-muted-foreground">
        <div className="container mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} LeadPulse AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
