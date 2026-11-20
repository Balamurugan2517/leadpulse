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
  Utensils,
  GraduationCap,
  Briefcase,
  HeartPulse,
  Scissors,
  Award,
  Zap,
} from "lucide-react";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Category theme definitions with unique color palettes, typography styling, and industry-tailored services
interface CategoryTheme {
  primaryGradient: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentColor: string;
  buttonBg: string;
  buttonHover: string;
  heroHeadline: string;
  subHeadline: string;
  icon: any;
  trustSignals: { icon: any; title: string; desc: string }[];
  services: { title: string; desc: string; tag: string }[];
}

function getCategoryTheme(category: string, businessName: string): CategoryTheme {
  const cat = category.toLowerCase();

  // 1. Healthcare / Dental
  if (cat.includes("dental") || cat.includes("clinic") || cat.includes("doctor") || cat.includes("health") || cat.includes("hospital")) {
    return {
      primaryGradient: "from-teal-600 via-emerald-600 to-cyan-700",
      badgeBg: "bg-teal-50",
      badgeBorder: "border-teal-200",
      badgeText: "text-teal-800",
      accentColor: "text-teal-600",
      buttonBg: "bg-teal-600",
      buttonHover: "hover:bg-teal-700",
      heroHeadline: `Gentle, Advanced Healthcare & Patient-First Care in Chennai`,
      subHeadline: `Modern treatments, zero waiting delays, and comprehensive care for your family.`,
      icon: HeartPulse,
      trustSignals: [
        { icon: ShieldCheck, title: "Certified Specialists", desc: "MDS & Board Certified" },
        { icon: Clock, title: "Priority Appointments", desc: "No long waiting room delays" },
        { icon: Award, title: "100% Sterilized", desc: "Hospital-grade safety protocols" },
        { icon: MapPin, title: "Prime Location", desc: "Valet & easy ground-floor access" },
      ],
      services: [
        { title: "Root Canal & Dental Implants", desc: "Painless single-sitting procedures with precision digital imaging.", tag: "Most Popular" },
        { title: "Cosmetic Smile Makeovers & Aligners", desc: "Invisible clear aligners and teeth whitening for a confident smile.", tag: "Cosmetic" },
        { title: "Preventive Family Health Checkups", desc: "Regular oral screenings, cleanings, and child dental health programs.", tag: "Routine" },
      ],
    };
  }

  // 2. Food / Cafe / Restaurant
  if (cat.includes("restaurant") || cat.includes("cafe") || cat.includes("bakery") || cat.includes("food") || cat.includes("dining")) {
    return {
      primaryGradient: "from-amber-600 via-orange-600 to-rose-600",
      badgeBg: "bg-amber-50",
      badgeBorder: "border-amber-200",
      badgeText: "text-amber-800",
      accentColor: "text-amber-600",
      buttonBg: "bg-amber-600",
      buttonHover: "hover:bg-amber-700",
      heroHeadline: `Handcrafted Recipes, Fresh Ingredients & Unforgettable Flavors`,
      subHeadline: `Dine-in, quick takeaway, or direct WhatsApp ordering with instant kitchen confirmation.`,
      icon: Utensils,
      trustSignals: [
        { icon: Award, title: "Farm-Fresh Daily", desc: "Zero frozen preservatives" },
        { icon: Clock, title: "Freshly Made to Order", desc: "Hot meals in 15 minutes" },
        { icon: ShieldCheck, title: "FSSAI Certified Kitchen", desc: "Highest hygiene rating" },
        { icon: MapPin, title: "Cozy Ambiance", desc: "Indoor & outdoor seating" },
      ],
      services: [
        { title: "Signature Chef Specials & Tasting Menu", desc: "Authentic multi-course dishes curated by our head chefs.", tag: "Chef Choice" },
        { title: "Table Reservations & Private Dining", desc: "Reserve a table in advance for birthdays, anniversaries, and family dinners.", tag: "Booking" },
        { title: "Catering & Bulk Party Orders", desc: "Customized menus and live counters for office parties and home gatherings.", tag: "Events" },
      ],
    };
  }

  // 3. Education / Coaching / Tuition
  if (cat.includes("tuition") || cat.includes("coaching") || cat.includes("education") || cat.includes("academy") || cat.includes("school")) {
    return {
      primaryGradient: "from-indigo-600 via-blue-600 to-purple-700",
      badgeBg: "bg-indigo-50",
      badgeBorder: "border-indigo-200",
      badgeText: "text-indigo-800",
      accentColor: "text-indigo-600",
      buttonBg: "bg-indigo-600",
      buttonHover: "hover:bg-indigo-700",
      heroHeadline: `Proven Academic Results, Expert Mentorship & Small Batch Focus`,
      subHeadline: `Empowering students with concept clarity, rigorous test series, and personalized attention.`,
      icon: GraduationCap,
      trustSignals: [
        { icon: Award, title: "Top State Rankers", desc: "Consistent 95%+ results" },
        { icon: Clock, title: "Flexible Batch Timings", desc: "Morning & evening schedules" },
        { icon: ShieldCheck, title: "1-on-1 Doubt Clearing", desc: "Dedicated faculty mentoring" },
        { icon: Zap, title: "Weekly Mock Tests", desc: "Detailed performance tracking" },
      ],
      services: [
        { title: "CBSE & State Board Mastery (10th/12th)", desc: "In-depth chapter-wise syllabus completion and previous year question mastery.", tag: "Flagship" },
        { title: "NEET & JEE Foundation Program", desc: "Rigorous analytical problem solving with shortcuts and speed drills.", tag: "Competitive" },
        { title: "Weekend Crash Courses & Revisions", desc: "High-yield revision sessions with printed formula sheets and test packs.", tag: "Fast-Track" },
      ],
    };
  }

  // 4. Chartered Accountant / Legal / Financial
  if (cat.includes("accountant") || cat.includes("ca") || cat.includes("legal") || cat.includes("consulting") || cat.includes("tax")) {
    return {
      primaryGradient: "from-slate-900 via-slate-800 to-cyan-900",
      badgeBg: "bg-slate-100",
      badgeBorder: "border-slate-300",
      badgeText: "text-slate-800",
      accentColor: "text-slate-900",
      buttonBg: "bg-slate-900",
      buttonHover: "hover:bg-slate-800",
      heroHeadline: `Strategic Tax Planning, Flawless Compliance & Business Growth Advisory`,
      subHeadline: `Trusted advisory for Chennai SMEs, startups, and high-net-worth individuals.`,
      icon: Briefcase,
      trustSignals: [
        { icon: ShieldCheck, title: "ICAI Licensed Experts", desc: "15+ years experience" },
        { icon: Clock, title: "Zero Penalty Guarantee", desc: "Timely statutory filings" },
        { icon: Award, title: "Confidential & Secure", desc: "Bank-grade data protection" },
        { icon: Zap, title: "Fast-Track Approvals", desc: "Expedited GST & ROC setup" },
      ],
      services: [
        { title: "Income Tax & GST Filing Solutions", desc: "End-to-end return filings, audits, and notice resolution.", tag: "Core" },
        { title: "Company Incorporation & Startup Compliance", desc: "Pvt Ltd, LLP, MSME registrations, and trademark filings.", tag: "Startup" },
        { title: "Virtual CFO & Financial Strategy", desc: "Cash-flow planning, MIS reports, and quarterly board reviews.", tag: "Advisory" },
      ],
    };
  }

  // 5. Beauty, Salons & Wellness
  if (cat.includes("salon") || cat.includes("spa") || cat.includes("beauty") || cat.includes("hair") || cat.includes("wellness")) {
    return {
      primaryGradient: "from-rose-600 via-pink-600 to-purple-700",
      badgeBg: "bg-rose-50",
      badgeBorder: "border-rose-200",
      badgeText: "text-rose-800",
      accentColor: "text-rose-600",
      buttonBg: "bg-rose-600",
      buttonHover: "hover:bg-rose-700",
      heroHeadline: `Luxury Styling, Rejuvenating Treatments & Personalized Care`,
      subHeadline: `Indulge in premium salon and spa services designed to bring out your natural glow.`,
      icon: Scissors,
      trustSignals: [
        { icon: Award, title: "Certified Stylists", desc: "Trained in latest trends" },
        { icon: ShieldCheck, title: "100% Organic Products", desc: "Skin-friendly & non-toxic" },
        { icon: Clock, title: "Instant Booking", desc: "Confirm your slot via WhatsApp" },
        { icon: MapPin, title: "Private Suites", desc: "Hygienic & peaceful atmosphere" },
      ],
      services: [
        { title: "Hair Styling, Coloring & Keratin Care", desc: "Precision cuts, bespoke coloring, and deep restorative treatments.", tag: "Trending" },
        { title: "Facial Aesthetics & Skin Rejuvenation", desc: "Organic fruit facials, hydra-glow, and anti-aging therapies.", tag: "Relaxation" },
        { title: "Bridal & Celebration Makeovers", desc: "Complete packages for weddings, photoshoots, and special events.", tag: "Special" },
      ],
    };
  }

  // 6. Default Dynamic Fallback
  return {
    primaryGradient: "from-blue-600 via-indigo-600 to-purple-700",
    badgeBg: "bg-blue-50",
    badgeBorder: "border-blue-200",
    badgeText: "text-blue-800",
    accentColor: "text-blue-600",
    buttonBg: "bg-blue-600",
    buttonHover: "hover:bg-blue-700",
    heroHeadline: `Trusted ${category} Services & Reliable Client Experience in Chennai`,
    subHeadline: `Dedicated professionals providing quality solutions tailored to your schedule.`,
    icon: Sparkles,
    trustSignals: [
      { icon: ShieldCheck, title: "Verified Reputation", desc: "Trusted by local clients" },
      { icon: Clock, title: "Prompt Service", desc: "Fast turnarounds & bookings" },
      { icon: Award, title: "Quality Guarantee", desc: "High standards of work" },
      { icon: MapPin, title: "Central Chennai", desc: "Convenient local access" },
    ],
    services: [
      { title: "Consultation & Initial Assessment", desc: "Personalized evaluation with clear guidance and transparent pricing.", tag: "Consult" },
      { title: "Full Execution & Service Delivery", desc: "Comprehensive solutions carried out with modern equipment.", tag: "Core" },
      { title: "Ongoing Support & Follow-Up", desc: "Dedicated after-care ensuring lasting satisfaction.", tag: "Support" },
    ],
  };
}

