# LeadPulse AI - Enterprise Architecture Specification (Phase 0)

**Codename:** `leadpulse-core`  
**Version:** 3.1 (Updated with Phase 0 Gap Resolutions)  
**Architecture Style:** Domain-Driven Modular Monolith with Hexagonal Architecture  
**Target Environment:** Next.js (Web) + Node.js (Isolated Worker) + PostgreSQL on Neon  
**Primary User:** Solo Founder / Digital Agency Operator  

---

## 1. Executive Summary & Objective

LeadPulse AI solves a direct business problem for a solo founder:
1. **Discover high-potential B2B clients** (retailers, clinics, coaching institutes, hospitality, real estate, professional services, local businesses) who need digital improvements:
   - No website
   - Broken website (SSL expired, 4xx/5xx errors, broken forms)
   - Outdated website (poor mobile UX, slow loading, missing SEO)
   - Review patterns (low review count, low ratings, recent service complaints)
   - High-intent buying signals ("need a developer", "website redesign", new branch launch)
2. **Collect complete business intelligence:** Business name, owner/contact details, phone numbers, location addresses, Google Maps geo-coordinates (latitude/longitude), social handles, review sentiment summaries, and verified audit findings.
3. **Generate hyper-personalized outreach messages:** Context-aware, evidence-backed WhatsApp and Email messages for the founder to inspect, edit, and send.
4. **End-to-end Deal & Status Tracking in Neon DB:** Complete lead status tracking (`DISCOVERED` -> `CONTACTED` -> `IN_DISCUSSION` -> `DEAL_WON` / `DEAL_LOST` -> `SUPPRESSED`) ensuring past leads are never forgotten or repeatedly spammed.

---

## 2. Gap Resolution Matrix

| Gap Identified | Root Cause | Selected Phase 0 Resolution |
|---|---|---|
| **Discovery Paradox** | Major social APIs block commercial prospecting without manual review/contracts. | **Hybrid Discovery Engine:** Automated OpenStreetMap & RSS feeds + **Assisted Browser Quick-Capture tool** (allows founder to record public Google Maps, Instagram, LinkedIn profiles with 1-click while browsing) + CSV bulk import. |
| **Playwright/Lighthouse SSRF** | Chromium resolves DNS internally; application-level pre-checks can be bypassed via DNS rebinding. | **CDP-Level Network Interception:** The worker intercepts all outbound Chromium requests via Chrome DevTools Protocol (`Fetch.enable` / `Network.setRequestInterception`), resolves DNS against a hardened IP blocklist (blocking RFC 1918, RFC 4193, `127.0.0.1`, and `169.254.169.254`), and aborts disallowed socket targets before transmission. |
| **Neon Connection Modes** | Serverless Web handles bursty HTTP traffic; Worker requires persistent connection for polling. | **Dual Connection Strategy:** Web uses `@neondatabase/serverless` (HTTP/WebSocket connection pooler); Worker uses native TCP `postgres` with connection pool and `SELECT ... FOR UPDATE SKIP LOCKED`. |
| **Edge PDF Generation** | Cloudflare Workers / Vercel Edge lack native Node canvas/Chromium bindings for PDF rendering. | **Dual PDF Rendering Strategy:** Clean CSS `@media print` client-side printable proposal engine + background worker Chromium PDF generation when async file export is demanded. |
| **WhatsApp Protocol** | WhatsApp Cloud API requires Meta Business Verification and paid utility/marketing fees. | **Stage 1 Human-in-the-Loop Deep Linking:** One-click `https://wa.me/<phone>?text=<encoded_draft>` launch with an interactive confirmation drawer (*"Did you send this message?"*) to update pipeline status to `CONTACTED`. |
| **Authentication Engine** | NextAuth/Auth.js has known Edge cookie issues on Cloudflare `vinext`. | **Better Auth with Drizzle ORM:** TypeScript-first, native Drizzle integration, full session/token control, multi-tenant workspace support. |

---

## 3. High-Level System Architecture (C4 Model)

### Context Diagram (C4 Level 1)

```text
+-----------------------+              +-----------------------+
|    Public Visitor     |              |     Solo Founder      |
| (Prospective Client)  |              |  (Operator & Sales)   |
+-----------+-----------+              +-----------+-----------+
            |                                      |
            | Browses services / Requests review   | Discovers, reviews audits,
            |                                      | drafts outreach, tracks deals
            v                                      v
+--------------------------------------------------------------+
|                        LeadPulse AI                          |
|  - Public Service & Agency Marketing Website                 |
|  - Private Intelligence, CRM & Revenue Command Center        |
+---------------+------------------------------+---------------+
                |                              |
                v                              v
+-------------------------------+  +---------------------------+
|    External Data Sources      |  |     Neon PostgreSQL       |
| - OpenStreetMap / Overpass    |  | - Businesses & Contacts   |
| - RSS & Permitted Web Feeds   |  | - Website Audits & Scores |
| - Assisted Browser Capture    |  | - Outreach & Pipeline     |
| - Google Places / YouTube     |  | - Durable Job Queue       |
+-------------------------------+  +---------------------------+
```

