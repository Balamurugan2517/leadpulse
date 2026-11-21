# LeadPulse AI --- Discovery Studio Design Layout

## 1. Purpose

Redesign the existing `/dashboard/discovery` page into a focused
**Discovery Studio** for finding, reviewing, qualifying and importing
business prospects.

This specification is based on the supplied screenshot. The current page
visibly contains:

-   Left navigation: Command Centre, Discovery Studio, Lead Explorer,
    Website Audit Lab, Outreach Desk, Sales Pipeline and Settings.
-   OpenStreetMap (Overpass) Discovery panel.
-   Target Locality in Chennai selector.
-   Target Industry / Category selector.
-   Run Discovery Scan action.
-   Quick-Capture Bookmarklet panel.
-   Discovered Prospects list with an Import All to CRM action.
-   Social & Extended Discovery Connectors with Google Places, YouTube
    and Meta/LinkedIn options.
-   Search Query / Niche in Chennai field.
-   Google Places API Key field, described as optional / free mode.
-   Search Google Places action.
-   Live High-Intent Signals & RFPs cards.

The redesign must preserve these capabilities while improving hierarchy,
usability, visibility, filtering, result review and responsive
behaviour. Do not assume that every displayed connector or signal is
fully integrated; show its actual implementation and connection state.

## 2. Current UI assessment

### Strengths to preserve

-   Dark LeadPulse visual identity.
-   Persistent left navigation.
-   Clear separation between OpenStreetMap discovery, external
    connectors, captured prospects and intent signals.
-   Locality and industry targeting are visible at the point of search.
-   Prospect preview and CRM import actions are already represented.
-   Quick-capture workflow is discoverable.

### Problems to address

1.  The main content occupies a narrow central column, leaving excessive
    unused horizontal space on desktop.
2.  Text, field labels and result metadata are too small to scan
    comfortably.
3.  Search controls, results and connector settings compete for
    attention instead of forming a clear workflow.
4.  The page does not make the active search scope and filters
    sufficiently prominent.
5.  Result rows have limited room for business details, qualification
    evidence and actions.
6.  Connector configuration is embedded in the discovery workflow,
    making it unclear whether the user is configuring a provider or
    running a search.
7.  The page needs clearer loading, empty, error, partial-result and
    rate-limit states.
8.  The visible "Import All" action needs selection, duplicate handling
    and import feedback rather than an opaque bulk action.
9.  Live signals need freshness, source and relevance context.
10. Responsive behaviour needs to be explicit.

## 3. Information architecture

Organize the page into five primary areas:

1.  **Discovery Search** --- search scope, geography, category, service
    and lead criteria.
2.  **Search Sources** --- OpenStreetMap/Overpass and configured
    external providers.
3.  **Prospect Results** --- result count, filters, selection, preview
    and CRM import.
4.  **Quick Capture** --- bookmarklet instructions and captured items.
5.  **Intent Signals** --- high-intent posts, requests for proposals and
    business needs.

Provider configuration should be accessible from a dedicated connector
settings area or a collapsible configuration panel. Do not force the
user to configure API credentials every time they run a search.

## 4. Desktop page layout

Use the available viewport width. Keep the existing sidebar but allow
the main content to expand.

