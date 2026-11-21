# LeadPulse AI --- Settings & Operator Console Design Layout

## 1. Design objective

Transform the existing Settings page into a practical, enterprise-style
operator console. The page should make it easy to:

-   Edit agency and workspace information.
-   Configure and verify integrations.
-   See whether the pooled application database connection is healthy.
-   See whether direct/unpooled database configuration is present.
-   Monitor workers, queues and application health.
-   Manage security, outreach compliance and alerts.
-   Review configuration changes.

This is a design and behaviour specification, not a claim that any
displayed status is currently live.

## 2. Global page structure

### Desktop layout

Use a wide content area with a persistent settings navigation and a main
content panel.

``` text
┌──────────────────────────────────────────────────────────────────────────────┐
│ LeadPulse                                             Workspace ▾  Profile   │
├───────────────────┬──────────────────────────────────────────────────────────┤
│ SETTINGS          │ Settings & System Control Centre                        │
│                   │ Manage configuration, integrations and system health    │
│ Overview          │                                                          │
│ Agency Profile    │ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐ │
│ Integrations      │ │ Database   │ │ Connectors │ │ Workers    │ │ Alerts  │ │
│ Discovery         │ │ status     │ │ status     │ │ status     │ │ status  │ │
│ Database          │ └────────────┘ └────────────┘ └────────────┘ └─────────┘ │
│ System Health     │                                                          │
│ Security          │ Selected settings section content                       │
│ Compliance        │                                                          │
│ Notifications     │                                                          │
│ Preferences       │                                                          │
│ Audit History     │                                                          │
└───────────────────┴──────────────────────────────────────────────────────────┘
```

Recommended proportions: - Settings navigation: approximately 220--260
px. - Main content: flexible, with a comfortable maximum width. -
Summary cards: 3--4 columns on wide desktop, 2 on tablet, 1 on narrow
mobile. - Keep forms readable; do not stretch narrow input fields across
the entire screen unnecessarily.

### Mobile layout

-   Replace the persistent sidebar with a compact section selector or
    collapsible menu.
-   Stack summary cards vertically or in a two-column grid where space
    permits.
-   Keep primary Save/Test actions reachable.
-   Avoid horizontal scrolling for tables; use responsive cards or
    controlled overflow.

## 3. Overview page

Purpose: give the operator a quick, truthful view of the system.

### Header

**Settings & System Control Centre**

Description: "Manage your workspace, integrations, infrastructure health
and operational policies."

Actions: - Refresh status - View audit history

### Summary cards

1.  Database
    -   Current state: Connected / Degraded / Disconnected / Unknown
    -   Last checked timestamp
    -   Measured latency, if available
2.  Discovery connectors
    -   Number configured
    -   Number verified
    -   Number failing
3.  Worker engine
    -   Running / Stopped / Unknown
    -   Last heartbeat
4.  Alerts
    -   Active alert count
    -   Most recent alert timestamp

Only show metrics backed by actual data. If the application cannot
determine a value, show "Unknown" or "Not available".

### Recent activity

Show a compact list of: - Recent configuration changes - Recent
connector tests - Recent database health checks - Recent worker failures

Apply workspace authorization and pagination.

## 4. Agency Profile & Branding

### Layout

``` text
Agency Profile & Branding                         [Edit]
Manage the identity used across LeadPulse and generated proposals.

┌────────────────────────────────────────────────────────────────┐
│ Logo preview       Agency / Business Name                       │
│ [Upload logo]      Founder / Consultant Name                    │
│                    Contact email                                │
│                    Phone / WhatsApp                             │
│                    Website                                      │
│                    Business address                             │
└────────────────────────────────────────────────────────────────┘

Branding
┌────────────────────────────────────────────────────────────────┐
│ Primary colour       [colour control]                           │
│ Secondary colour     [colour control]                           │
│ Proposal logo        [preview]                                  │
│ Default proposal footer                                       │
└────────────────────────────────────────────────────────────────┘
                                              [Cancel] [Save changes]
```

