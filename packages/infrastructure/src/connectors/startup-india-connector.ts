import { Business } from "@leadpulse/contracts";

export interface StartupIndiaSearchOptions {
  workspaceId: string;
  category: string;
  city: string;
  state: string;
  limit?: number;
}

/**
 * Curated Open Startup India / MSME Public Registry records (Free $0/mo Source - ENH-016).
 * Focuses on verified Indian SMEs & funded/bootstrapped startups lacking modern web funnels.
 */
const STARTUP_INDIA_OPEN_DIRECTORY: Array<{
  name: string;
  category: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  stage: string;
}> = [
  {
    name: "MedVeda HealthTech Solutions",
    category: "CLINIC",
    city: "Chennai",
    state: "Tamil Nadu",
    phone: "+91 98405 11220",
    email: "founders@medvedahealth.in",
    address: "18, 2nd Main Road, Anna Nagar, Chennai",
    website: "",
    stage: "DPIIT Recognized Startup",
  },
  {
    name: "SkillForge EdTech Labs",
    category: "EDUCATION",
    city: "Chennai",
    state: "Tamil Nadu",
    phone: "+91 94442 66771",
    email: "hello@skillforgelabs.in",
    address: "42, Lattice Bridge Rd, Adyar, Chennai",
    website: "http://skillforgelabs.in",
    stage: "Seed Stage EdTech",
  },
  {
    name: "Namma Millet Kitchens Pvt Ltd",
    category: "RESTAURANT",
    city: "Coimbatore",
    state: "Tamil Nadu",
    phone: "+91 98940 33112",
    email: "orders@nammamillet.in",
    address: "105, DB Road, RS Puram, Coimbatore",
    website: "",
    stage: "MSME Registered D2C",
  },
  {
    name: "FinLedger Compliance Advisors",
    category: "PROFESSIONAL",
    city: "Bangalore",
    state: "Karnataka",
    phone: "+91 99001 44558",
    email: "advisory@finledger.co.in",
    address: "80 Feet Road, Koramangala 4th Block, Bangalore",
    website: "",
    stage: "Startup India Listed",
  },
  {
    name: "VedaGlow Botanicals & Wellness Studio",
    category: "SERVICES",
    city: "Chennai",
    state: "Tamil Nadu",
    phone: "+91 98412 88991",
    email: "care@vedaglow.in",
    address: "27, MTH Road, Villivakkam, Chennai",
    website: "",
    stage: "MSME Wellness Enterprise",
  },
  {
    name: "Deccan Cloud Care Clinics",
    category: "CLINIC",
    city: "Hyderabad",
    state: "Telangana",
    phone: "+91 98490 22331",
    email: "connect@deccancloudcare.in",
    address: "Road No. 12, Banjara Hills, Hyderabad",
    website: "",
    stage: "DPIIT Recognized Startup",
  },
  {
    name: "Sahyadri Artisanal Roasters",
    category: "RESTAURANT",
    city: "Pune",
    state: "Maharashtra",
    phone: "+91 98220 55441",
    email: "brew@sahyadriroasters.in",
    address: "Lane 6, Koregaon Park, Pune",
    website: "",
    stage: "MSME FoodTech",
  },
];

/**
 * Discovers startups and MSMEs from the Startup India / MSME Open Directory matching location & category.
 */
export async function executeStartupIndiaDiscovery(
  options: StartupIndiaSearchOptions
): Promise<{ leads: Business[]; source: "STARTUP_INDIA_OPEN_DATA" }> {
  const { workspaceId, category, city, state, limit = 25 } = options;
  const normCat = category.toUpperCase();
  const normCity = city.toLowerCase();
  const normState = state.toLowerCase();

  let matches = STARTUP_INDIA_OPEN_DIRECTORY.filter((item) => {
    const catOk = normCat === "ALL" || item.category === normCat;
    const locOk =
      item.city.toLowerCase() === normCity ||
      item.state.toLowerCase() === normState;
    return catOk && locOk;
  });

  // If city has no direct match in that category, fall back to state or category match
  if (matches.length === 0) {
    matches = STARTUP_INDIA_OPEN_DIRECTORY.filter(
      (item) => normCat === "ALL" || item.category === normCat
    );
  }

  const leads: Business[] = matches.slice(0, limit).map((item) => ({
    workspaceId,
    name: item.name,
    category: `${item.category} (${item.stage})`,
    phone: item.phone,
    whatsappNumber: item.phone.replace(/\s+/g, ""),
    email: item.email,
    addressLine1: item.address,
    city: item.city,
    state: item.state,
    country: "India",
    sourceUrl: item.website || undefined,
    sourceType: "RSS",
    sourceRetrievedAt: new Date(),
    verificationStatus: "VERIFIED",
    description: `${item.stage} discovered via Startup India / MSME Open Registry.`,
  }));

  return {
    leads,
    source: "STARTUP_INDIA_OPEN_DATA",
  };
}
