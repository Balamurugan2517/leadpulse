# LeadPulse AI - Lead Scoring & Demand Categorization Framework

**Purpose:** Provide the solo founder with an automated, reproducible system to categorize leads by demand tier (Actively Looking, High Demand, Medium Demand, Low Demand) to prioritize outreach time effectively.

---

## 1. Multi-Dimensional Score Breakdown

Rather than relying on a single black-box score, LeadPulse calculates five separate dimensions (0 to 100):

1. **`IntentScore` (0-100):** Measures explicit buying signals:
   - Stated request for developer / website redesign / RFP: **80 - 100**
   - New branch launch / business expansion announcement: **50 - 75**
   - Hiring marketing or web roles: **40 - 60**
   - General business listing without intent: **0 - 20**
2. **`NeedFitScore` (0-100):** Measures objective technical deficiency:
   - No website confirmed: **+35**
   - Broken website (5xx error, expired SSL, redirect loop): **+35**
   - Mobile unusable / Lighthouse performance < 40: **+20**
   - Missing contact form / booking engine: **+15**
   - Missing basic SEO metadata: **+10**
   - Low review count / negative customer response themes: **+5 to +10**
3. **`BusinessFitScore` (0-100):** Evaluates whether the business is a target profile:
   - High-value local SME (Dentist, Clinic, Coaching Institute, Restaurant, CA, Real Estate): **80 - 100**
   - Standard local service provider (Plumber, Electrician, Auto Repair): **60 - 80**
   - Enterprise or massive conglomerate (not suitable for solo founder): **20 - 40**
4. **`ReachabilityScore` (0-100):** Evaluates contact channel viability:
   - Valid WhatsApp mobile number available: **+40**
   - Direct business email found: **+30**
   - Physical address & Google Maps location verified: **+20**
   - Active social profile handle: **+10**
5. **`EvidenceConfidence` (0-100):** Measures data freshness and verification certainty:
   - Live audit verified within the last 7 days: **90 - 100**
   - Sourced from recent user manual capture: **85 - 95**
   - OpenStreetMap record verified: **70 - 80**
   - Stale data (> 60 days unverified): **< 50**

---

## 2. Priority Score Formula

$$\text{PriorityScore} = (0.30 \times \text{Intent}) + (0.25 \times \text{NeedFit}) + (0.20 \times \text{BusinessFit}) + (0.15 \times \text{Reachability}) + (0.10 \times \text{Confidence})$$

---

## 3. Demand Tier Assignment Rules

Every lead in the database is automatically tagged with one of four demand badges:

### 1. `ACTIVELY_LOOKING` (Immediate Action — 24 Hour SLA)
* **Conditions:**
  - `IntentScore` $\ge 75$ OR has an active buying keyword (`"need a website"`, `"looking for developer"`, `"redesign quotation"`, `"RFP"`).
* **Founder Action:** Send tailored WhatsApp / Email within 24 hours. Follow up in 48 hours if no reply.

### 2. `HIGH_DEMAND` (Priority Outreach — 2 to 3 Days)
* **Conditions:**
  - `NeedFitScore` $\ge 70$ (e.g. No website at all, or website completely broken with expired SSL/404s).
  - Reachable via WhatsApp or phone.
* **Founder Action:** Review drafted WhatsApp pointing out the exact issue (e.g., "Your SSL certificate is showing a security warning to visitors") and offer immediate remediation.

### 3. `MEDIUM_DEMAND` (Warm Opportunity — Weekly Batch)
* **Conditions:**
  - `NeedFitScore` between $40$ and $69$.
  - Website exists but is slow on mobile (load time > 5s), not mobile-friendly, or lacks online booking.
* **Founder Action:** Send a free 1-page website health check audit summary.

### 4. `LOW_DEMAND` (Nurture / Low Priority)
* **Conditions:**
  - `PriorityScore` $< 40$. Functional website with no major defects and no stated intent.
* **Founder Action:** Do not spend active sales time. Keep stored in database for automated re-audit in 90 days.
