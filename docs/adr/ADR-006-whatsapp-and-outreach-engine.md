# ADR-006: WhatsApp & Outreach Human-in-the-Loop Protocol

- **Status:** Approved (Phase 0)
- **Date:** 2026-11-07
- **Deciders:** Lead Architecture Review Board

## Context
The founder requires a streamlined system to send evidence-backed messages to prospective clients via WhatsApp and Email, while tracking interaction history in Neon PostgreSQL.
- Sending bulk automated WhatsApp messages via unofficial web automation leads to rapid account bans.
- Official WhatsApp Business Cloud API requires Meta business verification, per-template approvals, and monthly conversation fees.
- The founder demands full review control over every message sent to protect brand reputation.

## Decision
1. **Stage 1 Protocol (Assisted Deep Linking):**
   - The platform generates a tailored, evidence-backed message using structured data (e.g. referencing an expired SSL certificate or missing mobile layout).
   - In the Outreach Desk, the founder reviews the draft, makes any desired tweaks, and clicks **[Send via WhatsApp]**.
   - The web app generates a standard deep link: `https://wa.me/<E164_PHONE>?text=<URL_ENCODED_MESSAGE>`.
   - The link opens WhatsApp Web or the WhatsApp desktop/mobile application with the pre-filled message ready to send with 1 click.
   - For email, `mailto:` deep links or 1-click clipboard copy is provided.
2. **Interactive Acknowledgment Flow:**
   - After clicking, an acknowledgment modal appears: *"Did you send the message to [Business Name]?"*
   - Marking **[Yes, Sent]** updates `leads_pipeline.stage` to `CONTACTED`, records the timestamp, and creates an audit entry in `communication_logs`.
   - The founder can schedule a follow-up reminder date or mark the lead as `SUPPRESSED` if rejected.
3. **Stage 2 Future Evolution:**
   - Maintain an `OutreachAdapter` port in `packages/contracts`. If the founder later purchases Meta WhatsApp Cloud API credentials, an official automated adapter can be plugged in without changing domain logic.

## Consequences
- Zero risk of WhatsApp phone number bans.
- Zero API cost for communications.
- Guaranteed human-in-the-loop quality control for every client conversation.
- Accurate pipeline stage tracking in Neon DB.
