# LeadPulse AI - File & Folder Changelog

**Audit of all newly created, modified, and deleted files and directories across LeadPulse AI.**

---

## [2026-11-21] Enhancement Sprint 1: Full Implementation & Hardening

### Package Ecosystem Modernization to Latest Stable:
- **Next.js:** Upgraded from `15.5.29` to **`16.4.6`** with Turbopack compilation.
- **React & React-DOM:** Upgraded from release-candidate `19.0.0-rc...` to official stable **`19.3.1`**.
- **TypeScript Type Definitions:** Updated `@types/react` and `@types/react-dom` to **`19.3.0`**.
- **Better-Auth:** Upgraded from `1.0.0` to **`1.7.27`**.
- **Next Config:** Modernized `apps/web/next.config.mjs` for Next.js 16 compatibility (deprecated `eslint` config cleanly removed).

### Newly Created Files:
1. `docs/ENHANCEMENT_TRACKER.md` — Central tracking registry for enhancements (ENH-001 through ENH-007).
2. `docs/FILE_CHANGELOG.md` — Audit log of all file changes and additions across the workspace.
3. `packages/domain/src/location-hierarchy.ts` — Comprehensive PAN-India geographical dataset (States, Districts/Cities, Localities, and spatial bounding boxes).
4. `apps/web/src/app/actions/settings-actions.ts` — Server action `testNeonConnectionAction()` to ping Neon DB and report roundtrip latency (ms), host, engine version, and connection status.
5. `apps/web/src/app/dashboard/settings/neon-status-card.tsx` — Interactive Client Component with "Test Connection Now" action, live latency badge, and diagnostic troubleshooting banner.
6. `apps/web/src/app/dashboard/audit-lab/download-csv-button.tsx` — Client Component with CSV export engine and formula injection defense (`'`, `"`, `=`, `@` escaping).
7. `apps/web/src/app/dashboard/discovery/discovery-search-form.tsx` — Client Component featuring PAN-India cascading dropdowns (State -> District/City -> Locality), scan quantity limit selector (10 to 1000), and 4-phase animated progress bar with countdown timer.
8. `apps/web/src/app/privacy/page.tsx` — Public DPDPA 2023 & GDPR-aligned Privacy Policy page with opt-out / suppression rights.
9. `apps/web/src/app/terms/page.tsx` — Public Terms of Service page outlining commercial usage, acceptable use, and Indian jurisdiction.

### Modified Files:
1. `package.json` — Added explicit `--config=drizzle.config.ts` flag to `db:push`, `db:generate`, `db:migrate`, `db:studio` to fix default `drizzle.config.json not found` error (ISS-006).
2. `drizzle.config.ts` — Added fallback `process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL` so single-URL Neon configs work seamlessly.
3. `packages/domain/src/index.ts` — Exported `PAN_INDIA_LOCATIONS` and `resolveLocationByCode`.
4. `packages/infrastructure/src/db/client.ts` — Implemented `checkDatabaseHealth()` executing `SELECT 1, current_database(), version()` with roundtrip ping calculation.
5. `packages/infrastructure/src/connectors/osm-connector.ts` — Integrated `resolveLocationByCode` for dynamic PAN-India bounding boxes, strict category/location filtering, Indian mobile phone format cleaning, and limit handling.
6. `packages/infrastructure/src/connectors/google-places-connector.ts` — Added `generateQueryAwareGooglePlaces()` so free mock queries (e.g. "spa in villivakkam") dynamically generate niche- and locality-accurate results.
7. `packages/infrastructure/src/connectors/youtube-connector.ts` — Added query-aware YouTube channel generator for local niches across PAN India.
8. `apps/web/src/app/actions/audit-actions.ts` — Added `sessionAuditsCache` so newly executed audits immediately persist and display in Recent Website Diagnostics.
9. `apps/web/src/app/actions/discovery-actions.ts` — Added `limit` support to `runOsmDiscoveryAction`.
10. `apps/web/src/app/actions/outreach-actions.ts` — Dynamically resolved `appBaseUrl` using `process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000')` to fix Vercel prototype links (ISS-007).
11. `apps/web/src/app/dashboard/settings/page.tsx` — Integrated real-time `NeonConnectionCard` into the Database & Telemetry section.
12. `apps/web/src/app/dashboard/audit-lab/page.tsx` — Added `<DownloadAuditsCsvButton />` to the Recent Diagnostics table header.
13. `apps/web/src/app/dashboard/leads/[id]/page.tsx` — Added "Locate on Google Maps" button, dynamic base URL for outreach pitches, and Geolocation Preview card (ENH-004).
14. `apps/web/src/app/dashboard/outreach/outreach-client.tsx` — Made "Live Prototype" button relative (`/preview/...`) so clicking it opens on the active Vercel domain instead of hardcoded localhost (ISS-007).
15. `apps/web/src/app/dashboard/discovery/page.tsx` — Replaced static form with `DiscoverySearchForm`, updated header copy, and expanded lead cards with email and structured address details.
16. `apps/web/src/app/dashboard/discovery/multi-channel-connectors.tsx` — Renamed search prompt to "Search Query / Niche (PAN India)".
17. `docs/ISSUE_TRACKER.md` — Updated with resolutions for ISS-006, ISS-007, and ISS-008.
