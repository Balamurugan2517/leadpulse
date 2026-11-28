import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FFFCF5] text-[#26352C]">
      {/* Deep Sage Sidebar */}
      <aside className="w-64 border-r border-[#375241] bg-[#456451] text-white flex flex-col justify-between p-4 hidden md:flex">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F0E8] text-[#456451] font-bold">
              LP
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">LeadPulse AI</span>
              <span className="text-[10px] text-[#D2E3D5] uppercase tracking-widest font-semibold block">
                Operator Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <SidebarNav />
        </div>

        {/* System & Status Info */}
        <div className="p-3 rounded-lg border border-white/15 bg-white/10 text-xs text-white">
          <div className="flex items-center gap-2 mb-1.5 font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-[#E5F3E8] animate-pulse" />
            Worker Engine Active
          </div>
          <p className="text-[#E8F0E8] leading-relaxed">
            LeadPulse Light Theme v1.0 • Free & Open-Source Stack ($0/mo).
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#FFFCF5]">
        {/* Pure White Top Bar */}
        <header className="h-16 border-b border-[#D2E3D5] px-6 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E8F0E8] text-[#456451] border border-[#D2E3D5]">
              Workspace: PAN-India Solo Operator
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-medium text-[#647067] hover:text-[#456451] transition-colors"
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
