import { CsvLeadRow, CsvLeadRowSchema, CsvImportResult } from "@leadpulse/contracts";

/**
 * Sanitizes any cell value against CSV / Spreadsheet Formula Injection (CWE-1236).
 * If a cell begins with '=', '+', '-', '@', '\t', '\r', it could trigger macro or command execution
 * when exported or viewed in Excel/LibreOffice. We prepend a single quote (') to neutralize it.
 */
export function sanitizeCellValue(val: string): string {
  if (!val || typeof val !== "string") return "";
  const trimmed = val.trim();
  const dangerousPrefixes = ["=", "+", "-", "@", "\t", "\r"];
  if (dangerousPrefixes.some((p) => trimmed.startsWith(p))) {
    // If it's a legitimate phone number like +91 9876543210, keep it intact
    if (trimmed.startsWith("+") && /^\+[0-9\s-]+$/.test(trimmed)) {
      return trimmed;
    }
    // If it's a legitimate negative number like -12.50, keep it intact
    if (trimmed.startsWith("-") && /^-[0-9.]+$/.test(trimmed)) {
      return trimmed;
    }
    return `'${trimmed}`;
  }
  return trimmed;
}

export function normalizeDomain(urlStr?: string): string {
  if (!urlStr) return "";
  try {
    let raw = urlStr.trim().toLowerCase();
    if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
      raw = `https://${raw}`;
    }
    const parsed = new URL(raw);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return urlStr.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim();
  }
}

/**
 * Normalizes phone numbers for matching. For numbers with country codes (e.g. +91) or leading zeros,
 * extracts the canonical 10-digit national number.
 */
