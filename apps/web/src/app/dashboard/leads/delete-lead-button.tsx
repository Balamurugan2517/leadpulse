"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteLeadAction } from "../../actions/lead-actions";

interface DeleteLeadButtonProps {
  leadId: string;
  leadName: string;
  redirectAfterDelete?: string;
  variant?: "icon" | "full";
}

export function DeleteLeadButton({
  leadId,
  leadName,
  redirectAfterDelete,
  variant = "icon",
}: DeleteLeadButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3500);
      return;
    }

    startTransition(async () => {
      const res = await deleteLeadAction(leadId);
      if (res.success) {
        if (redirectAfterDelete) {
          router.push(redirectAfterDelete);
        } else {
          router.refresh();
        }
      }
    });
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        title={`Delete ${leadName}`}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
          confirming
            ? "bg-[#B54740] text-white border-[#B54740]"
            : "border-[#B54740]/30 bg-[#FCE8E6] text-[#B54740] hover:bg-[#B54740] hover:text-white"
        }`}
      >
        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        {confirming ? "Click again to confirm" : "Delete Lead"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title={confirming ? "Click again to confirm deletion" : `Delete ${leadName}`}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
        confirming
          ? "bg-[#B54740] text-white"
          : "bg-[#FCE8E6] text-[#B54740] hover:bg-[#B54740] hover:text-white"
      }`}
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {confirming ? "Confirm?" : "Delete"}
    </button>
  );
}
