import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Utensils,
  GraduationCap,
  Briefcase,
  HeartPulse,
  Scissors,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { PreviewImage } from "./preview-image";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type LayoutVariant =
  | "EDITORIAL_LUXURY"
  | "CLINICAL_TRUST"
  | "BISTRO_MENU"
  | "ACADEMY_PORTAL"
  | "EXECUTIVE_ADVISORY"
  | "MODERN_BENTO";

interface NicheBlueprint {
  variant: LayoutVariant;
  pageBg: string;
  topBarBg: string;
  accentText: string;
  badgeClasses: string;
  ctaClasses: string;
  heroHeadline: string;
  subHeadline: string;
  heroImage: string;
  galleryImages: string[];
  icon: any;
  stats: { value: string; label: string }[];
  services: { title: string; desc: string; tag: string; price?: string }[];
}

function getNicheBlueprint(category: string, businessName: string, city: string): NicheBlueprint {
  const cat = category.toLowerCase();

  if (cat.includes("salon") || cat.includes("spa") || cat.includes("beauty") || cat.includes("hair") || cat.includes("wellness")) {
    return {
      variant: "EDITORIAL_LUXURY",
      pageBg: "bg-[#FFF8F9]",
      topBarBg: "bg-gradient-to-r from-rose-700 via-pink-600 to-fuchsia-700",
      accentText: "text-rose-600",
      badgeClasses: "bg-rose-100 text-rose-800 border-rose-200",
      ctaClasses: "bg-rose-600 hover:bg-rose-700 text-white",
      heroHeadline: `Effortless Style, Luxury Care & Signature Grooming`,
      subHeadline: `Step into ${businessName} in ${city} for bespoke hair styling, rejuvenating skin rituals, and bridal artistry.`,
      heroImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      ],
      icon: Scissors,
      stats: [
        { value: "12+", label: "Master Stylists" },
        { value: "100%", label: "Botanical Products" },
        { value: "4.9 ★", label: "Client Rating" },
      ],
      services: [
        { title: "Signature Haircut, Styling & Keratin Ritual", desc: "Precision cuts, gloss coloring, and deep nourishing therapy.", tag: "Bestseller", price: "From ₹799" },
        { title: "Hydra-Glow Facial & Aroma Spa", desc: "Organic botanical facials and stress-relief head & shoulder massage.", tag: "Wellness", price: "From ₹1,499" },
        { title: "Bridal & Festive Makeover Suite", desc: "HD makeup, saree draping, and pre-bridal skin prep packages.", tag: "Bridal", price: "Custom Quote" },
      ],
    };
  }

  if (cat.includes("dental") || cat.includes("clinic") || cat.includes("doctor") || cat.includes("health") || cat.includes("hospital")) {
    return {
      variant: "CLINICAL_TRUST",
      pageBg: "bg-[#F3FBF9]",
      topBarBg: "bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700",
      accentText: "text-teal-700",
      badgeClasses: "bg-teal-100 text-teal-900 border-teal-200",
      ctaClasses: "bg-teal-600 hover:bg-teal-700 text-white",
      heroHeadline: `Compassionate Clinical Excellence & Painless Modern Care`,
      subHeadline: `Trusted by families in ${city} for digital diagnostics, gentle procedures, and zero-wait appointments.`,
      heroImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
      ],
      icon: HeartPulse,
      stats: [
        { value: "15+ Yrs", label: "Clinical Experience" },
        { value: "100%", label: "Autoclave Sterilized" },
        { value: "<10 Min", label: "Avg. Wait Time" },
      ],
      services: [
        { title: "Single-Sitting Root Canal & Digital Implants", desc: "Microscope-assisted painless procedures with digital X-rays.", tag: "Specialist" },
        { title: "Invisible Aligners & Smile Design", desc: "3D-scanned clear aligners and enamel-safe teeth whitening.", tag: "Cosmetic" },
        { title: "Preventive Family & Pediatric Checkups", desc: "Comprehensive oral screenings, scaling, and child wellness plans.", tag: "Family Care" },
      ],
    };
  }

  if (cat.includes("restaurant") || cat.includes("cafe") || cat.includes("bakery") || cat.includes("food") || cat.includes("dining")) {
    return {
      variant: "BISTRO_MENU",
      pageBg: "bg-[#FFFBF2]",
      topBarBg: "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600",
      accentText: "text-amber-700",
      badgeClasses: "bg-amber-100 text-amber-900 border-amber-200",
      ctaClasses: "bg-amber-600 hover:bg-amber-700 text-white",
      heroHeadline: `Authentic Flavors, Wood-Fired Freshness & Warm Hospitality`,
      subHeadline: `Reserve your table or order hot, freshly prepared signature dishes straight from ${businessName} in ${city}.`,
      heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      ],
      icon: Utensils,
      stats: [
        { value: "Fresh", label: "Farm-to-Table Daily" },
        { value: "15 Min", label: "Express Takeaway" },
        { value: "FSSAI", label: "5-Star Hygiene" },
      ],
      services: [
        { title: "Chef's Signature Platter & Filter Coffee", desc: "Slow-cooked regional favorites with freshly ground spices.", tag: "Chef Special", price: "₹349" },
        { title: "Artisanal Bakery & Celebration Cakes", desc: "Custom-baked eggless & classic cakes crafted daily.", tag: "Fresh Bake", price: "From ₹599" },
        { title: "Family Table Booking & Outdoor Catering", desc: "Group reservations and live buffet counters for events.", tag: "Events", price: "Packages" },
      ],
    };
  }

  if (cat.includes("tuition") || cat.includes("coaching") || cat.includes("education") || cat.includes("academy") || cat.includes("school")) {
    return {
      variant: "ACADEMY_PORTAL",
      pageBg: "bg-[#F5F7FF]",
      topBarBg: "bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-700",
      accentText: "text-indigo-700",
      badgeClasses: "bg-indigo-100 text-indigo-900 border-indigo-200",
      ctaClasses: "bg-indigo-600 hover:bg-indigo-700 text-white",
      heroHeadline: `Build Strong Foundations, Top Scores & Exam Confidence`,
      subHeadline: `Small-batch mentorship, weekly mock tests, and personalized doubt-clearing sessions in ${city}.`,
      heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
      ],
      icon: GraduationCap,
      stats: [
        { value: "96%+", label: "Board Distinction" },
        { value: "1 : 15", label: "Mentor Ratio" },
        { value: "Weekly", label: "Parent Reports" },
      ],
      services: [
        { title: "CBSE & State Board Excellence (Classes 8–12)", desc: "Concept-first teaching with complete NCERT & past-paper drills.", tag: "Flagship" },
        { title: "NEET / JEE Foundation & Olympiad Prep", desc: "Speed-math techniques, analytical problem sets, and rank tests.", tag: "Competitive" },
        { title: "Free 3-Day Demo & Diagnostic Assessment", desc: "Experience our teaching style before enrolling in any batch.", tag: "Free Trial" },
      ],
    };
  }

  if (cat.includes("accountant") || cat.includes("ca") || cat.includes("legal") || cat.includes("consulting") || cat.includes("tax") || cat.includes("financial")) {
    return {
      variant: "EXECUTIVE_ADVISORY",
      pageBg: "bg-[#F8FAFC]",
      topBarBg: "bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900",
      accentText: "text-slate-900",
      badgeClasses: "bg-slate-200 text-slate-900 border-slate-300",
      ctaClasses: "bg-slate-900 hover:bg-slate-800 text-white",
      heroHeadline: `Precision Tax Strategy, Statutory Compliance & CFO Advisory`,
      subHeadline: `Protecting and scaling SMEs, startups, and family enterprises across ${city} with zero-penalty compliance.`,
      heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      ],
      icon: Briefcase,
      stats: [
        { value: "500+", label: "SMEs Advised" },
        { value: "100%", label: "On-Time Filings" },
        { value: "ICAI", label: "Licensed Partners" },
      ],
      services: [
        { title: "GST Returns, Income Tax & Statutory Audits", desc: "Proactive tax-saving structures and notice representation.", tag: "Compliance" },
        { title: "Startup Incorporation & DPIIT Setup", desc: "Pvt Ltd, LLP, Trademark, and MSME Udyam registration.", tag: "Startup" },
        { title: "Virtual CFO & Investor MIS Reporting", desc: "Monthly cash-flow forecasting and fundraising readiness.", tag: "Advisory" },
      ],
    };
  }

  return {
    variant: "MODERN_BENTO",
    pageBg: "bg-[#F4FAF6]",
    topBarBg: "bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-700",
    accentText: "text-emerald-700",
    badgeClasses: "bg-emerald-100 text-emerald-900 border-emerald-200",
    ctaClasses: "bg-emerald-600 hover:bg-emerald-700 text-white",
    heroHeadline: `Modern Local Service Excellence Built Around Your Schedule`,
    subHeadline: `Trusted by clients across ${city} for transparent pricing, rapid support, and dependable quality.`,
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
    ],
    icon: Sparkles,
    stats: [
      { value: "24h", label: "Quick Turnaround" },
      { value: "4.8 ★", label: "Verified Rating" },
      { value: "100%", label: "Transparent Pricing" },
    ],
    services: [
      { title: "Initial Discovery & Personalized Consultation", desc: "Clear evaluation and tailored roadmap before any commitment.", tag: "Consult" },
      { title: "End-to-End Professional Execution", desc: "Delivered on schedule using industry-best tools.", tag: "Core" },
      { title: "Priority Support & Maintenance", desc: "Dedicated WhatsApp desk for rapid follow-ups.", tag: "Support" },
    ],
  };
}

