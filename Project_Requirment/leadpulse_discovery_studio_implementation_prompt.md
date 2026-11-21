# LeadPulse AI --- Discovery Studio Enhancement Implementation Prompt

## Objective

Improve the existing LeadPulse AI Discovery Studio page at
`/dashboard/discovery` using the companion **Discovery Studio Design
Layout** specification.

The supplied screenshot shows these existing features: - OpenStreetMap
(Overpass) Discovery - Target locality in Chennai - Target
industry/category - Run Discovery Scan - Quick-Capture Bookmarklet -
Discovered Prospects list - Import All to CRM - Social & Extended
Discovery Connectors - Google Places, YouTube and Meta/LinkedIn provider
options - Search Query / Niche in Chennai - Optional Google Places API
Key field - Search Google Places action - Live High-Intent Signals &
RFPs

Preserve these features and improve their usability. Do not rebuild the
application or replace existing business logic without first assessing
it.

## Phase 1 --- Inspect before modifying

1.  Inspect the repository and identify the actual Next.js app root.
2.  Locate the Discovery Studio page and all child components.
3.  Trace the current OpenStreetMap/Overpass discovery flow.
4.  Trace the Quick-Capture bookmarklet generation and capture API.
5.  Trace provider integrations and credential handling.
6.  Trace prospect persistence, deduplication and CRM import.
7.  Trace intent signal ingestion, refresh schedule and source links.
8.  Inspect Drizzle schema, existing jobs/history tables and migrations.
9.  Inspect authentication, workspace authorization and role
    permissions.
10. Inspect existing tests and UI conventions.

Create a concise impact assessment. Reuse existing services, tables,
routes and components wherever possible. Do not create duplicate
discovery jobs, duplicate lead records or parallel connector systems.

## Phase 2 --- Redesign the page

Follow the companion design specification.

-   Preserve LeadPulse dark theme and left navigation.
-   Expand the content area to use available desktop width.
-   Improve typography and spacing.
-   Make the page responsive.
-   Make the search builder the primary visual focus.
-   Separate source selection from provider credential configuration.
-   Give prospect results sufficient width and readable metadata.
-   Keep Quick Capture and Intent Signals accessible.
-   Add clear page states and feedback.

## Phase 3 --- Discovery search builder

Implement or improve structured filters for:

### Geography

Country → State/UT → District → City/Town → Locality/Neighbourhood → PIN
code.

Support Chennai and locality-level examples such as Anna Nagar and
Adyar, and other cities/localities such as Tiruchirappalli and Thillai
Nagar, using real reference data already available or a documented
data-import process.

Requirements: - Searchable cascading selectors. - Clear incompatible
child values when a parent changes. - Multi-select where supported. -
Removable selected-location chips. - Saved geographic zones where
supported. - Explicit search scope summary. - Do not silently expand a
locality to an entire city.

### Business taxonomy

Industry → Category → Service.

Reuse the existing taxonomy and database tables if available. Support
broad and specific searches without hardcoding a tiny set of categories
into the UI.

### Lead qualification

Provide optional expandable criteria for: - Website status - Website
audit findings - Review/rating signals - Contact availability - Business
status - Lead score - Source and verification confidence

Only offer a filter if the backend has reliable data to evaluate it.
Distinguish verified source facts from inferred signals.

## Phase 4 --- Search source selection

Keep source selection distinct from credentials.

-   Show only providers that are implemented or clearly label
    planned/unavailable integrations.
-   Show configured, verified, enabled and error states separately.
-   Show last-tested time where available.
-   Respect provider terms, quotas and rate limits.
-   Keep all credentials server-side.
-   Support partial results if one provider fails and another succeeds.
-   Do not claim that an API is free unless this has been verified.

## Phase 5 --- Quick Capture

Preserve the current bookmarklet capability.

-   Improve the explanation and installation instructions.
-   Provide copy/drag interaction only if supported by the current
    implementation.
-   Link to the capture inbox.
-   Show capture counts/timestamps only when available from real data.
-   Validate and sanitize captured payloads server-side.
-   Preserve source URL and capture timestamp.
-   Do not collect passwords, private messages or sensitive form fields.

## Phase 6 --- Prospect results and CRM import

Improve the results panel.

Display, where available: - Business name - Industry/category -
Locality/city/PIN - Publicly sourced contact details - Website and
website status - Rating/review count - Lead signals - Lead score and
reason - Source/provenance - CRM import state