export function normalizePhone(phoneStr?: string): string {
  if (!phoneStr) return "";
  const digits = phoneStr.replace(/[^0-9]/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

/**
 * Custom robust CSV parser that correctly handles quoted strings with internal commas and newlines.
 */
export function parseRawCsv(csvContent: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  const content = csvContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote ("")
          currentCell += '"';
          i++;
        } else {
          // Closing quote
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if (char === "\n") {
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Parses CSV text, maps header columns flexibly, sanitizes formula triggers,
 * and validates each row with Zod schema.
 */
export function parseAndValidateLeadCsv(csvText: string): {
  validRows: CsvLeadRow[];
  errors: { rowNumber: number; reason: string }[];
  totalRows: number;
} {
  const rows = parseRawCsv(csvText);
  if (rows.length === 0) {
    return { validRows: [], errors: [{ rowNumber: 0, reason: "CSV file is empty" }], totalRows: 0 };
  }

  const headerRow = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  
  // Dynamic column index discovery
  const nameIdx = headerRow.findIndex((h) => h.includes("name") || h.includes("business") || h.includes("company"));
  const catIdx = headerRow.findIndex((h) => h.includes("category") || h.includes("industry") || h.includes("type") || h.includes("niche"));
  const phoneIdx = headerRow.findIndex((h) => h.includes("phone") || h.includes("mobile") || h.includes("contact") || h.includes("tel"));
  const emailIdx = headerRow.findIndex((h) => h.includes("email") || h.includes("mail"));
  const webIdx = headerRow.findIndex((h) => h.includes("website") || h.includes("web") || h.includes("url") || h.includes("site") || h.includes("domain"));
  const addrIdx = headerRow.findIndex((h) => h.includes("address") || h.includes("street") || h.includes("location"));
  const cityIdx = headerRow.findIndex((h) => h.includes("city") || h.includes("town") || h.includes("area") || h.includes("locality"));
  const waIdx = headerRow.findIndex((h) => h.includes("whatsapp") || h.includes("wa"));
  const notesIdx = headerRow.findIndex((h) => h.includes("notes") || h.includes("desc") || h.includes("comment"));

  const validRows: CsvLeadRow[] = [];
  const errors: { rowNumber: number; reason: string }[] = [];

  for (let i = 1; i < rows.length; i++) {
    const rawCols = rows[i];
    if (rawCols.every((c) => c === "")) continue;

    const rawName = nameIdx !== -1 ? rawCols[nameIdx] : rawCols[0];
    if (!rawName || rawName.trim().length === 0) {
      errors.push({ rowNumber: i + 1, reason: "Missing required business name" });
      continue;
    }

    const leadCandidate = {
      name: sanitizeCellValue(rawName),
      category: sanitizeCellValue(catIdx !== -1 ? rawCols[catIdx] : "Local Business") || "Local Business",
      phone: sanitizeCellValue(phoneIdx !== -1 ? rawCols[phoneIdx] : ""),
      email: sanitizeCellValue(emailIdx !== -1 ? rawCols[emailIdx] : ""),
      website: sanitizeCellValue(webIdx !== -1 ? rawCols[webIdx] : ""),
      address: sanitizeCellValue(addrIdx !== -1 ? rawCols[addrIdx] : ""),
      city: sanitizeCellValue(cityIdx !== -1 ? rawCols[cityIdx] : "Chennai") || "Chennai",
      whatsappNumber: sanitizeCellValue(waIdx !== -1 ? rawCols[waIdx] : (phoneIdx !== -1 ? rawCols[phoneIdx] : "")),
      notes: sanitizeCellValue(notesIdx !== -1 ? rawCols[notesIdx] : ""),
    };

    const parsed = CsvLeadRowSchema.safeParse(leadCandidate);
    if (parsed.success) {
      validRows.push(parsed.data);
    } else {
      errors.push({
        rowNumber: i + 1,
        reason: parsed.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`).join(", "),
      });
    }
  }

  return { validRows, errors, totalRows: rows.length - 1 };
}

export interface ExistingLeadIdentity {
  name: string;
  phone?: string | null;
  website?: string | null;
  city?: string | null;
}

/**
 * Deduplicates newly parsed rows against existing database records.
 * Identifies duplicates by:
 * 1. Normalized 10-digit national phone match
 * 2. Normalized non-empty website domain match
 * 3. Exact normalized business name match in the same city
 */
export function deduplicateLeads(
  newRows: CsvLeadRow[],
  existingLeads: ExistingLeadIdentity[]
): {
  uniqueRows: CsvLeadRow[];
  duplicatesCount: number;
} {
  const existingPhones = new Set<string>();
  const existingDomains = new Set<string>();
  const existingNameInCity = new Set<string>();

  for (const ex of existingLeads) {
    if (ex.phone) {
      const p = normalizePhone(ex.phone);
      if (p.length >= 7) existingPhones.add(p);
    }
    if (ex.website) {
      const d = normalizeDomain(ex.website);
      if (d.length > 3) existingDomains.add(d);
    }
    if (ex.name) {
      const key = `${ex.name.trim().toLowerCase()}_${(ex.city || "chennai").trim().toLowerCase()}`;
      existingNameInCity.add(key);
    }
  }

  const uniqueRows: CsvLeadRow[] = [];
  let duplicatesCount = 0;

  for (const row of newRows) {
    const rowPhone = normalizePhone(row.phone || row.whatsappNumber);
    const rowDomain = normalizeDomain(row.website);
    const rowNameCityKey = `${row.name.trim().toLowerCase()}_${row.city.trim().toLowerCase()}`;

    const isDuplicatePhone = rowPhone.length >= 7 && existingPhones.has(rowPhone);
    const isDuplicateDomain = rowDomain.length > 3 && existingDomains.has(rowDomain);
    const isDuplicateName = existingNameInCity.has(rowNameCityKey);

    if (isDuplicatePhone || isDuplicateDomain || isDuplicateName) {
      duplicatesCount++;
    } else {
      uniqueRows.push(row);
      // Register in local sets so subsequent duplicate rows in the same CSV are also caught
      if (rowPhone.length >= 7) existingPhones.add(rowPhone);
      if (rowDomain.length > 3) existingDomains.add(rowDomain);
      existingNameInCity.add(rowNameCityKey);
    }
  }

  return { uniqueRows, duplicatesCount };
}
