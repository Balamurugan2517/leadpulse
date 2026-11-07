import { Sparkles, Building2, Phone, Globe, MapPin, CheckCircle2, Bookmark } from "lucide-react";
import { quickCaptureSubmitAction } from "../../../actions/discovery-actions";
import { redirect } from "next/navigation";

interface QuickCapturePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function QuickCapturePopupPage({ searchParams }: QuickCapturePageProps) {
  const sParams = await searchParams;

  const prefillName = typeof sParams.name === "string" ? sParams.name : "";
  const prefillUrl = typeof sParams.url === "string" ? sParams.url : "";
  const prefillPhone = typeof sParams.phone === "string" ? sParams.phone : "";
  const prefillNotes = typeof sParams.notes === "string" ? sParams.notes : "";

  async function handleCapture(formData: FormData) {
    "use server";
    await quickCaptureSubmitAction(formData);
    redirect("/dashboard/leads");
  }

  return (
    <div className="min-h-screen bg-background p-6 text-foreground flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full p-6 rounded-2xl border border-border bg-card shadow-xl space-y-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center">
            <Bookmark className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-base font-bold">1-Click Quick-Capture</h1>
            <p className="text-[11px] text-muted-foreground">Pre-extracted from your active browser tab</p>
          </div>
        </div>

        <form action={handleCapture} className="space-y-4 text-xs">
          {/* Business Name */}
          <div className="space-y-1">
            <label className="font-semibold flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              Business Name *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={prefillName}
              placeholder="e.g. Anna Nagar Dental Studio"
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Source URL */}
          <div className="space-y-1">
            <label className="font-semibold flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-primary" />
              Source / Profile URL
            </label>
            <input
              type="url"
              name="url"
              defaultValue={prefillUrl}
              placeholder="https://maps.google.com/... or Instagram link"
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="font-semibold flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" />
              Detected Phone / WhatsApp
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={prefillPhone}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category & City */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold">Category</label>
              <input
                type="text"
                name="category"
                defaultValue="Dental Clinic"
                className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">City</label>
              <input
                type="text"
                name="city"
                defaultValue="Chennai"
                className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Observed Gap */}
          <div className="space-y-1">
            <label className="font-semibold">Observed Digital Gap</label>
            <select
              name="observedGap"
              defaultValue="NO_WEBSITE"
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="NO_WEBSITE">No Website (Relies only on Maps / Social)</option>
              <option value="BROKEN_WEBSITE">Broken Website (SSL warning or 404s)</option>
              <option value="OUTDATED_WEBSITE">Outdated Website (Slow or Desktop only)</option>
              <option value="EXPLICIT_INTENT">Explicit Request (Looking for Developer)</option>
            </select>
          </div>

          {/* Selected Notes */}
          <div className="space-y-1">
            <label className="font-semibold">Captured Notes</label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={prefillNotes}
              placeholder="Highlight text on the page to automatically capture here..."
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Save Prospect & Queue Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
