# ADR-005: SSRF Defense and Browser Isolation for Website Auditing

- **Status:** Approved (Phase 0)
- **Date:** 2026-11-07
- **Deciders:** Lead Architecture Review Board

## Context
LeadPulse accepts arbitrary user-supplied and prospect-discovered website URLs to perform technical health checks, TLS certificate verification, and Lighthouse performance profiling. Initiating outbound network requests to untrusted third-party URLs exposes the internal infrastructure to **Server-Side Request Forgery (SSRF)**, local file disclosure, cloud metadata theft (`http://169.254.169.254`), and DNS rebinding attacks.

## Decision
Implement a multi-layered security perimeter for all audit tasks:
1. **Protocol & Syntax Strictness:** Allow only `http:` and `https:`. Reject IP literal addresses, custom ports (allow only 80 and 443), and non-standard URL schemes (`file:`, `gopher:`, `ftp:`).
2. **Pre-flight DNS Check:** Perform a non-caching DNS resolution of hostnames before navigation. Verify that returned IPv4/IPv6 addresses do not intersect with:
   - Loopback (`127.0.0.0/8`, `::1`)
   - Private RFC 1918 networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
   - Cloud instance metadata addresses (`169.254.169.254`, `fe80::/10`)
   - Local multicast and broadcast ranges.
3. **CDP-Level Request Interception (Anti-DNS Rebinding):**
   Attach to Chromium using Playwright / Chrome DevTools Protocol (`route` / `Fetch.enable`) to intercept *every* redirect and subresource socket connection. Re-resolve and re-verify destination IPs in flight before allowing bytes to be transmitted.
4. **Execution Sandbox:** Run Chromium with `--disable-gpu`, `--no-sandbox` (in isolated containers), `--disable-dev-shm-usage`, and restrict process capabilities. Set hard 15s page timeouts and 10MB response limits.

## Consequences
- Complete mitigation against SSRF, internal network scanning, and cloud metadata exploitation.
- Guaranteed protection against rapid DNS rebinding exploits.