### Container Diagram (C4 Level 2)

```text
+-------------------------------------------------------------------------+
|                              Monorepo                                   |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | apps/web (Next.js App Router)                                     |  |
|  | - Public Marketing Pages (/services, /work, /free-review)         |  |
|  | - Operator Dashboard (/command, /discovery, /leads, /pipeline)    |  |
|  | - Server Actions & REST API Route Handlers                        |  |
|  | - Better Auth Session Management                                  |  |
|  +---------------------------------+---------------------------------+  |
|                                    |                                    |
|                                    v                                    |
|  +-------------------------------------------------------------------+  |
|  | packages/domain, application, contracts, infrastructure           |  |
|  | - Bounded Contexts, Zod Validation, Drizzle Schema Definitions    |  |
|  +---------------------------------+---------------------------------+  |
|                                    ^                                    |
|                                    | (shared DB schemas & contracts)    |
|  +---------------------------------+---------------------------------+  |
|  | apps/worker (Node.js Background Process)                          |  |
|  | - Job Processor (Postgres SKIP LOCKED)                            |  |
|  | - SSRF-Hardened Playwright & Chromium Runner                      |  |
|  | - Lighthouse Audit Engine                                         |  |
|  | - Scheduled Reminders & Follow-up Alerts                          |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```

---

## 4. Bounded Contexts & Domain Model

1. **Identity & Access Context:** Users, sessions, workspaces, and workspace members.
2. **Discovery Context:** Sources, connectors, search queries, raw observations, and import batches.
3. **Business Identity Context:** Canonical businesses, locations (lat/long, city, postal code), verified contacts (phones, emails, WhatsApp), social handles, website assets.
4. **Website Intelligence Context:** Audit profiles, HTTP/TLS diagnostics, mobile/desktop Lighthouse metrics, evidence records, and technical gap findings.
5. **Opportunity Intelligence Context:** Multi-dimensional score components (NeedFit, Intent, BusinessFit, Reachability, EvidenceConfidence), service catalogue recommendations.
6. **Outreach & Communication Context:** Customizable message templates, AI/rule-based drafts, review workflow, suppression lists, and contact logs.
7. **CRM & Pipeline Context:** Lead lifecycle stages (`DISCOVERED`, `VERIFIED`, `QUALIFIED`, `CONTACTED`, `IN_DISCUSSION`, `PROPOSAL_SENT`, `DEAL_WON`, `DEAL_LOST`, `SUPPRESSED`), notes, reminders, follow-up dates.
8. **Delivery & Revenue Context:** Lightweight proposals, project milestones, deliverables, payment references, maintenance plans, MRR tracking.
9. **Platform & Operations Context:** Durable jobs queue, outbox events, usage budgets, connector health logs.

---

## 5. Normalized PostgreSQL Database Schema (Core Tables)