export default async function MicroSitePreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;

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
  const reviewsCount = typeof sParams.reviews === "string" ? sParams.reviews : "64";

  const bp = getNicheBlueprint(category, businessName, city);
  const IconComponent = bp.icon;

  const whatsappMessage = encodeURIComponent(
    `Hello ${businessName}, I saw your website prototype and would like to enquire about your services and book an appointment.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className={`min-h-screen ${bp.pageBg} text-slate-900 font-sans antialiased`}>
      {/* Top Prototype Banner */}
      <div className={`${bp.topBarBg} text-white px-4 py-2 text-xs font-medium sticky top-0 z-50`}>
        <div className="container mx-auto flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>
              Live Interactive Prototype for <strong>{businessName}</strong>
            </span>
          </div>
          <span className="hidden sm:inline-block bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            {bp.variant.replace("_", " ")} EDITION
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-8 z-40">
        <div className="container mx-auto max-w-6xl px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl ${bp.topBarBg} text-white font-extrabold flex items-center justify-center text-lg`}>
              {businessName.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight text-slate-900">{businessName}</h1>
              <span className={`text-[11px] font-bold tracking-wide uppercase ${bp.accentText}`}>
                {category} • {city}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${cleanPhone}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50"
            >
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${bp.ctaClasses}`}
            >
              <MessageCircle className="h-4 w-4" />
              Book Now
            </a>
          </div>
        </div>
      </header>

      {/* VARIANT-SPECIFIC HERO SECTION (ENH-014 & ENH-015) */}
      {bp.variant === "BISTRO_MENU" ? (
        /* Full-Bleed Culinary Hero */
        <section className="relative h-[440px] sm:h-[480px] flex items-center overflow-hidden">
          <PreviewImage
            src={bp.heroImage}
            alt={businessName}
            className="absolute inset-0 w-full h-full object-cover"
            fallbackGradient="from-amber-700 to-orange-900"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
          <div className="container mx-auto max-w-6xl px-4 relative z-10 text-white space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold">
              <Star className="h-3.5 w-3.5 fill-slate-950" />
              {rating} ★ ({reviewsCount}+ Diners in {city})
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold max-w-2xl leading-tight">{bp.heroHeadline}</h2>
            <p className="text-sm sm:text-base text-amber-50/90 max-w-xl">{bp.subHeadline}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Order / Reserve Table
              </a>
              <a href={`tel:${cleanPhone}`} className="px-6 py-3 rounded-xl bg-white/15 backdrop-blur border border-white/30 text-white font-bold text-sm inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> Call Kitchen
              </a>
            </div>
          </div>
        </section>
      ) : (
        /* Split Asymmetric Visual Hero with Niche Photography */
        <section className="py-12 md:py-16 border-b border-slate-200/80">
          <div className="container mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${bp.badgeClasses}`}>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{rating} ★ Rated • {reviewsCount}+ Local Reviews</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {bp.heroHeadline}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{bp.subHeadline}</p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-colors ${bp.ctaClasses}`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Book Appointment on WhatsApp
                </a>
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              </div>

              {/* 3-Column Niche Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80">
                {bp.stats.map((st, idx) => (
                  <div key={idx}>
                    <div className={`text-xl font-extrabold ${bp.accentText}`}>{st.value}</div>
                    <div className="text-[11px] font-medium text-slate-500">{st.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Photography Collage */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-3">
              <div className="col-span-8 h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <PreviewImage
                  src={bp.heroImage}
                  alt={`${businessName} Showcase`}
                  fallbackGradient="from-slate-600 to-slate-800"
                />
              </div>
              <div className="col-span-4 flex flex-col gap-3">
                <div className="h-[138px] sm:h-[154px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <PreviewImage
                    src={bp.galleryImages[0]}
                    alt={`${category} Experience`}
                    fallbackGradient="from-slate-500 to-slate-700"
                  />
                </div>
                <div className="h-[138px] sm:h-[154px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <PreviewImage
                    src={bp.galleryImages[1]}
                    alt={`${city} Studio`}
                    fallbackGradient="from-slate-600 to-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services / Menu / Programs Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest ${bp.accentText}`}>
                Tailored For {city}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {bp.variant === "BISTRO_MENU"
                  ? "Signature Menu Highlights"
                  : bp.variant === "ACADEMY_PORTAL"
                  ? "Academic Programs & Batches"
                  : "Featured Services & Packages"}
              </h3>
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Instant Confirmation via WhatsApp
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bp.services.map((srv, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${bp.badgeClasses}`}>
                      {srv.tag}
                    </span>
                    {srv.price && <span className={`text-xs font-extrabold ${bp.accentText}`}>{srv.price}</span>}
                  </div>
                  <h4 className="font-bold text-base text-slate-900">{srv.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold ${bp.accentText} hover:underline`}
                >
                  Enquire & Book <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Appointment & Location Strip */}
      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <div className={`p-8 rounded-3xl ${bp.topBarBg} text-white flex flex-col md:flex-row items-center justify-between gap-6`}>
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white/15 px-3 py-1 rounded-full">
                <IconComponent className="h-3.5 w-3.5" />
                Visit {businessName} in {city}
              </div>
              <h3 className="text-2xl font-extrabold">Ready to Book Your Visit?</h3>
              <p className="text-xs sm:text-sm text-white/85 max-w-md">
                Tap below to confirm your slot directly on WhatsApp or call our {city} desk.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                WhatsApp Chat
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black/25 border border-white/30 text-white font-bold text-sm hover:bg-black/35 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="container mx-auto max-w-5xl px-4 space-y-1.5">
          <p className="font-semibold text-slate-700">© {new Date().getFullYear()} {businessName} • {city}, India</p>
          <p className="text-[11px] text-slate-400">
            Interactive niche-tailored website concept generated by LeadPulse AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
