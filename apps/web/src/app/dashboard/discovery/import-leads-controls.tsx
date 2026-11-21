"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Download, CheckCircle2, Loader2, Plus, ArrowRight, Database } from "lucide-react";
import { importDiscoveredLeadsAction } from "../../actions/discovery-actions";
import { Business } from "@leadpulse/contracts";

export function ImportAllButton({ leads }: { leads: Business[] }) {
  const [isPending, startTransition] = useTransition();
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleImportAll = () => {
    startTransition(async () => {
      try {
        const res = await importDiscoveredLeadsAction(leads);
        setResultMessage(res.message || `Imported ${leads.length} leads!`);
      } catch (err: any) {
        setResultMessage(`Error: ${err.message}`);
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
      {resultMessage && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{resultMessage}</span>
          <Link href="/dashboard/leads" className="text-primary hover:underline font-bold flex items-center gap-0.5 ml-1">
            View CRM <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      <button
        type="button"
        disabled={isPending || leads.length === 0}
        onClick={handleImportAll}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving to Neon DB...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Import All {leads.length} to CRM
          </>
        )}
      </button>
    </div>
  );
}

export function SaveSingleLeadButton({ business }: { business: Business }) {
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      try {
        await importDiscoveredLeadsAction([business]);
        setIsSaved(true);
      } catch {
        // ignore
      }
    });
  };

  if (isSaved) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
        <CheckCircle2 className="h-3 w-3" />
        Saved
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleSave}
      title="Save this prospect to your CRM database"
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Plus className="h-3 w-3" />
      )}
      Save to CRM
    </button>
  );
}
