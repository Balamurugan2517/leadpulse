import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MicroSitePreviewPage({
  params,
  searchParams,
}: PreviewPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;

  // Extract query params or fallback to formatted slug
  const rawName = typeof sParams.name === "string" ? sParams.name : slug.replace(/-/g, " ");
  const businessName = rawName
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const category = (typeof sParams.category === "string" ? sParams.category : "Local Business").toUpperCase();
  const city = typeof sParams.city === "string" ? sParams.city : "Chennai";
  const phone = typeof sParams.phone === "string" ? sParams.phone : "+91 98765 43210";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const rating = typeof sParams.rating === "string" ? sParams.rating : "4.8";
  const reviewsCount = typeof sParams.reviews === "string" ? sParams.reviews : "42";

  const whatsappMessage = encodeURIComponent(
    `Hello ${businessName}, I would like to enquire about your services and book an appointment.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Founder Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>
              <strong>Live Website Prototype</strong> created for <strong>{businessName}</strong>
            </span>
          </div>
          <span className="hidden sm:inline-block bg-white/20 px-2.5 py-0.5 rounded text-xs font-semibold">
            Demo Preview
          </span>
        </div>
      </div>

      {/* Business Header */}
      <header className="bg-white border-b border-slate-200 sticky top-10 z-40">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              {businessName.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-slate-900">{businessName}</h1>
              <span className="text-xs text-blue-600 font-semibold tracking-wide uppercase">{category} • {city}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-slate-600" />
              {phone}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-100 border-b border-slate-200">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 mb-6">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>Rated {rating} / 5.0 from {reviewsCount}+ verified local reviews</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Premium {category} Care & Services in {city}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to {businessName}. We deliver dedicated, top-tier service tailored to our clients with flexible scheduling and instant appointments.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md hover:bg-emerald-700 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Book Appointment via WhatsApp
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm shadow-sm hover:bg-slate-50 transition-all"
            >
              <Phone className="h-4 w-4" />
              Call {phone}
            </a>
          </div>

          {/* Key Trust Signals */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {[
              { icon: ShieldCheck, title: "Verified Expertise", desc: "Top-rated professionals" },
              { icon: Clock, title: "Quick Appointments", desc: "Flexible daily slots" },
              { icon: MapPin, title: `Central ${city}`, desc: "Easy access & parking" },
              { icon: CheckCircle, title: "100% Satisfaction", desc: "Client-first approach" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                  <Icon className="h-5 w-5 text-blue-600 mb-2" />
                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Core Services</h3>
            <p className="text-sm text-slate-500 mt-2">Personalized solutions crafted for your exact requirements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Standard Consultation & Care", desc: "Comprehensive evaluation and personalized treatment or service plan." },
              { title: "Specialized Advanced Services", desc: "Modern techniques utilizing modern equipment for best outcomes." },
              { title: "Priority Maintenance & Follow-ups", desc: "Scheduled periodic support ensuring lasting, trouble-free results." },
            ].map((srv, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all shadow-sm">
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block mb-1">Service 0{idx + 1}</span>
                <h4 className="font-bold text-base text-slate-900 mb-2">{srv.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{srv.desc}</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Enquire about this <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Banner */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-md">
            <h3 className="text-2xl font-bold text-slate-900">Ready to Book with {businessName}?</h3>
            <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
              We respond promptly to all messages during business hours. Tap below to start a conversation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-md transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp Now
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white font-semibold text-sm hover:bg-slate-900 shadow-md transition-all"
              >
                <Phone className="h-4 w-4" />
                Call {phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="container mx-auto max-w-5xl px-4">
          <p>© {new Date().getFullYear()} {businessName}. All rights reserved. Located in {city}, Tamil Nadu.</p>
          <p className="mt-2 text-slate-400">
            This interactive prototype was generated by LeadPulse AI to demonstrate modern web performance.
          </p>
        </div>
      </footer>
    </div>
  );
}