``` text
┌──────────────────────┬─────────────────────────────────────────────────────────────┐
│ LeadPulse sidebar    │ Workspace / breadcrumb                     Help  Profile    │
│                      ├─────────────────────────────────────────────────────────────┤
│ Command Centre       │ Discovery Studio                         [Saved searches]   │
│ Discovery Studio     │ Find, qualify and import local business prospects            │
│ Lead Explorer        │                                                             │
│ Website Audit Lab    │ ┌─────────────────────────────────────────────────────────┐ │
│ Outreach Desk        │ │ SEARCH SCOPE                                              │ │
│ Sales Pipeline       │ │ Country > State > District > City > Locality / PIN       │ │
│ Settings             │ │ [Location selector] [Industry] [Category] [Service]      │ │
│                      │ │ [Lead criteria]                         [Run Discovery] │ │
│                      │ └─────────────────────────────────────────────────────────┘ │
│                      │                                                             │
│                      │ ┌───────────────────────┐ ┌───────────────────────────────┐ │
│                      │ │ SOURCE STATUS         │ │ QUICK CAPTURE                 │ │
│                      │ │ OSM / Overpass        │ │ Bookmarklet setup/status      │ │
│                      │ │ Other configured APIs │ │ [Install / Copy bookmarklet]  │ │
│                      │ └───────────────────────┘ └───────────────────────────────┘ │
│                      │                                                             │
│                      │ ┌─────────────────────────────────────────────────────────┐ │
│                      │ │ PROSPECT RESULTS                                         │ │
│                      │ │ 125 found   42 website gaps   18 high-intent   [Import]  │ │
│                      │ │ Search/filter/sort                                             │
│                      │ │ [ ] Business | Category | Location | Website | Score | Actions│
│                      │ │ [ ] Prospect row ...                                      │ │
│                      │ │ [ ] Prospect row ...                                      │ │
│                      │ └─────────────────────────────────────────────────────────┘ │
│                      │                                                             │
│                      │ ┌─────────────────────────────────────────────────────────┐ │
│                      │ │ CONNECTOR SEARCH & INTENT SIGNALS                       │ │
│                      │ │ Provider selection / query / connector status            │ │
│                      │ │ Intent signal cards with source and freshness            │ │
│                      │ └─────────────────────────────────────────────────────────┘ │
└──────────────────────┴─────────────────────────────────────────────────────────────┘
```

Suggested proportions: - Main content uses available width with a
readable maximum width around 1500 px. - Search scope spans the full
content width. - Source status and Quick Capture can sit in a 2-column
row on wide screens. - Results span the full width. - Intent signals use
2 columns on desktop and 1 column on mobile. - Avoid tiny typography.
Body text and table metadata must remain readable at normal browser
zoom.

## 5. Header

Title: **Discovery Studio**

Description: "Find local businesses, identify website and reputation
gaps, and turn qualified prospects into CRM leads."

Header actions: - Saved searches - Discovery history - Connector
settings

Optional status summary: - Last scan time - Current workspace - Current
search scope

Do not display fake scan counts or fabricated provider health.

## 6. Discovery Search --- primary search builder

This is the most important section. Make it the first and most visually
prominent panel.

### Geography

Support the cascading geographic hierarchy:

Country → State/UT → District → City/Town → Locality/Neighbourhood → PIN
code.

For India, examples should include: - Tamil Nadu - Chennai - Anna
Nagar - Adyar - Tiruchirappalli - Thillai Nagar

Requirements: - Searchable selectors/autocomplete. - Parent changes
clear incompatible child selections. - Support multiple localities or
areas where supported. - Display selected locations as removable
chips. - Support saved geographic zones. - Provide a clear "All Chennai"
or broader-area option only when its meaning is explicit. - Do not
silently expand a locality selection to an entire city. - Show the
selected geographic scope in a compact summary.

### Industry, category and service

Use a cascading taxonomy:

Industry → Business Category → Service.

Examples: - Healthcare → Dental clinic → Dental implants - Beauty &
Wellness → Salon → Hair colouring - Beauty & Wellness → Spa → Massage
therapy - Education → Coaching centre → Entrance exam coaching

Requirements: - Searchable selectors. - Support multiple
categories/services if the search engine supports them. - Distinguish
broad category searches from specific service searches. - Display
selected values as chips. - Avoid hardcoding a short category list into
the page if a managed taxonomy already exists.

### Lead qualification criteria

Provide an expandable "Lead criteria" section. Potential filters:

-   Website status: Any / No website / Website found / Broken /
    Unreachable.
-   Website quality: Outdated / Mobile issues / SSL issue / Slow / Needs
    review, only where an audit signal exists.
-   Reputation: Minimum rating, review count range, recent negative
    review signal, where sourced.
-   Business status: Open/operating/unknown, where source data supports
    it.
-   Lead score range.
-   Has phone / email / social profile.
-   Data confidence or verification level.

Do not imply that an audit or review signal has been verified if it is
only inferred from incomplete public data.

### Search controls

Primary button: **Run Discovery**

Secondary actions: - Save search - Reset filters - Preview query

Show a concise summary before execution: "Searching \[selected
locality\] for \[selected category\] using \[selected sources\]."

Disable duplicate submissions while a scan is running. Provide cancel
only if the backend job can actually be cancelled.

## 7. Search sources and connector status

