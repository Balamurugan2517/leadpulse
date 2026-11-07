import { describe, it, expect } from "vitest";
import {
  parseAndValidateLeadCsv,
  sanitizeCellValue,
  normalizeDomain,
  normalizePhone,
  deduplicateLeads,
} from "@leadpulse/domain";

describe("CSV Parser & Ingestion Security Engine", () => {
  it("sanitizes CSV formula injection attempts", () => {
    // Dangerous formula prefixes: =, @, -, +, \t
    expect(sanitizeCellValue("=CMD|' /C calc'!A0")).toBe("'=CMD|' /C calc'!A0");
    expect(sanitizeCellValue("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
    expect(sanitizeCellValue("-2+3+cmd")).toBe("'-2+3+cmd");

    // Legitimate values must NOT be corrupted
    expect(sanitizeCellValue("+91 98765 43210")).toBe("+91 98765 43210");
    expect(sanitizeCellValue("Adyar Dental Studio")).toBe("Adyar Dental Studio");
    expect(sanitizeCellValue("-12.50")).toBe("-12.50");
  });

  it("normalizes domains and phone numbers correctly", () => {
    expect(normalizeDomain("http://www.clinic.com/about")).toBe("clinic.com");
    expect(normalizeDomain("https://sub.domain.com/")).toBe("sub.domain.com");
    expect(normalizeDomain("mysite.in")).toBe("mysite.in");

    expect(normalizePhone("+91 98765-43210")).toBe("9876543210");
    expect(normalizePhone("09876543210")).toBe("9876543210");
    expect(normalizePhone("9876543210")).toBe("9876543210");
    expect(normalizePhone("(044) 2441-1234")).toBe("4424411234");
  });

  it("parses valid CSV text with flexible column names and quotes", () => {
    const csvContent = `Business Name,Category,Mobile,Website URL,City
"Ramesh, Dental Clinic",Dental,+919876543210,https://rameshdental.in,Chennai
Marina Cafe,Restaurant,9840112233,,Chennai
`;

    const result = parseAndValidateLeadCsv(csvContent);

    expect(result.errors).toHaveLength(0);
    expect(result.validRows).toHaveLength(2);

    expect(result.validRows[0].name).toBe("Ramesh, Dental Clinic");
    expect(result.validRows[0].phone).toBe("+919876543210");
    expect(result.validRows[0].website).toBe("https://rameshdental.in");

    expect(result.validRows[1].name).toBe("Marina Cafe");
    expect(result.validRows[1].website).toBe("");
  });

  it("deduplicates leads against existing database records", () => {
    const existingLeads = [
      { name: "Existing Clinic", phone: "+919876543210", website: "https://existing.com", city: "Chennai" },
      { name: "Marina Bakery", phone: "9840998877", website: "", city: "Chennai" },
    ];

    const incomingRows = [
      // Duplicate by phone (national 10 digits match)
      { name: "New Name Same Phone", category: "Clinic", phone: "9876543210", email: "", website: "https://new.com", address: "", city: "Chennai", whatsappNumber: "", notes: "" },
      // Duplicate by website domain
      { name: "Different Name", category: "Health", phone: "9111222333", email: "", website: "http://www.existing.com/contact", address: "", city: "Chennai", whatsappNumber: "", notes: "" },
      // Duplicate by name in same city
      { name: "Marina Bakery", category: "Cafe", phone: "9999999999", email: "", website: "https://bakery.in", address: "", city: "Chennai", whatsappNumber: "", notes: "" },
      // Truly Unique Lead
      { name: "Velachery Motors", category: "Auto Repair", phone: "9841000111", email: "", website: "https://velacherymotors.com", address: "", city: "Chennai", whatsappNumber: "", notes: "" },
    ];

    const { uniqueRows, duplicatesCount } = deduplicateLeads(incomingRows, existingLeads);

    expect(duplicatesCount).toBe(3);
    expect(uniqueRows).toHaveLength(1);
    expect(uniqueRows[0].name).toBe("Velachery Motors");
  });
});
