/**
 * Comprehensive PAN-India Geographic Hierarchy and Bounding Boxes
 * for LeadPulse AI Discovery Studio (ENH-006)
 */

export interface LocalityItem {
  name: string;
  code: string;
  bbox: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
}

export interface CityItem {
  name: string;
  code: string;
  bbox: [number, number, number, number];
  localities: LocalityItem[];
}

export interface StateItem {
  name: string;
  code: string;
  cities: CityItem[];
}

export const PAN_INDIA_LOCATIONS: StateItem[] = [
  {
    name: "Tamil Nadu",
    code: "TN",
    cities: [
      {
        name: "Chennai",
        code: "CHENNAI",
        bbox: [12.90, 80.12, 13.20, 80.32],
        localities: [
          { name: "All Chennai (Metropolitan)", code: "ALL_CHENNAI", bbox: [12.90, 80.12, 13.20, 80.32] },
          { name: "Anna Nagar & Kilpauk", code: "ANNA_NAGAR", bbox: [13.07, 80.20, 13.10, 80.23] },
          { name: "Adyar & Besant Nagar", code: "ADYAR", bbox: [12.99, 80.24, 13.02, 80.27] },
          { name: "T. Nagar & West Mambalam", code: "T_NAGAR", bbox: [13.03, 80.22, 13.05, 80.25] },
          { name: "Velachery & OMR Corridor", code: "VELACHERY", bbox: [12.96, 80.20, 12.99, 80.23] },
          { name: "Mylapore & Alwarpet", code: "MYLAPORE", bbox: [13.02, 80.25, 13.05, 80.28] },
          { name: "Tambaram & Chromepet", code: "TAMBARAM", bbox: [12.91, 80.10, 12.94, 80.13] },
          { name: "Porur & Ramapuram", code: "PORUR", bbox: [13.02, 80.14, 13.05, 80.18] },
          { name: "Nungambakkam & Kodambakkam", code: "NUNGAMBAKKAM", bbox: [13.05, 80.23, 13.07, 80.25] },
          { name: "Villivakkam & Kolathur", code: "VILLIVAKKAM", bbox: [13.10, 80.19, 13.13, 80.22] },
          { name: "Guindy & Saidapet", code: "GUINDY", bbox: [13.00, 80.20, 13.02, 80.23] },
          { name: "Vadapalani & Ashok Nagar", code: "VADAPALANI", bbox: [13.04, 80.20, 13.06, 80.22] },
        ],
      },
      {
        name: "Coimbatore",
        code: "COIMBATORE",
        bbox: [10.95, 76.90, 11.08, 77.05],
        localities: [
          { name: "All Coimbatore", code: "ALL_COIMBATORE", bbox: [10.95, 76.90, 11.08, 77.05] },
          { name: "RS Puram & DB Road", code: "RS_PURAM", bbox: [11.00, 76.93, 11.03, 76.96] },
          { name: "Gandhipuram & Cross Cut", code: "GANDHIPURAM", bbox: [11.01, 76.96, 11.03, 76.98] },
          { name: "Saibaba Colony", code: "SAIBABA_COLONY", bbox: [11.02, 76.93, 11.04, 76.96] },
          { name: "Peelamedu & Avinashi Road", code: "PEELAMEDU", bbox: [11.02, 77.00, 11.05, 77.04] },
        ],
      },
      {
        name: "Madurai",
        code: "MADURAI",
        bbox: [9.88, 78.08, 10.00, 78.18],
        localities: [
          { name: "All Madurai", code: "ALL_MADURAI", bbox: [9.88, 78.08, 10.00, 78.18] },
          { name: "KK Nagar & Mattuthavani", code: "MADURAI_KK_NAGAR", bbox: [9.92, 78.14, 9.95, 78.17] },
          { name: "Anna Nagar Madurai", code: "MADURAI_ANNA_NAGAR", bbox: [9.91, 78.14, 9.93, 78.16] },
          { name: "Simmakkal & West Masi St", code: "SIMMAKKAL", bbox: [9.92, 78.11, 9.94, 78.13] },
        ],
      },
      {
        name: "Tiruchirappalli (Trichy)",
        code: "TRICHY",
        bbox: [10.75, 78.65, 10.85, 78.75],
        localities: [
          { name: "All Trichy", code: "ALL_TRICHY", bbox: [10.75, 78.65, 10.85, 78.75] },
          { name: "Thillai Nagar", code: "THILLAI_NAGAR", bbox: [10.82, 78.67, 10.84, 78.70] },
          { name: "Cantonment & Central Bus Stand", code: "CANTONMENT", bbox: [10.79, 78.67, 10.81, 78.70] },
          { name: "Srirangam Temple Area", code: "SRIRANGAM", bbox: [10.85, 78.68, 10.87, 78.71] },
        ],
      },
      {
        name: "Salem",
        code: "SALEM",
        bbox: [11.60, 78.10, 11.70, 78.20],
        localities: [
          { name: "All Salem", code: "ALL_SALEM", bbox: [11.60, 78.10, 11.70, 78.20] },
          { name: "Fairlands & Alagapuram", code: "FAIRLANDS", bbox: [11.66, 78.13, 11.69, 78.16] },
          { name: "Suramangalam", code: "SURAMANGALAM", bbox: [11.66, 78.10, 11.69, 78.13] },
        ],
      },
    ],
  },
  {
    name: "Karnataka",
    code: "KA",
    cities: [
      {
        name: "Bangalore",
        code: "BANGALORE",
        bbox: [12.85, 77.50, 13.10, 77.75],
        localities: [
          { name: "All Bangalore", code: "ALL_BANGALORE", bbox: [12.85, 77.50, 13.10, 77.75] },
          { name: "Koramangala", code: "KORAMANGALA", bbox: [12.92, 77.61, 12.95, 77.64] },
          { name: "Indiranagar", code: "INDIRANAGAR", bbox: [12.97, 77.63, 12.99, 77.65] },
          { name: "HSR Layout", code: "HSR_LAYOUT", bbox: [12.90, 77.63, 12.93, 77.66] },
          { name: "Whitefield & ITPL", code: "WHITEFIELD", bbox: [12.96, 77.72, 13.00, 77.76] },
          { name: "Jayanagar & JP Nagar", code: "JAYANAGAR", bbox: [12.91, 77.57, 12.94, 77.60] },
        ],
      },
      {
        name: "Mysore",
        code: "MYSORE",
        bbox: [12.28, 76.60, 12.35, 76.70],
        localities: [
          { name: "All Mysore", code: "ALL_MYSORE", bbox: [12.28, 76.60, 12.35, 76.70] },
          { name: "Gokulam & Vontikoppal", code: "GOKULAM", bbox: [12.32, 76.62, 12.34, 76.65] },
          { name: "Karasaswamy Layout", code: "SARASWATHIPURAM", bbox: [12.30, 76.62, 12.32, 76.64] },
        ],
      },
    ],
  },
  {
    name: "Maharashtra",
    code: "MH",
    cities: [
      {
        name: "Mumbai",
        code: "MUMBAI",
        bbox: [18.90, 72.75, 19.30, 73.00],
        localities: [
          { name: "All Mumbai", code: "ALL_MUMBAI", bbox: [18.90, 72.75, 19.30, 73.00] },
          { name: "Bandra West & Linking Rd", code: "BANDRA", bbox: [19.04, 72.82, 19.07, 72.85] },
          { name: "Andheri West & Lokhandwala", code: "ANDHERI_WEST", bbox: [19.12, 72.81, 19.15, 72.84] },
          { name: "Juhu & Vile Parle", code: "JUHU", bbox: [19.09, 72.82, 19.12, 72.84] },
          { name: "Powai & Hiranandani", code: "POWAI", bbox: [19.11, 72.90, 19.13, 72.92] },
          { name: "Dadar & Shivaji Park", code: "DADAR", bbox: [19.01, 72.83, 19.03, 72.85] },
        ],
      },
      {
        name: "Pune",
        code: "PUNE",
        bbox: [18.45, 73.75, 18.60, 73.95],
        localities: [
          { name: "All Pune", code: "ALL_PUNE", bbox: [18.45, 73.75, 18.60, 73.95] },
          { name: "Koregaon Park & Kalyani Nagar", code: "KOREGAON_PARK", bbox: [18.53, 73.88, 18.55, 73.91] },
          { name: "Kothrud & Karve Nagar", code: "KOTHRUD", bbox: [18.49, 73.80, 18.52, 73.83] },
          { name: "Baner & Balewadi", code: "BANER", bbox: [18.55, 73.77, 18.58, 73.80] },
        ],
      },
    ],
  },
  {
    name: "Telangana",
    code: "TG",
    cities: [
      {
        name: "Hyderabad",
        code: "HYDERABAD",
        bbox: [17.30, 78.35, 17.55, 78.60],
        localities: [
          { name: "All Hyderabad", code: "ALL_HYDERABAD", bbox: [17.30, 78.35, 17.55, 78.60] },
          { name: "Banjara Hills & Jubilee Hills", code: "BANJARA_HILLS", bbox: [17.40, 78.41, 17.44, 78.45] },
          { name: "Hitec City & Madhapur", code: "HITEC_CITY", bbox: [17.44, 78.36, 17.47, 78.40] },
          { name: "Gachibowli & Financial District", code: "GACHIBOWLI", bbox: [17.42, 78.33, 17.45, 78.37] },
          { name: "Secunderabad", code: "SECUNDERABAD", bbox: [17.43, 78.48, 17.46, 78.52] },
        ],
      },
    ],
  },
  {
    name: "Delhi NCR",
    code: "DL",
    cities: [
      {
        name: "Delhi",
        code: "DELHI",
        bbox: [28.50, 77.05, 28.85, 77.35],
        localities: [
          { name: "All Delhi", code: "ALL_DELHI", bbox: [28.50, 77.05, 28.85, 77.35] },
          { name: "Connaught Place & Central", code: "CONNAUGHT_PLACE", bbox: [28.62, 77.20, 28.64, 77.23] },
          { name: "South Extension & Hauz Khas", code: "SOUTH_DELHI", bbox: [28.54, 77.19, 28.57, 77.23] },
          { name: "Dwarka Sub-City", code: "DWARKA", bbox: [28.57, 77.02, 28.61, 77.08] },
          { name: "Noida (Sector 18 & 62)", code: "NOIDA", bbox: [28.55, 77.30, 28.62, 77.38] },
          { name: "Gurgaon (Cyber City & Golf Course Rd)", code: "GURGAON", bbox: [28.45, 77.05, 28.50, 77.12] },
        ],
      },
    ],
  },
];

/**
 * Resolves bounding box and metadata for any locality code or returns nationwide default
 */
export function resolveLocationByCode(localityCode: string): {
  state: string;
  city: string;
  locality: string;
  bbox: [number, number, number, number];
} {
  const norm = localityCode.toUpperCase().trim();

  for (const s of PAN_INDIA_LOCATIONS) {
    for (const c of s.cities) {
      if (c.code === norm) {
        return { state: s.name, city: c.name, locality: `All ${c.name}`, bbox: c.bbox };
      }
      for (const l of c.localities) {
        if (l.code === norm) {
          return { state: s.name, city: c.name, locality: l.name, bbox: l.bbox };
        }
      }
    }
  }

  // Fallback to All Chennai
  return {
    state: "Tamil Nadu",
    city: "Chennai",
    locality: "All Chennai",
    bbox: [12.90, 80.12, 13.20, 80.32],
  };
}
