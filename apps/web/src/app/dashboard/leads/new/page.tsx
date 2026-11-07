import Link from "next/link";
import { ArrowLeft, Plus, Building2, Phone, Globe, MapPin, Mail, FileText } from "lucide-react";
import { createLeadAction } from "../../../actions/lead-actions";
import { redirect } from "next/navigation";

export default function NewLeadPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const res = await createLeadAction(formData);
    if (res.success && res.lead?.id) {
      redirect(`/dashboard/leads/${res.lead.id}`);
    } else {
      redirect("/dashboard/leads");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/leads"
          className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Business Lead</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manually enter a discovered prospect. Automatic technical audit and demand score will be generated.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
        <form action={handleSubmit} className="space-y-6">
          {/* Business Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Business Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Anna Nagar Dental Spa"
                className="w-full px-3.5 py-2.5 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Category / Industry *
              </label>
              <input
                type="text"
                name="category"
                required
                placeholder="e.g. Dental Clinic, Cafe, CA Firm"
                className="w-full px-3.5 py-2.5 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Business Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="info@business.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Website URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-primary" />
              Website URL (Leave blank if business has NO website)
            </label>
            <input
              type="url"
              name="website"
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-[11px] text-muted-foreground">
              If left blank, the system automatically classifies this lead under high-demand website development.
            </p>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Street Address / Area
              </label>
              <input
                type="text"
                name="address"
                placeholder="12, 2nd Avenue, Anna Nagar"
                className="w-full px-3.5 py-2.5 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">City</label>
              <input
                type="text"
                name="city"
                defaultValue="Chennai"
                className="w-full px-3.5 py-2.5 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link
              href="/dashboard/leads"
              className="px-4 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Save & Audit Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
