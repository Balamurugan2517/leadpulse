# ADR-008: Instant Micro-Site Prototype Generator

- **Status:** Approved
- **Date:** 2026-11-07
- **Deciders:** Solo Founder & Lead Solution Architect

## Context
Standard cold outreach asking businesses if they need a website yields low response rates because business owners cannot visualize the end product. Generating a personalized, interactive website prototype pre-populated with the prospect's actual business name, category, phone number, and location dramatically increases reply and conversion rates.

## Decision
Implement a zero-cost, automated **Instant Micro-Site Generator**:
1. **Dynamic Preview Route:** 
   Serve live previews at `/preview/[slug]` directly from the Next.js application (`apps/web`).
2. **Template Library:**
   Include clean, mobile-first, high-performance HTML/Tailwind templates tailored by industry (Clinics/Healthcare, Coaching/Education, Cafes/Restaurants, Professional Services, General Trades).
3. **Pre-Populated Data:**
   - Real business name, category, address, and Google Maps pin.
   - Pre-configured `tel:` call button and `https://wa.me/` direct WhatsApp appointment booking button.
   - Google Review badge and core service cards.
4. **Outreach Integration:**
   The unique preview URL is automatically included in the generated WhatsApp and Email drafts:
   > *"I took 10 minutes to craft a live, mobile-friendly prototype for [Business Name]: [Preview URL]. Take a look on your phone!"*
5. **Standalone HTML Export:**
   Allow the founder to download a single-file, self-contained `index.html` with inline CSS to send as a file attachment or host anywhere.

## Consequences
- Significantly higher lead-to-meeting conversion rates.
- $0.00 extra cost (runs within the existing Next.js web application).
- Operates automatically as soon as a lead is verified.
