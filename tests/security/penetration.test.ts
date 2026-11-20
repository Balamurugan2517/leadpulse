import { describe, it, expect } from "vitest";
import { isIpAddressDisallowed, validateUrlForSSRF } from "@leadpulse/infrastructure";
import { sanitizeCellValue } from "@leadpulse/domain";

describe("Phase 9 Hardening: Security Penetration Test Suite", () => {
  describe("SSRF & Network Boundary Protections", () => {
    it("strictly blocks IPv4 loopback variations", () => {
      const loopbacks = [
        "127.0.0.1",
        "127.0.0.2",
        "127.1.1.1",
      ];

      for (const ip of loopbacks) {
        expect(isIpAddressDisallowed(ip)).toBe(true);
      }
    });

    it("blocks private RFC 1918 addresses", () => {
      const privates = [
        "10.0.0.1",
        "10.255.255.254",
        "172.16.0.1",
        "172.31.255.255",
        "192.168.1.1",
        "192.168.0.254",
      ];

      for (const ip of privates) {
        expect(isIpAddressDisallowed(ip)).toBe(true);
      }
    });

    it("blocks cloud instance metadata endpoints (169.254.169.254)", () => {
      expect(isIpAddressDisallowed("169.254.169.254")).toBe(true);
      expect(isIpAddressDisallowed("169.254.1.1")).toBe(true);
    });

    it("blocks non-HTTP protocols to prevent file access or gopher attacks", async () => {
      const fileResult = await validateUrlForSSRF("file:///etc/passwd");
      expect(fileResult.isSafe).toBe(false);
      expect(fileResult.reason).toContain("Disallowed protocol");

      const gopherResult = await validateUrlForSSRF("gopher://127.0.0.1:25");
      expect(gopherResult.isSafe).toBe(false);
    });
  });

  describe("CSV Formula Injection Hardening", () => {
    it("neutralizes formula execution prefixes (=, +, -, @)", () => {
      expect(sanitizeCellValue("=cmd|' /C calc'!A0")).toBe("'=cmd|' /C calc'!A0");
      expect(sanitizeCellValue("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
      expect(sanitizeCellValue("-2+3+cmd")).toBe("'-2+3+cmd");
    });

    it("preserves legitimate business names and phone numbers without corruption", () => {
      expect(sanitizeCellValue("Dr. Arvind Dental Care")).toBe("Dr. Arvind Dental Care");
      expect(sanitizeCellValue("+91 98765 43210")).toBe("+91 98765 43210");
      expect(sanitizeCellValue("Velachery Diagnostic Lab")).toBe("Velachery Diagnostic Lab");
    });
  });
});