export default async function MicroSitePreviewPage({
  params,
  searchParams,
}: PreviewPageProps) {
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
  const reviewsCount = typeof sParams.reviews === "string" ? sParams.reviews : "48";

  const theme = getCategoryTheme(category, businessName);
  const IconComponent = theme.icon;

  const whatsappMessage = encodeURIComponent(
    `Hello ${businessName}, I saw your website prototype and would like to enquire about your services and book an appointment.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Founder Notice Bar */}
      <div className={`bg-gradient-to-r ${theme.primaryGradient} text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between sticky top-0 z-50 shadow-md`}>
        <div className="container mx-auto flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>
              <strong>Live Website Prototype</strong> created for <strong>{businessName}</strong>
            </span>
          </div>
          <span className="hidden sm:inline-block bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm">
            ✨ Interactive Demo Concept
          </span>
        </div>
      </div>

      {/* Branded Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-10 z-40 shadow-xs">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-2xl bg-gradient-to-tr ${theme.primaryGradient} text-white font-extrabold flex items-center justify-center text-xl shadow-md`}>
              {businessName.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-slate-900">{businessName}</h1>
              <span className={`text-xs font-bold tracking-wide uppercase ${theme.accentColor}`}>
                {category} • {city}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-slate-600" />
              {phone}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl px-4 text-center relative z-10">
          <div className={`inline-flex items-center gap-1.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} px-3.5 py-1 text-xs font-bold ${theme.badgeText} mb-6 shadow-xs`}>
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>Rated {rating} ★ on Google Maps ({reviewsCount}+ verified local reviews)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-4xl mx-auto">
            {theme.heroHeadline}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {theme.subHeadline} Experience the benchmark in {category.toLowerCase()} across {city}.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              Book Appointment via WhatsApp
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
            >
              <Phone className="h-4 w-4" />
              Call {phone}
            </a>
          </div>

          {/* Key Trust Signals */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {theme.trustSignals.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-colors">
                  <div className={`h-9 w-9 rounded-xl ${theme.badgeBg} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${theme.accentColor}`} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section with Distinct Niche Offerings */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentColor} block mb-1`}>
              Tailored Solutions
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Our Signature Services
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Designed with precision for our {city} clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {theme.services.map((srv, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-slate-400 font-mono">0{idx + 1}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                      {srv.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 mb-2 leading-snug">{srv.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold ${theme.accentColor} hover:underline pt-2`}
                >
                  Book this service <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map & Direct Contact Card */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            <div className={`h-12 w-12 rounded-2xl ${theme.badgeBg} flex items-center justify-center mx-auto`}>
              <IconComponent className={`h-6 w-6 ${theme.accentColor}`} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ready to Experience {businessName}?
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                We are open and taking appointments in {city}. Tap below to start an instant WhatsApp chat or call directly.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-md transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                Start WhatsApp Chat
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-md transition-all"
              >
                <Phone className="h-4 w-4" />
                Call {phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="container mx-auto max-w-5xl px-4 space-y-2">
          <p className="font-semibold text-slate-700">© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          <p className="text-slate-400">Serving clients across {city} and surrounding localities, Tamil Nadu, India.</p>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 max-w-md mx-auto">
            This interactive prototype was generated by LeadPulse AI to demonstrate high-conversion mobile performance.
          </p>
        </div>
      </footer>
    </div>
  );
}
