import dns from "node:dns/promises";
import net from "node:net";

export interface SSRFCheckResult {
  isSafe: boolean;
  reason?: string;
  resolvedIp?: string;
  canonicalUrl?: string;
}

// Disallowed IPv4 CIDR blocks
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed IP treated as unsafe
  }

  const [p0, p1] = parts;

  // 127.0.0.0/8 (Loopback)
  if (p0 === 127) return true;

  // 10.0.0.0/8 (Private RFC 1918)
  if (p0 === 10) return true;

  // 172.16.0.0/12 (Private RFC 1918: 172.16.0.0 - 172.31.255.255)
  if (p0 === 172 && p1 >= 16 && p1 <= 31) return true;

  // 192.168.0.0/16 (Private RFC 1918)
  if (p0 === 192 && p1 === 168) return true;

  // 169.254.0.0/16 (Link-local & AWS/GCP/Azure Cloud Metadata 169.254.169.254)
  if (p0 === 169 && p1 === 254) return true;

  // 0.0.0.0/8 (Current network)
  if (p0 === 0) return true;

  return false;
}

// Disallowed IPv6 addresses
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  // Loopback ::1
  if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;

  // Unique Local Address (fc00::/7)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

  // Link-local unicast (fe80::/10)
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) {
    return true;
  }

  // IPv4-mapped IPv6 (::ffff:127.0.0.1)
  if (normalized.includes("::ffff:")) {
    const ipv4Part = normalized.split("::ffff:")[1];
    if (ipv4Part && isPrivateIPv4(ipv4Part)) return true;
  }

  return false;
}

export function isIpAddressDisallowed(ip: string): boolean {
  if (net.isIPv4(ip)) {
    return isPrivateIPv4(ip);
  }
  if (net.isIPv6(ip)) {
    return isPrivateIPv6(ip);
  }
  return true; // Unknown address format is blocked
}

/**
 * Validates a target URL before any outbound network request or browser audit.
 * Enforces:
 * 1. Only http: and https: protocols
 * 2. Only ports 80, 443 (or standard default)
 * 3. Pre-flight DNS resolution checking for private / metadata IPs
 */
export async function validateUrlForSSRF(rawUrl: string): Promise<SSRFCheckResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return { isSafe: false, reason: "Invalid URL syntax" };
  }

  // 1. Protocol check
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return {
      isSafe: false,
      reason: `Disallowed protocol "${parsedUrl.protocol}". Only http: and https: are permitted.`,
    };
  }

  // 2. Port check
  const port = parsedUrl.port ? parseInt(parsedUrl.port, 10) : parsedUrl.protocol === "https:" ? 443 : 80;
  if (port !== 80 && port !== 443) {
    return {
      isSafe: false,
      reason: `Disallowed port ${port}. Only standard ports 80 and 443 are allowed.`,
    };
  }

  const hostname = parsedUrl.hostname;

  // 3. Literal IP check
  if (net.isIP(hostname)) {
    if (isIpAddressDisallowed(hostname)) {
      return {
        isSafe: false,
        reason: `Literal IP address ${hostname} belongs to a private, loopback, or metadata network.`,
        resolvedIp: hostname,
      };
    }
    return { isSafe: true, resolvedIp: hostname, canonicalUrl: parsedUrl.toString() };
  }

  // 4. DNS resolution check
  try {
    const lookupResult = await dns.lookup(hostname, { all: true });
    for (const record of lookupResult) {
      if (isIpAddressDisallowed(record.address)) {
        return {
          isSafe: false,
          reason: `Hostname ${hostname} resolved to private/metadata IP address ${record.address}.`,
          resolvedIp: record.address,
        };
      }
    }

    return {
      isSafe: true,
      resolvedIp: lookupResult[0]?.address,
      canonicalUrl: parsedUrl.toString(),
    };
  } catch (err: any) {
    return {
      isSafe: false,
      reason: `DNS resolution failed for hostname ${hostname}: ${err.message}`,
    };
  }
}
