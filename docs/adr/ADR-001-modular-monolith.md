# ADR-001: Domain-Driven Modular Monolith Architecture

- **Status:** Approved (Phase 0)
- **Date:** 2026-11-07
- **Deciders:** Lead Architecture Review Board

## Context
LeadPulse AI is operated by a solo founder who manages marketing, discovery, intelligence, auditing, outreach, CRM, and client delivery. Introducing distributed microservices at this stage would create severe operational overhead (distributed transactions, multi-repo CI/CD, network latency, multiple container deployments).

## Decision
Build LeadPulse AI as a **Domain-Driven Modular Monolith** using Hexagonal Architecture (ports & adapters) within an npm-managed monorepo:
- `apps/web`: Next.js App Router for public marketing and private operator dashboard.
- `apps/worker`: Node.js long-running process for website audits, Lighthouse diagnostics, and scheduled tasks.
- `packages/domain`: Pure entities, value objects, and business invariants without external framework dependencies.
- `packages/application`: Use cases, commands, queries, and event handlers.
- `packages/contracts`: Zod schemas, API DTOs, job payloads.
- `packages/infrastructure`: Drizzle ORM, Neon PostgreSQL client adapters, external connector implementations, Playwright audit adapters.
- `packages/ui`: Shared design tokens and Tailwind/Radix UI components.

## Consequences
- Single cohesive database with ACID transactional consistency.
- High velocity for solo-founder feature development.
- Strong domain boundary enforcement via strict TypeScript module path aliases.
- Decoupled worker process can be scaled or deployed independently without touching web request handlers.
