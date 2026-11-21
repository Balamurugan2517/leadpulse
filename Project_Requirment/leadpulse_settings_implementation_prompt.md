# LeadPulse AI --- Settings & Operator Console Implementation Prompt

## Objective

Enhance the existing LeadPulse AI Settings page into a functional,
secure, responsive **Settings & System Operator Console**.

The current page already contains sections for:

-   Agency Profile & Quotation Branding
-   Discovery Connectors
-   PostgreSQL & Database Telemetry
-   Ethical Outreach & Anti-Spam Compliance
-   API Keys & Free Connectors
-   Worker Engine status

Improve the existing implementation. Preserve working features, routes,
database relationships, design conventions and application architecture.
Do not replace the Settings system with a parallel implementation.

## 1. Repository and architecture assessment

Before changing code:

1.  Inspect the repository structure and identify the actual web
    application root.
2.  Locate the existing Settings page, components, styles, API routes
    and server actions.
3.  Inspect the Drizzle schema, migrations and database client.
4.  Identify existing configuration tables and workspace relationships.
5.  Inspect authentication, authorization, roles and session handling.
6.  Determine how environment variables are loaded in development, build
    and production.
7.  Identify existing connector/provider integrations and worker/queue
    implementations.
8.  Classify each setting as database-backed, environment-backed,
    provider-managed or derived telemetry.
9.  Identify existing tests and project conventions.

Produce a concise impact assessment before implementation. Reuse
existing tables and services where appropriate. Do not create duplicate
configuration records, duplicate database clients or a second queue
system.

## 2. Settings information architecture

Organize the page into these sections:

1.  Overview
2.  Agency Profile & Branding
3.  API Keys & Integrations
4.  Discovery Connectors
5.  Database & Connection Health
6.  Application & Worker Monitoring
7.  Security & Access Control
8.  Ethical Outreach & Compliance
9.  Notifications & Alerts
10. Workspace & Application Preferences
11. Configuration Audit History

Use a responsive navigation pattern appropriate to the existing
application. On desktop, prefer a left settings navigation with a wide
content panel. On mobile, use a compact selector or collapsible
navigation.

## 3. Editable agency profile and branding

Support editing, subject to the existing data model:

-   Agency/business name
-   Founder/consultant display name
-   Contact email
-   Contact phone/WhatsApp number
-   Website URL
-   Business address
-   Logo
-   Brand colours
-   Proposal/quotation branding
-   Default proposal information

Requirements:

-   Clear Edit, Save and Cancel actions.
-   Client- and server-side validation.
-   Loading, success, validation and failure states.
-   Persist changes through the existing database architecture.
-   Do not overwrite existing values unexpectedly.
-   Enforce workspace ownership and role permissions.
-   Record non-secret changes in the audit history.
-   Ensure saved branding is used by existing proposal generation
    features.

## 4. API keys and connector management

For each supported provider, display:

-   Provider name and category
-   Configured / Not configured
-   Enabled / Disabled
-   Verified / Not verified
-   Last successful test
-   Last failed test
-   Last test result
-   Usage/quota, only if available from a reliable provider source
-   Sanitized error summary

Provide actions where supported:

-   Add credential
-   Replace credential
-   Remove credential
-   Test connection
-   Enable/disable connector
-   Select/configure fallback provider

Security requirements:

-   Never return raw credentials to the browser.
-   Mask credentials in the UI; show only safe metadata such as a short
    suffix if appropriate.
-   Never log credentials.
-   If secrets are stored in the database, use authenticated encryption
    at rest and keep encryption keys outside the database.
-   Prefer server-side environment variables for infrastructure-level
    credentials.
-   Clearly distinguish "configured" from "successfully verified".
-   Do not claim a provider is connected unless a real server-side test
    succeeded.
-   Respect provider terms, quotas and rate limits.
-   Do not make provider API calls from client-side code when
    credentials are involved.

## 5. Database connection and telemetry

Use the existing server-side Drizzle database client. Do not create a
separate database client just for the Settings page.

### Display

-   Database provider (for example, Neon)
-   Database engine and version, where safely obtainable
-   Database name, only if safe to disclose to the authorized operator
-   Region, only when available from a reliable source
-   ORM/client information
-   Runtime connection status
-   Pooled connection configuration status
-   Direct/unpooled connection configuration status
-   Last health-check timestamp
-   Last successful check
-   Last failed check
-   Health-check latency
-   Sanitized error category and diagnostic details

### Connection model

The project currently uses these environment variable names:

-   `DATABASE_URL`: pooled application/runtime connection.
-   `DATABASE_URL_UNPOOLED`: direct connection for migrations or
    operations that require a direct connection.

Verify the actual `.env` files, Vercel environment configuration,
Drizzle configuration, database client and package scripts before
changing this setup. Do not assume the variables are loaded
automatically. Do not print or return their values.

### Health-check behaviour

-   Implement an authenticated server-side health endpoint/action.
-   Use the existing database client and a lightweight read-only query
    such as `SELECT 1`.
-   Apply a bounded timeout.
-   Return structured status, duration, timestamp and sanitized error
    classification.