```sql
-- Workspaces & Identity
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Canonical Businesses
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  industry VARCHAR(100),
  description TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  whatsapp_number VARCHAR(50),
  address_line1 TEXT,
  city VARCHAR(100) NOT NULL DEFAULT 'Chennai',
  state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  postal_code VARCHAR(20),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  google_place_id VARCHAR(255),
  source_type VARCHAR(50) NOT NULL, -- 'OSM', 'MANUAL_ASSISTED', 'CSV', 'RSS', etc.
  source_url TEXT,
  source_retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status VARCHAR(50) NOT NULL DEFAULT 'UNVERIFIED', -- 'UNVERIFIED', 'VERIFIED', 'FLAGGED'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Business Digital Presence (Websites & Social)
CREATE TABLE business_digital_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  asset_type VARCHAR(50) NOT NULL, -- 'WEBSITE', 'INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'X', 'YOUTUBE'
  url TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'NOT_FOUND', 'BROKEN', 'EXPIRED'
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Website Technical Audits
CREATE TABLE website_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  final_url TEXT,
  http_status INTEGER,
  dns_resolves BOOLEAN NOT NULL DEFAULT FALSE,
  ssl_valid BOOLEAN NOT NULL DEFAULT FALSE,
  ssl_expires_at TIMESTAMPTZ,
  redirect_count INTEGER NOT NULL DEFAULT 0,
  is_mobile_responsive BOOLEAN,
  lighthouse_performance NUMERIC(4, 1),
  lighthouse_accessibility NUMERIC(4, 1),
  lighthouse_seo NUMERIC(4, 1),
  has_contact_form BOOLEAN,
  has_booking_engine BOOLEAN,
  has_whatsapp_button BOOLEAN,
  raw_findings JSONB NOT NULL DEFAULT '[]',
  audit_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lead Scoring & Classification
CREATE TABLE lead_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  need_fit_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  intent_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  business_fit_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  reachability_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  evidence_confidence NUMERIC(5, 2) NOT NULL DEFAULT 0,
  priority_score NUMERIC(5, 2) NOT NULL DEFAULT 0, -- Weighted aggregate
  priority_tier VARCHAR(20) NOT NULL DEFAULT 'LOW', -- 'HOT', 'WARM', 'NURTURE', 'LOW'
  recommended_services JSONB NOT NULL DEFAULT '[]', -- ['WEBSITE_DEVELOPMENT', 'REPAIR', 'SEO']
  score_reasons JSONB NOT NULL DEFAULT '[]',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sales Pipeline & Lead State Tracking
CREATE TABLE leads_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL DEFAULT 'DISCOVERED',
  -- Stages: 'DISCOVERED', 'VERIFIED', 'QUALIFIED', 'CONTACTED', 'IN_DISCUSSION', 'PROPOSAL_SENT', 'DEAL_WON', 'DEAL_LOST', 'SUPPRESSED'
  deal_value_estimate NUMERIC(12, 2),
  lost_reason TEXT,
  next_follow_up_date DATE,
  assigned_to UUID,
  last_contacted_at TIMESTAMPTZ,
  notes_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Outreach Drafts & Communications
CREATE TABLE outreach_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads_pipeline(id) ON DELETE CASCADE,
  channel VARCHAR(50) NOT NULL, -- 'WHATSAPP', 'EMAIL', 'PHONE'
  recipient_target VARCHAR(255) NOT NULL, -- Phone number or email
  subject VARCHAR(255),
  body_text TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'APPROVED', 'SENT', 'REJECTED'
  evidence_referenced JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Communication Logs & Activity History
CREATE TABLE communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads_pipeline(id) ON DELETE CASCADE,
  channel VARCHAR(50) NOT NULL,
  interaction_type VARCHAR(50) NOT NULL, -- 'WHATSAPP_CLICKED', 'MANUAL_CALL', 'EMAIL_SENT', 'MEETING_ONLINE', 'MEETING_IN_PERSON'
  outcome_summary TEXT,
  follow_up_scheduled_for TIMESTAMPTZ,
  recorded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Durable Background Job Queue (Postgres-Backed)
CREATE TABLE jobs_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  task_type VARCHAR(100) NOT NULL, -- 'WEBSITE_AUDIT', 'OSM_DISCOVERY', 'OUTREACH_DRAFT', etc.
  payload JSONB NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  last_error TEXT,
  locked_at TIMESTAMPTZ,
  locked_by VARCHAR(100),
  scheduled_for TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_status_scheduled ON jobs_queue (status, scheduled_for);
CREATE INDEX idx_businesses_workspace ON businesses (workspace_id);
CREATE INDEX idx_leads_pipeline_stage ON leads_pipeline (stage);
```

---

## 6. Durable Job Worker Lifecycle

```text
       +------------------+
       |   Job Enqueued   | (Status: PENDING)
       +--------+---------+
                |
                v
       +---------------------------------------------+
       | Worker Polls with SKIP LOCKED:              |
       | SELECT * FROM jobs_queue                    |
       | WHERE status = 'PENDING'                    |
       |   AND scheduled_for <= NOW()                |
       | FOR UPDATE SKIP LOCKED LIMIT 1;             |
       +--------+------------------------------------+
                |
                v (Locked: status = 'PROCESSING', locked_by = worker_id)
       +------------------+
       | Execute Handler  |
       +--------+---------+
         /               \
 (Success)               (Failure)
       v                   v
+--------------+   +------------------------------------+
| Status:      |   | Retry count < max_retries?         |
| 'COMPLETED'  |   | -> Reschedule with backoff         |
+--------------+   | -> If exceeded: status = 'FAILED'  |
                   +------------------------------------+
```

---

## 7. SSRF Security & Network Egress Control Architecture

For all automated audits:
1. **Scheme Validation:** Only `http:` and `https:` schemes allowed. IP literals (e.g. `http://127.0.0.1`, `http://169.254.169.254`) are rejected immediately.
2. **Pre-Flight DNS Resolution:** Query system DNS resolver for A and AAAA records.
3. **CIDR Blocklist Validation:** Ensure no resolved IP falls within:
   - `127.0.0.0/8` (Loopback)
   - `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (RFC 1918 Private networks)
   - `169.254.0.0/16` (Link-local & Cloud Metadata services)
   - `::1/128`, `fc00::/7`, `fe80::/10` (IPv6 loopback, ULA, link-local)
4. **In-Flight Interception:** Playwright attaches to Chromium via CDP:
   - Every network redirect and subresource request is intercepted and re-validated against the IP blocklist before socket connection is permitted.
5. **Enforced Timeouts:** Hard 15-second cap on page load; max response body size capped at 10 MB to prevent resource exhaustion.
