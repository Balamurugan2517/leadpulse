# LeadPulse AI - Solo Founder Outreach & Pipeline Lifecycle

**Purpose:** Guide the solo founder from initial lead discovery to client outreach, deal negotiation, and status tracking in Neon PostgreSQL.

---

## 1. Complete Lead Lifecycle State Machine

```text
       [DISCOVERED]
             |
             v
       [VERIFIED] ---- (Not a fit) ----> [SUPPRESSED] (Skip in future)
             |
             v
       [QUALIFIED]
             |
             | (Founder approves custom WhatsApp/Email draft)
             v
       [CONTACTED] (WhatsApp sent / Phone call made / Email sent)
             |
             +-----------------------+
             |                       |
             v (Positive response)   v (No response / Rejection)
      [IN_DISCUSSION]          [LOST / NURTURE]
   (Online / In-Person Meet)         |
             |                       v
             v                [SUPPRESSED] (Skip in future)
      [PROPOSAL_SENT]
             |
     +-------+-------+
     |               |
     v (Accepted)    v (Declined)
 [DEAL_WON]      [DEAL_LOST]
     |               |
     v               v
(Client Delivery) [SUPPRESSED]
```

### Stage Definitions & Behavior:
1. **`DISCOVERED`:** Ingested via OpenStreetMap, CSV import, RSS feed, or manual capture. Pending technical audit.
2. **`VERIFIED`:** Website audit and contact details confirmed by the automated engine or founder.
3. **`QUALIFIED`:** Need identified (e.g., No website, broken SSL, poor mobile score < 40, zero online booking) with positive priority score.
4. **`CONTACTED`:** The founder clicked the WhatsApp or Email action, reviewed the drafted message, and sent it.
5. **`IN_DISCUSSION`:** The prospect replied! An online meeting (Google Meet/Zoom) or in-person discussion is scheduled or in progress.
6. **`PROPOSAL_SENT`:** Proposal with scope, pricing, and timeline delivered.
7. **`DEAL_WON`:** Client agreed and approved the project (moves to Client Delivery context).
8. **`DEAL_LOST`:** Client declined, budget mismatch, or project cancelled. Logged with a specific reason.
9. **`SUPPRESSED`:** Permanent exclusion flag. Businesses marked suppressed are automatically filtered out from future discovery imports so you never waste time or contact them again.

---

## 2. Personalized Message Drafting Engine

### Principles:
* **Evidence-Backed:** Never send generic marketing spam. Every message references a specific, verifiable technical fact.
* **Respectful & Concise:** Maximum 3 to 4 sentences. Explain what was observed, why it impacts their customers, and offer an easy, no-obligation conversation.
* **Human-in-the-Loop:** AI or rule-based templates generate the draft, but the **founder reviews and clicks send**.

---

### Message Templates by Trigger Category

#### Scenario A: Business Has No Website (Only Social / Google Maps)
* **WhatsApp Draft:**
  > "Hi [Business Name] team, I noticed your profile on [Google Maps / Instagram] while looking for top [Category, e.g. clinics/restaurants] in [Locality, e.g. Anna Nagar]. You have great feedback, but I couldn't find an official website to view your services or book directly. I help local businesses in Chennai set up fast, mobile-friendly websites that convert visitors into direct clients. Would you be open to a quick 5-minute chat this week?"
* **Email Subject:** Quick question regarding [Business Name]'s online presence in [City]

---

#### Scenario B: Broken Website / Security Warning (Expired SSL or 404s)
* **WhatsApp Draft:**
  > "Hello [Business Name] team, I was trying to visit your website ([Domain Name]) today and noticed your security certificate (SSL) has expired, which shows visitors a 'Site Not Secure' warning. This often prevents customers from reaching your contact page. I can help you fix this quickly today so you don't lose potential enquiries. Let me know if you'd like me to take a look!"
* **Email Subject:** Alert: Security / access issue detected on [Domain Name]

---

#### Scenario C: Outdated / Slow Mobile Experience (Lighthouse Score < 45)
* **WhatsApp Draft:**
  > "Hi [Business Name] team, I tested your website on mobile today and noticed it takes over 6 seconds to load, making it hard for phone users to tap your call button or view your offerings. Over 75% of local searches in Chennai happen on phones. We recently optimized [Similar Industry] websites to load under 1.5 seconds, significantly boosting incoming calls. Would you like a free 1-page summary of what to fix?"
* **Email Subject:** Mobile performance report for [Business Name]

---

#### Scenario D: High-Intent Request ("Looking for a Web Developer")
* **WhatsApp / Email Draft:**
  > "Hi [Contact Name], I saw your public post regarding needing a website / dashboard developer for [Business Name]. I specialize in modern, high-performance web applications and booking dashboards for businesses here in Chennai. Here is our portfolio of recent work: [Portfolio Link]. Let's connect for 10 minutes to discuss your timeline and scope!"

---

## 3. The 1-Click Outreach Desk Workflow

1. **Review Card:**
   The founder opens `/dashboard/outreach`. The card displays:
   - Business Name, Location, Phone, Email
   - Observed Defect (e.g., "SSL Expired 3 days ago")
   - Generated WhatsApp & Email Drafts (with inline editable textareas)
2. **Launch Action:**
   - **Click "Send via WhatsApp":**
     Opens `https://wa.me/91XXXXXXXXXX?text=<url_encoded_message>` in a new tab (desktop or mobile WhatsApp).
   - **Click "Send via Email":**
     Opens `mailto:contact@business.com?subject=...&body=...` or copies formatted text to clipboard.
3. **Acknowledgment Drawer:**
   The dashboard displays:
   - *"Did you reach out to [Business Name]?"*
   - Buttons: **[Mark as Contacted]**, **[Schedule Follow-up]**, **[Suppress / Not a Fit]**
4. **Automatic Database Update:**
   Updates `leads_pipeline.stage = 'CONTACTED'`, sets `last_contacted_at = NOW()`, and records the activity in `communication_logs`.
