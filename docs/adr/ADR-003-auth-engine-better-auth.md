# ADR-003: Authentication Engine Selection (Better Auth)

- **Status:** Approved (Phase 0)
- **Date:** 2026-11-07
- **Deciders:** Lead Architecture Review Board

## Context
LeadPulse requires an authentication and session management framework that:
1. Supports multi-tenant workspace scoping (isolating the founder's workspace from any future team members or client accounts).
2. Integrates natively with Drizzle ORM and PostgreSQL on Neon.
3. Operates reliably on both Node.js runtimes and Edge/Cloudflare runtimes without breaking on crypto or session cookie handling.
4. Allows secure one-time initial admin bootstrapping via CLI.

## Evaluation
- **NextAuth / Auth.js (v5):** Ongoing breaking changes, complex edge cookie synchronization, and less transparent schema control.
- **Custom Session / JWT:** Requires reinventing password hashing, session rotation, CSRF protection, and rate limiting.
- **Better Auth:** Native TypeScript support, official Drizzle adapter, zero-dependency core, explicit cookie session management, full edge compatibility, and built-in workspace/organization plugins.

## Decision
Adopt **Better Auth** with the official Drizzle adapter as the core authentication framework for `leadpulse-core`.

## Consequences
- Clean database migrations managed directly by Drizzle.
- Fast, secure cookie-based session verification in Next.js Server Components and Server Actions.
- Seamless compatibility across local development, Vercel, and Cloudflare environments.