Separate source selection from credential configuration.

### Source selection

Show selectable source cards/chips for sources that are actually
implemented, such as: - OpenStreetMap / Overpass - Google Places -
YouTube - Meta - LinkedIn - Other approved sources implemented in the
project

For each source show: - Enabled/disabled - Configured/not configured -
Verified/unverified - Last tested - Current availability or error state

Important: - A provider being listed in the UI does not mean it is
integrated. - Do not claim a source is active unless the backend
supports it and its current state is known. - Respect provider terms,
API restrictions, robots policies and rate limits. - Do not scrape
private or access-controlled content. - Do not imply that a source
offers a free API when this has not been verified.

### Connector configuration

Provide a "Manage connectors" action that opens a dedicated page, drawer
or settings section. Keep API key inputs out of the normal search form.

For optional credentials: - Show configured state, not the raw key. -
Use an empty replacement input. - Provide Test connection where
implemented. - Show a safe explanation of fallback/free mode. - Never
send secrets to the browser after saving.

## 8. Quick Capture bookmarklet

Retain the Quick-Capture workflow but make its purpose and setup
clearer.

Panel content: - What Quick Capture does. - Installation instructions. -
Bookmarklet button/drag target, if the existing implementation supports
it. - Copy bookmarklet action. - Installed/not installed cannot be
reliably detected unless the application has a real mechanism; do not
fabricate it. - Last captured item timestamp, if stored. - Number of
captured items, if available. - Open capture inbox.

Security: - Explain what page data is collected. - Require explicit user
action to capture. - Do not collect passwords, private messages or
sensitive form data. - Validate and sanitize captured content
server-side. - Make source URL and capture timestamp visible.

## 9. Prospect Results

This should be the largest content section after the search builder.

### Results header

Display: - Number of results returned - Number selected - Search
source(s) - Geographic scope - Search completion timestamp - Import
selected action - Export action only if implemented and authorized

Avoid "Import All" as the only bulk action. Prefer: - Select visible -
Select all results (with explicit scope) - Import selected - Clear
selection

### Result table

Recommended columns:

  Column         Content
  -------------- -------------------------------------------------
  Select         Row checkbox
  Business       Name and optional logo/category
  Category       Industry/category/service
  Location       Locality, city and PIN if known
  Contact        Phone/email when publicly sourced and permitted
  Website        URL and status
  Reputation     Rating and review count, if source provides
  Lead signals   No website, broken website, low reviews, etc.
  Lead score     Score and explanation
  Source         Provider and source link
  Actions        Preview, audit, add to CRM

On smaller screens, use result cards or a horizontally scrollable table
with the business identity kept visible.

### Prospect row behaviour

-   Clicking Preview opens a detailed prospect drawer or page.
-   Show evidence behind signals (source and observed date).
-   Distinguish source facts from inferred assessments.
-   Allow editing/confirming business details before CRM import.
-   Detect likely duplicates using existing deduplication logic.
-   Do not create duplicate CRM leads.
-   Show imported/already-in-CRM state.
-   Provide clear import success/failure feedback.

### Result filters and sorting

Support: - Search within results - Category - Locality - Website
status - Lead score - Source - Has contact details - Duplicate/import
status

Sorting: - Relevance - Lead score - Business name - Review count/rating
where available - Recently discovered

Use server-side pagination for large result sets.

## 10. Prospect preview drawer

Suggested sections:

1.  Business overview
2.  Location and address
3.  Contact details
4.  Website and audit status
5.  Reputation/reviews
6.  Social/public profiles
7.  Lead qualification evidence
8.  Source provenance
9.  CRM status and activity

Actions: - Add to CRM - Run website audit - Edit/verify details - Copy
permitted contact details - Open original source

Do not invent missing contact information or source evidence.

## 11. Social & Extended Discovery Connectors

The current page includes provider buttons, a search query field and a
Google Places API key field. Improve this into a clear connector search
module.

Layout: - Select one or more supported providers. - Enter a
natural-language query or niche. - Select or inherit geographic scope. -
Show which credentials are required. - Show configured/verified
status. - Run search. - Show per-provider results and failures.

Example query: "Dental clinics in Adyar, Chennai with no website."

The search engine should combine the query with structured filters
rather than rely exclusively on free-text search.

