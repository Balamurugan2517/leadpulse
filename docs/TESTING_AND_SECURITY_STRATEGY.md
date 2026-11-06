# LeadPulse AI - Complete Testing & Security Assurance Strategy

**Status:** Binding Architecture Specification  
**Coverage Standard:** Unit, Integration, Security Penetration, and End-to-End (E2E) Functional Verification  

---

## 1. Testing Pyramid & Automation Framework

Every phase of development must satisfy automated test gates before being considered complete:

```text
               / \
              /   \
             / E2E \       <-- Playwright UI flows (Lead discovery -> Outreach -> Won)
            /-------\
           / Security\     <-- SSRF defense, DNS rebinding, IDOR, CSV injection
          /-----------\
         / Integration \   <-- Drizzle ORM, Postgres job queue SKIP LOCKED, CSV parser
        /---------------\
       /   Unit Tests    \ <-- Scoring math, keyword taxonomy, URL validators (Vitest)
      /-------------------\
```

### Tooling Selection (100% Free & Open Source):
* **Unit & Integration Test Runner:** **Vitest** (Fast, native ESM & TypeScript support).
* **Browser & E2E Test Automation:** **Playwright** (Automates real browser user journeys).
* **Mocking & Fixtures:** Native TypeScript test factories with synthetic lead generators.

---

## 2. End-to-End (E2E) Functional Test Scenarios

The automated E2E test suite (`tests/e2e/`) validates the complete user journey:

### Test Suite E2E-01: Public Website & Ingestion
1. Visitor navigates to `/` and browses `/services`.
2. Visitor enters a URL in `/free-website-review` (Lead Magnet).
3. System validates the URL, enqueues a background audit job, and displays a friendly confirmation.
4. Database records the lead in `businesses` with status `UNVERIFIED`.

### Test Suite E2E-02: Discovery & Bulk Ingestion
1. Founder logs into Dashboard.
2. Ingests a CSV file with 50 businesses (containing missing sites, expired SSL, and valid sites).
3. Verifies deduplication: re-uploading the same file skips duplicates based on domain and phone number.
4. All businesses appear in the **Lead Explorer** table with paginated sorting.

### Test Suite E2E-03: Background Worker Execution & Audit Lab
1. Background worker process starts.
2. Worker claims pending audit jobs using `SELECT ... FOR UPDATE SKIP LOCKED`.
3. Worker runs HTTP/TLS inspection and Lighthouse lab analysis.
4. Telemetry is saved in `website_audits`.
5. Audit Lab UI displays Core Web Vitals gauges, SSL status, and mobile friendliness flags.

### Test Suite E2E-04: Demand Categorization
1. System evaluates audit findings and keyword signals.
2. Verifies that:
   - A business requesting a developer is tagged **`ACTIVELY_LOOKING`**.
   - A business with no website or expired SSL is tagged **`HIGH_DEMAND`**.
   - A business with a slow mobile load (>5s) is tagged **`MEDIUM_DEMAND`**.
   - A modern, functional site is tagged **`LOW_DEMAND`**.

### Test Suite E2E-05: Outreach Desk & 1-Click WhatsApp Flow
1. Founder opens **Outreach Desk**.
2. Verifies pre-filled message contains the exact technical defect observed.
3. Founder edits message text.
4. Clicks **[Send via WhatsApp]**: system verifies the generated URL format `https://wa.me/91XXXXXXXXXX?text=...`.
5. Clicks **[Mark as Contacted]**: system updates `leads_pipeline.stage` to `CONTACTED` and creates an audit entry in `communication_logs`.

### Test Suite E2E-06: Pipeline, Proposal & Deal Close
1. Founder moves lead to `IN_DISCUSSION` and logs meeting notes.
2. Generates proposal with deliverables, timeline, and pricing.
3. Marks deal as `DEAL_WON` $\rightarrow$ verifies revenue KPI increments.
4. Marks an alternative deal as `DEAL_LOST` and clicks `[Suppress]` $\rightarrow$ verifies lead is excluded from future search queries.

---

## 3. Comprehensive Security Hardening & Penetration Testing

The security test suite (`tests/security/`) executes automated penetration tests against the OWASP Top 10:

### 1. SSRF (Server-Side Request Forgery) & DNS Rebinding Defenses
* **Target:** Website Audit engine (`apps/worker`).
* **Automated Test Cases:**
  * Submitting `http://127.0.0.1` or `http://localhost:3000` $\rightarrow$ **Blocked (Loopback)**.
  * Submitting `http://169.254.169.254/latest/meta-data/` $\rightarrow$ **Blocked (Cloud Metadata)**.
  * Submitting private IPs (`10.0.0.1`, `192.168.1.1`, `172.16.0.1`) $\rightarrow$ **Blocked (RFC 1918)**.
  * Submitting IPv6 loopback (`http://[::1]`) $\rightarrow$ **Blocked (IPv6 Loopback)**.
  * Submitting non-HTTP schemes (`file:///etc/passwd`, `gopher://`, `ftp://`) $\rightarrow$ **Blocked (Invalid Scheme)**.
  * Submitting non-standard ports (`http://example.com:22`, `http://example.com:3306`) $\rightarrow$ **Blocked (Disallowed Port)**.
  * **DNS Rebinding Simulation:** A hostname that resolves to a public IP on DNS check 1, but resolves to `127.0.0.1` during request connection $\rightarrow$ **Blocked at CDP/socket interception level**.

### 2. Multi-Tenant Workspace Isolation & IDOR Protection
* **Target:** Every Server Action and API endpoint.
* **Automated Test Cases:**
  * User A from Workspace 1 attempts to query or mutate a lead ID belonging to Workspace 2 $\rightarrow$ **Returned `403 Forbidden` or `404 Not Found`**.
  * Every database query must have an explicit `where(eq(table.workspaceId, currentWorkspaceId))` clause enforced by middleware.

### 3. CSV Formula Injection Defense
* **Target:** CSV Import engine.
* **Automated Test Cases:**
  * Uploading a CSV where cells begin with formula triggers (`=`, `+`, `-`, `@`, `|`) $\rightarrow$ **Sanitized / Escaped with leading apostrophe** to prevent remote code execution in spreadsheet software.

### 4. SQL Injection & XSS Protection
* **Target:** Lead search filters and notes editors.
* **Automated Test Cases:**
  * Submitting `' OR 1=1 --` in lead search $\rightarrow$ Handled safely by Drizzle ORM parameterized queries.
  * Submitting `<script>alert('xss')</script>` in business descriptions $\rightarrow$ Sanitized before rendering in UI.

### 5. Strict Credential Audit
* Automated test verifies that no environment secret (`BETTER_AUTH_SECRET`, `DATABASE_URL`, API keys) is ever prefixed with `NEXT_PUBLIC_` or bundled into client-side JavaScript.
