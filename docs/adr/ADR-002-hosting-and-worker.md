# ADR-002: Hosting Portability and Worker Execution Boundary

- **Status:** Approved (Phase 0)
- **Date:** 2026-11-07
- **Deciders:** Lead Architecture Review Board

## Context
The solo founder requires minimal initial operating costs while preparing for commercial production. 
- Vercel Hobby strictly prohibits commercial usage in its Terms of Service.
- Cloudflare Workers is cost-efficient, but its Next.js deployment adapter (`vinext`) is in beta.
- Playwright and Lighthouse require substantial CPU and memory (Chromium browser runtime) and cannot execute reliably inside serverless edge request handlers.

## Decision
1. **Hosting Portability Boundary:** Design Next.js web application (`apps/web`) to be deployment-agnostic:
   - For pilot/production, target Vercel Commercial or Cloudflare Workers (subject to passing `vinext` compatibility test suite).
2. **Worker Separation:** Never run browser-based audits inside serverless HTTP route handlers.
   - Run `apps/worker` as an independent Node.js process.
   - For the zero-cost pilot, the founder runs the worker locally on their development machine (WSL2 / Windows) connected to Neon PostgreSQL. When offline, jobs remain safely enqueued in Postgres (`status = 'PENDING'`).
   - In production, the worker can be deployed to a low-cost virtual machine ($4-5/mo) or container service without touching web application code.

## Consequences
- Zero cloud compute cost during the initial discovery and testing phase.
- No risk of serverless execution timeouts or memory limits during heavy browser audits.
- Full compliance with hosting provider Terms of Service.