-   Distinguish missing configuration, authentication failure, timeout,
    DNS/network failure, database unavailable and query failure where
    feasible.
-   Do not expose stack traces, hostnames, usernames, passwords or
    complete connection strings to ordinary users.
-   Avoid aggressive polling. Use manual refresh and a conservative
    refresh interval if automatic refresh is implemented.
-   Show "Unknown" or "Not measured" when a metric is unavailable; never
    fabricate a value.

### Connection pool metrics

Show active, idle, maximum or utilization metrics only if the actual
driver/provider exposes them reliably. Do not infer pool counts from
latency or generic health-check results. Explain when metrics are
unavailable.

Do not provide unrestricted SQL execution in the browser.

## 6. Worker and application monitoring

Use existing worker and queue implementations. Display only real,
supported metrics:

-   Worker status and last heartbeat
-   Pending/running/failed jobs
-   Last successful job
-   Queue health
-   Application health
-   API health
-   Background-task health
-   Sanitized recent errors

Do not add Start/Stop controls unless the existing architecture safely
supports those operations and authorization is enforced. Do not
introduce destructive job controls without confirmation and audit
logging.

## 7. Security and compliance

Enhance the existing controls while preserving human approval
requirements:

-   Suppression list management
-   Outreach policy settings
-   Consent/permission requirements
-   Manual approval controls
-   Email/WhatsApp outreach restrictions
-   Role-based access
-   Session/security settings, if already supported
-   Audit trail

Do not enable automated bulk outreach or bypass consent, suppression or
provider restrictions.

## 8. Notifications and alerts

Where supported, allow configuration of:

-   Database connection failure alerts
-   Connector failure alerts
-   Worker/queue failure alerts
-   Application error alerts
-   Usage/quota threshold alerts

Clearly identify delivery channel, recipient scope, enabled state and
last delivery result. Do not claim alerts are active until delivery
configuration has been validated.

## 9. Configuration audit history

Record important non-secret configuration changes:

-   Setting identifier/name
-   Previous non-secret value
-   New non-secret value
-   Actor/user
-   Workspace
-   Timestamp
-   Result

Never store passwords, API keys, tokens, complete connection strings or
encryption keys in audit records. Redact sensitive values before
logging. Enforce workspace isolation.

## 10. Backend, APIs and validation

Follow existing project conventions and reuse existing libraries.

-   Reuse the existing Drizzle client.
-   Reuse existing validation libraries (use Zod only if already adopted
    or justified).
-   Reuse authentication, authorization and workspace scoping.
-   Validate all input server-side.
-   Enforce role permissions for read and write operations.
-   Use parameterized queries.
-   Add pagination for histories and logs.
-   Apply rate limits to connection tests and expensive diagnostics.
-   Use structured error responses.
-   Do not expose internal infrastructure details to unauthorized users.
-   Keep secrets server-side.

## 11. UX and accessibility

Every section must have:

-   Clear heading and concise description
-   Current status
-   Explicit edit/action controls
-   Loading state
-   Empty state
-   Error state
-   Success feedback
-   Confirmation for sensitive changes
-   Keyboard-accessible controls and labels
-   Responsive layout

Do not use decorative status badges as substitutes for real health
checks. Show timestamps and distinguish current status from last-known
status.

## 12. Testing

Add or update tests for:

1.  Agency profile editing and persistence
2.  Branding configuration
3.  Validation failures
4.  Connector configuration
5.  Missing/invalid provider credentials
6.  Connector connection tests
7.  Pooled database health check
8.  Direct database configuration detection
9.  Database timeout and recovery
10. Sanitized error responses
11. Worker unavailable state
12. Workspace isolation
13. Unauthorized read/write operations
14. Secret redaction in logs and audit history
15. Audit history pagination
16. Mobile/responsive layout
17. Regression of existing Settings features

Use mock data only in tests or explicitly labelled development previews.
Production status must come from real checks.

## 13. Documentation

Update project documentation with:

-   Settings architecture and navigation
-   Data ownership and persistence model
-   Database health-check design
-   API/action contracts
-   Environment variable requirements
-   Secret handling and access control
-   Connector verification behaviour
-   Audit history
-   Test results
-   Deployment and rollback instructions

## Execution and safety rules

-   Inspect before modifying.
-   Preserve all existing working features.
-   Do not replace the architecture without a documented reason.
-   Prefer the existing Neon, Drizzle and Vercel stack.
-   Do not introduce unnecessary paid services.
-   Never expose credentials.
-   Do not commit `.env` files or secrets.
-   Do not execute destructive database operations.
-   Do not run production migrations or deploy production changes
    without explicit approval.
-   Routine implementation, local tests and documentation can proceed
    without repeatedly asking for approval.
-   If a change requires a new migration, create and review it; do not
    apply it to production without approval.
-   Report completed work, pending work, blockers, files changed and
    test results.

## Expected outcome

A working LeadPulse Settings & Operator Console where an authorized
operator can edit agency information, manage integrations, inspect
actual database connectivity, monitor supported worker/application
health, manage compliance and review configuration changes.
