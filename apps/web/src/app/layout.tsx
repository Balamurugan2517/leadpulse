import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadPulse AI - B2B Lead Intelligence & Digital Services",
  description:
    "Discover high-demand businesses, detect digital gaps, and deliver high-performance web development and automation services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFCF5] text-[#26352C] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