Show partial success when one source fails but another succeeds. Do not
discard successful results because one provider is unavailable.

## 12. Live High-Intent Signals & RFPs

Retain the visible signal cards but improve their content.

Each signal card should show: - Signal title - Short excerpt - Source
platform - Original source link - Location, if known - Detected/posted
timestamp - Freshness indicator - Intent category (request for website,
booking system, marketing, quote/RFP, etc.) - Relevance score and brief
reason, if actually calculated - Save to leads / dismiss actions

Distinguish: - Posted time (source timestamp) - Detected time (when
LeadPulse found it) - Last checked time

Do not label a signal "live" unless it is actually refreshed on a known
schedule. If refreshed every six hours, display that as a scan schedule
and show the last successful scan time.

## 13. Discovery history and saved searches

Add accessible entry points for:

### Saved searches

-   Search name
-   Geographic scope
-   Industry/category/service
-   Selected sources
-   Lead criteria
-   Created/updated time
-   Run again
-   Edit
-   Delete with confirmation

### Discovery history

-   Run ID
-   Started/completed time
-   Search scope
-   Sources used
-   Results count
-   Imported count
-   Status: queued/running/completed/partial/failed
-   Sanitized failure reason

Use existing job/history tables where possible. Do not create duplicate
job systems.

## 14. States and feedback

Design all of these states:

-   Initial/no search yet
-   Ready to search
-   Validating filters
-   Queued
-   Running
-   Completed with results
-   Completed with zero results
-   Partial results
-   Provider rate limited
-   Provider unavailable
-   Search failed
-   Import in progress
-   Import completed
-   Import partially failed
-   Duplicate detected
-   No connectors configured

Each state must communicate what happened and what the user can do next.

## 15. Visual design system

Preserve LeadPulse dark theme and current navigation identity.

-   Use a wider, responsive content canvas.
-   Increase font sizes for labels, body text and metadata.
-   Use consistent spacing and card padding.
-   Use strong section headings and concise descriptions.
-   Use neutral surfaces and subtle borders.
-   Use the existing blue accent for primary actions.
-   Use green only for confirmed success/healthy states.
-   Use amber for partial/degraded/warning states.
-   Use red for confirmed failures.
-   Use grey for unknown/disabled/unverified.
-   Include text labels alongside status colours.
-   Keep primary Run Discovery action visually prominent.
-   Avoid unnecessary decorative gradients and excessive badges.

## 16. Accessibility and responsive behaviour

-   All controls must have accessible labels.
-   Support keyboard navigation and visible focus states.
-   Use semantic headings.
-   Ensure adequate contrast.
-   Do not rely on colour alone.
-   On tablet, stack search controls as needed.
-   On mobile, stack panels, use compact filters and render prospect
    results as cards.
-   Keep important actions reachable without excessive scrolling.
-   Preserve loading and error context when the layout changes.

## 17. Suggested component structure

Adapt to actual repository conventions. Inspect before creating files.

``` text
discovery/
  discovery-page
  discovery-header
  discovery-search-builder/
    geographic-filter
    industry-category-filter
    service-filter
    lead-criteria-filter
    selected-filter-summary
  sources/
    source-selector
    source-status-card
    connector-settings-link
  quick-capture/
    quick-capture-card
    bookmarklet-instructions
  results/
    results-toolbar
    results-table
    prospect-row
    prospect-card
    prospect-preview-drawer
    result-filters
    import-summary
  signals/
    intent-signal-list
    intent-signal-card
  history/
    saved-searches
    discovery-history
```

## 18. Acceptance criteria

-   The page uses desktop width effectively and remains responsive.
-   Search scope is clear and structured.
-   Geographic selection supports the agreed cascading hierarchy.
-   Industry/category/service selection is clear.
-   Lead qualification criteria are available without overwhelming the
    default view.
-   Source selection is separate from credential management.
-   Provider states reflect real backend state.
-   Quick Capture instructions and capture inbox are understandable.
-   Results are readable and filterable.
-   Prospect preview shows source evidence and signal freshness.
-   Bulk CRM import supports selection, duplicate handling and clear
    outcomes.
-   Intent signals show source and timestamps.
-   Loading, empty, partial, error and success states are implemented.
-   Existing features and routes continue to work.
-   No mock status or fabricated lead metrics appear in production.
