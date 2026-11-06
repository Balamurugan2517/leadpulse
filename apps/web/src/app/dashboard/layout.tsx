import Link from "next/link";
import {
  LayoutDashboard,
  Compass,
  Users,
  Activity,
  Send,
  Kanban,
  Settings,
  Shield,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Command Centre", href: "/dashboard", icon: LayoutDashboard },
    { label: "Discovery Studio", href: "/dashboard/discovery", icon: Compass },
    { label: "Lead Explorer", href: "/dashboard/leads", icon: Users },
    { label: "Website Audit Lab", href: "/dashboard/audit-lab", icon: Activity },
    { label: "Outreach Desk", href: "/dashboard/outreach", icon: Send },
    { label: "Sales Pipeline", href: "/dashboard/pipeline", icon: Kanban },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col justify-between p-4 hidden md:flex">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              LP
            </div>
            <div>
              <span className="font-bold text-base tracking-tight block">LeadPulse AI</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold block">Operator Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System & Status Info */}
        <div className="p-3 rounded-lg border border-border bg-muted/20 text-xs">
          <div className="flex items-center gap-2 mb-1.5 font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Worker Engine Active
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Connected to Neon DB. Free & Open-Source Stack ($0/mo).
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
              Workspace: Chennai Solo Operator
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View Public Website ↗
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
