"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Users,
  Activity,
  Send,
  Kanban,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Command Centre", href: "/dashboard", icon: LayoutDashboard },
  { label: "Discovery Studio", href: "/dashboard/discovery", icon: Compass },
  { label: "Lead Explorer", href: "/dashboard/leads", icon: Users },
  { label: "Website Audit Lab", href: "/dashboard/audit-lab", icon: Activity },
  { label: "Outreach Desk", href: "/dashboard/outreach", icon: Send },
  { label: "Sales Pipeline", href: "/dashboard/pipeline", icon: Kanban },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#E8F0E8] text-[#456451] font-semibold"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-[#456451]" : "text-white/80"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