Behaviour: - Default to read-only summary mode. - Edit opens an inline
form or dedicated edit panel. - Cancel discards unsaved edits. - Save
validates and persists changes. - Show when the profile was last
updated. - Do not imply that a logo upload succeeded until storage
confirms it.

## 5. API Keys & Integrations

### Provider cards

Each provider card should contain:

-   Provider name and icon
-   Integration category
-   Configuration state
-   Verification state
-   Enabled/disabled state
-   Last tested timestamp
-   Sanitized last error, if any

Actions: - Configure - Test connection - Enable/Disable - Replace
credential - Remove credential

### Credential editing

``` text
Configure provider
Provider: [Provider name]

API key
[••••••••••••••••••••••••] [Replace key]

[ ] Enable this connector

Status: Configured — not yet verified
Last tested: Never

                         [Cancel] [Save] [Save & Test]
```

Security: - Never reveal a stored secret. - Do not prefill a secret
input with the actual credential. - Use an empty replacement field. -
Make "configured" and "verified" distinct states. - Confirm before
removing a credential. - Do not expose raw provider errors if they
contain sensitive details.

## 6. Discovery Connectors

Group connectors by function, for example:

-   Business discovery
-   Search and web data
-   Social/public sources
-   Website analysis
-   Email delivery
-   AI/model providers

For each connector show: - Provider - Supported capability - Configured
state - Enabled state - Last test result - Rate limit/quota only when
available - Fallback priority, if implemented

Do not imply that a source is available for production discovery merely
because a credential field exists. Show implementation state separately
from credential state.

Suggested status vocabulary: - Not configured - Configured ---
unverified - Connected - Degraded - Disabled - Error - Unknown

## 7. Database & Connection Health

This is a high-priority section.

### Top status panel

