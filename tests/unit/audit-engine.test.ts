import { describe, it, expect } from "vitest";
import { runWebsiteDiagnostics } from "@leadpulse/infrastructure";

describe("Technical Website Diagnostics & SSRF Integration", () => {
  it("blocks SSRF attempts on loopback and private IPs immediately", async () => {
    // Attempt audit on 127.0.0.1
    await expect(runWebsiteDiagnostics("http://127.0.0.1:8080")).rejects.toThrow(/SSRF Blocked/);

    // Attempt audit on cloud metadata
    await expect(runWebsiteDiagnostics("http://169.254.169.254/latest/meta-data/")).rejects.toThrow(/SSRF Blocked/);

    // Attempt audit on private network
    await expect(runWebsiteDiagnostics("http://192.168.1.1")).rejects.toThrow(/SSRF Blocked/);
  });

  it("rejects non-standard ports to protect internal services", async () => {
    await expect(runWebsiteDiagnostics("http://example.com:22")).rejects.toThrow(/Disallowed port/);
    await expect(runWebsiteDiagnostics("http://example.com:3306")).rejects.toThrow(/Disallowed port/);
  });

  it("handles invalid URL formats gracefully", async () => {
    await expect(runWebsiteDiagnostics("not-a-valid-url")).rejects.toThrow(/Invalid URL/);
  });
});
