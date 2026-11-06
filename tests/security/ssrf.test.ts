import { describe, it, expect } from "vitest";
import { isIpAddressDisallowed, validateUrlForSSRF } from "@leadpulse/infrastructure";

describe("SSRF & Security Egress Defense Engine", () => {
  it("blocks loopback IPv4 addresses (127.0.0.1)", () => {
    expect(isIpAddressDisallowed("127.0.0.1")).toBe(true);
    expect(isIpAddressDisallowed("127.0.1.5")).toBe(true);
  });

  it("blocks private RFC 1918 networks (10.x, 172.16.x, 192.168.x)", () => {
    expect(isIpAddressDisallowed("10.0.0.1")).toBe(true);
    expect(isIpAddressDisallowed("172.16.0.1")).toBe(true);
    expect(isIpAddressDisallowed("172.31.255.255")).toBe(true);
    expect(isIpAddressDisallowed("192.168.1.1")).toBe(true);
    expect(isIpAddressDisallowed("192.168.0.254")).toBe(true);
  });

  it("blocks Cloud Metadata IP (169.254.169.254)", () => {
    expect(isIpAddressDisallowed("169.254.169.254")).toBe(true);
    expect(isIpAddressDisallowed("169.254.1.1")).toBe(true);
  });

  it("blocks IPv6 loopback and Unique Local Addresses", () => {
    expect(isIpAddressDisallowed("::1")).toBe(true);
    expect(isIpAddressDisallowed("fc00::1")).toBe(true);
    expect(isIpAddressDisallowed("fe80::1")).toBe(true);
  });

  it("permits public, non-reserved IPv4 addresses", () => {
    expect(isIpAddressDisallowed("8.8.8.8")).toBe(false);
    expect(isIpAddressDisallowed("1.1.1.1")).toBe(false);
  });

  it("rejects non-HTTP/HTTPS schemes", async () => {
    const fileResult = await validateUrlForSSRF("file:///etc/passwd");
    expect(fileResult.isSafe).toBe(false);
    expect(fileResult.reason).toContain("Disallowed protocol");

    const gopherResult = await validateUrlForSSRF("gopher://127.0.0.1:25");
    expect(gopherResult.isSafe).toBe(false);
  });

  it("rejects non-standard ports (22, 3306, 5432)", async () => {
    const sshResult = await validateUrlForSSRF("http://example.com:22");
    expect(sshResult.isSafe).toBe(false);
    expect(sshResult.reason).toContain("Disallowed port");
  });
});