Implement: - Search within results - Filters and sorting - Server-side
pagination for large result sets - Select visible / clear selection -
Import selected - Duplicate detection using existing logic - Preview
drawer/details page - Clear success, partial failure and error feedback

Do not create duplicate CRM records. Do not silently import all results
without making the scope explicit. Preserve source evidence and observed
timestamps.

## Phase 7 --- Prospect preview

Provide a detailed preview using actual stored/source data: - Business
overview - Location - Contact information - Website and audit findings -
Reputation signals - Public profiles - Lead qualification evidence -
Source links and timestamps - CRM status

Actions may include Add to CRM, Run Website Audit, Edit/Verify and Open
Source, but only when backed by existing APIs and permissions.

## Phase 8 --- Social and extended discovery

Improve the existing provider/query area.

-   Use structured geography and category filters alongside the
    natural-language query.
-   Show credential requirements and provider status.
-   Move API key configuration to connector settings or a secure drawer.
-   Never prefill a secret input with the stored secret.
-   Never return raw credentials to the client.
-   Provide connection tests only where implemented.
-   Preserve successful results when another provider returns an error.

## Phase 9 --- Intent signals and RFPs

Improve signal cards with: - Title and excerpt - Source and original
link - Location where known - Posted/detected timestamps -
Freshness/last-checked time - Intent category - Relevance score/reason
only if actually calculated - Save/dismiss actions if supported

If the system scans every six hours, show the actual last successful
scan time and schedule. Do not label stale content as live.

## Phase 10 --- Saved searches and discovery history

Reuse existing storage/jobs infrastructure where possible.

Provide: - Saved search name and criteria - Run again/edit/delete - Run
ID and timestamps - Source list - Result/import counts -
Queued/running/completed/partial/failed status - Sanitized failure
information

Do not create a second queue or job tracking system.

## Phase 11 --- Reliability, security and validation

-   Reuse existing authentication and workspace authorization.
-   Validate all inputs on the server.
-   Use parameterized database queries.
-   Rate-limit expensive scans and provider calls.
-   Prevent duplicate submissions.
-   Sanitize provider errors and captured content.
-   Keep API keys and tokens server-side.
-   Enforce workspace ownership for saved searches, captures and
    prospects.
-   Log operational events without logging secrets.
-   Respect source terms, privacy requirements and rate limits.

## Phase 12 --- Testing

Test: 1. Search with locality and category. 2. Cascading geography
changes. 3. Multi-locality selection if supported. 4. Invalid filter
combinations. 5. Overpass success, timeout and error. 6. Connector
configured/unconfigured states. 7. Provider partial failure. 8. Quick
Capture validation and capture persistence. 9. Prospect result
pagination and filters. 10. Prospect preview and source provenance. 11.
CRM import and duplicate handling. 12. Import partial failure. 13.
Intent signal freshness and source links. 14. Saved search persistence
and replay. 15. Workspace isolation and unauthorized access. 16.
Responsive desktop/tablet/mobile layouts. 17. Regression of existing
Discovery Studio behaviour.

Use mocks only in tests or clearly labelled development previews. Never
show fake live data in production.

## Phase 13 --- Documentation and delivery

Update documentation with: - Discovery Studio component architecture -
Search/filter data flow - Geography and taxonomy dependencies - Provider
integration status - API contracts - Quick Capture workflow - CRM
import/deduplication flow - Intent signal freshness - Security and
rate-limit controls - Test results and deployment notes

## Execution rules

-   Inspect before editing.
-   Preserve existing functionality and architecture.
-   Adapt file paths to the repository rather than assuming a folder
    layout.
-   Do not introduce unnecessary paid services.
-   Do not commit secrets or environment files.
-   Do not execute destructive database operations.
-   Do not run production migrations or deploy production changes
    without explicit approval.
-   Routine implementation, local testing and documentation may proceed
    without asking for approval at every step.
-   If schema changes are required, create a reviewed migration and
    explain its impact before applying it.
-   Report files changed, completed work, pending work, blockers and
    test results.

## Expected result

A responsive, readable and operational Discovery Studio where the user
can build a structured geographic/business search, select supported
sources, run discovery, review evidence-backed prospects, import
selected unique prospects into CRM, use Quick Capture and monitor
high-intent signals with accurate freshness information.
