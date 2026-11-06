import Link from "next/link";
import {
  Globe,
  Gauge,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Sparkles,
  Zap,
  Code2,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-sm">
              LP
            </div>
            <span className="font-bold text-xl tracking-tight">LeadPulse AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#services" className="hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="#process" className="hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#audit" className="hover:text-foreground transition-colors">
              Free Website Review
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-colors"
            >
              Operator Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden border-b border-border/40">
          <div className="container mx-auto max-w-5xl px-4 sm:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-8 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Modern Web Development & Business Automation for SMEs
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight sm:leading-none">
              Transform Your Local Business Into A{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent">
                High-Conversion Digital Engine
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We build fast, secure websites and automated booking portals that turn local searches into direct paying clients.
            </p>

            {/* Quick Free Audit Form */}
            <div id="audit" className="mt-10 max-w-xl mx-auto">
              <form className="flex flex-col sm:flex-row gap-3 p-2 rounded-xl bg-card border border-border shadow-xl">
                <input
                  type="text"
                  placeholder="Enter your website URL or business name..."
                  className="flex-1 px-4 py-3 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                >
                  Get Free Audit
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                Zero sales pressure. Receive an evidence-backed 1-page health report in your inbox.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 md:py-28 bg-muted/20 border-b border-border/40">
          <div className="container mx-auto max-w-7xl px-4 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Specialized Digital Services for Local Growth
              </h2>
              <p className="mt-4 text-muted-foreground">
                Proven technical solutions tailored for clinics, coaching institutes, hospitality, and local service providers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Custom Business Websites</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fast, mobile-first websites tailored to your brand. Convert visitors directly into phone calls and WhatsApp enquiries.
                </p>
              </div>

              {/* Service 2 */}
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Website Repair & Modernization</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fix expired SSL certificates, broken contact forms, 404 links, and slow mobile loading speeds that drive customers away.
                </p>
              </div>

              {/* Service 3 */}
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Online Booking & Automation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Streamlined appointment scheduling for clinics, tuition centres, and consultants. Reduce manual phone calls and admin bottlenecks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Process */}
        <section id="process" className="py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Simple, Transparent Process
              </h2>
              <p className="mt-4 text-muted-foreground">
                From initial assessment to live deployment in under 10 days.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Objective Audit", desc: "We analyze your mobile performance, SSL status, and local search visibility." },
                { step: "02", title: "Tailored Scope", desc: "Clear deliverable list, fixed timeline, and transparent pricing with no hidden fees." },
                { step: "03", title: "Rapid Build", desc: "Built with high-performance modern tech stacks ensuring lightning-fast load times." },
                { step: "04", title: "Ongoing Care", desc: "Continuous uptime monitoring, security patching, and monthly maintenance retainers." },
              ].map((item, idx) => (
                <div key={idx} className="relative p-6 rounded-xl border border-border bg-card">
                  <span className="text-4xl font-extrabold text-primary/20">{item.step}</span>
                  <h4 className="text-lg font-bold mt-2 mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/10 text-sm text-muted-foreground">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} LeadPulse AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/dashboard" className="text-primary hover:underline">Operator Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
