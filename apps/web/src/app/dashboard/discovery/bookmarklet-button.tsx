"use client";

import { useState } from "react";
import { Sparkles, Check } from "lucide-react";

export function BookmarkletButton({ bookmarkletCode }: { bookmarkletCode: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(bookmarkletCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-2">
      <a
        href={bookmarkletCode}
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-grab active:cursor-grabbing"
        title="Drag this button to your browser bookmarks bar"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {copied ? "Copied! Drag to Bookmarks Bar" : "+ LeadPulse Capture (Drag Me)"}
      </a>
      {copied && (
        <p className="text-[10px] text-emerald-500 font-semibold text-center flex items-center justify-center gap-1">
          <Check className="h-3 w-3" />
          Code copied! Drag to bookmarks bar or paste as a new bookmark.
        </p>
      )}
    </div>
  );
}