``` text
PostgreSQL / Neon Database Health                  [Refresh] [Test connection]

┌─────────────────────┬─────────────────────┬─────────────────────┐
│ Runtime connection  │ Health-check time   │ Query latency       │
│ Connected           │ 21 Nov 2026 01:30    │ 42 ms               │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

All values above are illustrative only. The live page must populate them
from server-side checks.

### Connection configuration panel

``` text
Database provider             Neon
Database engine               PostgreSQL
ORM                           Drizzle
Runtime connection            Pooled
DATABASE_URL                   Present — value hidden
DATABASE_URL_UNPOOLED          Present — value hidden
```

Never display complete URLs or credentials.

### Health-check history

Use a table or compact timeline:

  Time        Connection        Duration Result            Details
  ----------- ------------ ------------- ----------------- -----------
  Timestamp   Pooled         Measured ms Success/Failure   Sanitized
  Timestamp   Direct         Measured ms Success/Failure   Sanitized

Do not test the direct connection on every routine page refresh. Direct
connectivity should be tested only when explicitly requested or as part
of an appropriately controlled diagnostic.

### Pool metrics

Show active, idle, maximum and utilization only if the current
driver/provider exposes trustworthy metrics. Otherwise show:

"Pool-level metrics are not exposed by the current application driver."

Do not fabricate active connection counts.

### Error details

Show a human-readable category: - Missing configuration - Authentication
failed - Connection timeout - DNS/network failure - Database
unavailable - Query failed - Unknown error

Include a sanitized diagnostic identifier and timestamp where useful.
Keep raw stack traces and secrets server-side.

## 8. Application & Worker Monitoring

Cards or panels: - Application health - API health - Worker heartbeat -
Queue depth - Pending jobs - Running jobs - Failed jobs - Last
successful job

Only show metrics supported by the actual implementation.

Use status timestamps and make stale telemetry obvious. A previously
successful heartbeat must not be shown as current if it is old.

Do not provide Start/Stop/Retry/Delete controls unless those actions
already exist, are authorized and are audited.

## 9. Security & Access Control

Include sections for: - Workspace members and roles - Administrative
permissions - Session/security settings, if supported - Secret access
policy - Audit events

Clearly distinguish settings that are configurable from security
controls enforced by the hosting platform or identity provider.

## 10. Ethical Outreach & Compliance

Include: - Suppression list - Consent and lawful-basis policy
references - Outreach channel controls - Manual approval requirement -
Daily/weekly sending limits, if implemented - Provider-specific policy
notes

Keep bulk outreach disabled unless the product's consent, suppression
and approval checks are satisfied.

Provide clear confirmation and audit logging for policy changes.

## 11. Notifications & Alerts

Alert categories: - Database connection failure - Connector failure -
Worker/queue failure - Application error - Usage/quota threshold

Each alert rule should show: - Enabled state - Trigger condition -
Delivery channel - Recipient scope - Last delivery result

Do not show an alert rule as operational until its delivery channel has
been tested.

## 12. Workspace & Application Preferences

Potential settings: - Workspace name and defaults - Time zone (default
appropriate to the workspace; do not hard-code user locale into shared
data) - Date/time format - Default search preferences - Lead discovery
defaults - Table density and display preferences - Feature flags,
restricted to authorized operators

Separate user preferences from workspace-wide settings.

## 13. Configuration Audit History

Use a filterable, paginated table:

  Timestamp   Actor   Section     Change                   Result
  ----------- ------- ----------- ------------------------ ---------
  Date/time   User    Branding    Updated primary colour   Success
  Date/time   User    Connector   Replaced credential      Success

Never display secret values in audit history. For credential events,
record only an event such as "Credential replaced"; do not record the
credential or its suffix unless the security design explicitly permits
it.

## 14. Shared interaction rules

-   Use consistent Save, Cancel, Edit, Test and Refresh actions.
-   Disable duplicate submissions while an action is in progress.
-   Show progress for connection tests.
-   Distinguish current health from last-known health.
-   Confirm sensitive actions such as removing credentials or changing
    compliance policies.
-   Use optimistic UI only for reversible, low-risk preferences.
-   For infrastructure checks, update the UI only after the server
    returns a result.
-   Provide accessible labels, keyboard navigation and visible focus
    states.
-   Keep error messages actionable but sanitized.

## 15. Visual style

-   Preserve the existing LeadPulse dark visual identity.
-   Use a restrained accent colour for primary actions.
-   Use neutral surfaces and clear card boundaries.
-   Reserve green for confirmed healthy/success states.
-   Use amber for degraded or warning states.
-   Use red for confirmed failures.
-   Use grey for unknown, disabled or unverified states.
-   Do not use colour alone to communicate status; include text and,
    where useful, an icon.
-   Use consistent spacing, typography and card radii.
-   Avoid excessive gradients, oversized headings and decorative
    elements that reduce information density.

## 16. Suggested component organization

Adapt to the actual repository conventions; do not force these paths if
the project uses a different structure.

``` text
settings/
  settings-layout
  settings-navigation
  settings-overview
  agency-profile/
    agency-profile-card
    agency-profile-form
    branding-settings
  integrations/
    integration-card
    integration-list
    credential-dialog
    connection-test-result
  database/
    database-health-card
    database-connection-details
    database-health-history
    database-diagnostics
  system/
    application-health
    worker-health
    queue-health
  security/
    access-control-settings
    audit-history
  compliance/
    outreach-policy
    suppression-list
  notifications/
    alert-rules
  preferences/
    workspace-preferences
```

## 17. Acceptance criteria

The design is ready for implementation when:

-   The page has clear navigation and responsive behaviour.
-   Existing settings are preserved.
-   Editable fields have explicit Save/Cancel behaviour.
-   Database status is based on a real server-side health check.
-   Pooled and direct connection configuration are distinguished.
-   Credentials are never exposed.
-   Unsupported telemetry is labelled unavailable rather than
    fabricated.
-   Connector configuration and verification states are distinct.
-   Workspace authorization is enforced.
-   Sensitive changes are audited.
-   Loading, error, empty and success states are designed.
-   The layout works on desktop, tablet and mobile.
