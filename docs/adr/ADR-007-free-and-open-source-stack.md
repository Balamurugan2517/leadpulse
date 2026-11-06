# ADR-007: 100% Free and Open-Source Software (FOSS) Mandate

- **Status:** Approved (Phase 0)
- **Date:** 2026-11-07
- **Deciders:** Lead Architecture Review Board & Solo Founder

## Context
The founder explicitly mandates that LeadPulse AI must operate entirely using **free and open-source tools (FOSS)** with **zero required paid subscriptions, zero mandatory paid APIs, and zero SaaS lock-in**.

## Decision
Every component in the architecture is strictly selected from open-source technologies and free-tier/local-first tools:

| Domain | Selected Free & Open-Source Tool | License / Cost | Why Selected |
|---|---|---|---|
| **Runtime & Language** | Node.js + TypeScript | MIT / Apache-2.0 (Free) | Industry standard, fast execution, rich ecosystem. |
| **Web Framework** | Next.js (App Router) + React | MIT (Free) | Production-grade full-stack framework with zero license costs. |
| **Styling & Components** | Tailwind CSS + shadcn/ui + Lucide | MIT / ISC (Free) | Open-source UI components; copy-paste into codebase with no recurring fees. |
| **Database & ORM** | PostgreSQL + Drizzle ORM | PostgreSQL / Apache-2.0 (Free) | Open-source relational DB; runs on Neon Free tier or 100% locally on Docker/bare metal. |
| **Authentication** | Better Auth | MIT / Apache-2.0 (Free) | Completely self-hosted; replaces paid auth providers (Clerk, Auth0). |
| **Background Queue** | Native PostgreSQL `SKIP LOCKED` | PostgreSQL native (Free) | Replaces paid cloud Redis (Upstash, AWS ElastiCache); zero extra infrastructure. |
| **Website Auditing** | Playwright + Chromium + Lighthouse | Apache-2.0 / BSD (Free) | Open-source lab auditing running locally in the worker; replaces paid PageSpeed/SEMrush APIs. |
| **Primary Discovery** | OpenStreetMap (Overpass) + RSS + Web Capture | ODbL / Open Data (Free) | Free public business search and intent ingestion without commercial data purchase. |
| **Lead Capture** | Assisted Browser Bookmarklet | Native JavaScript (Free) | Capture any public business page in 1-click while browsing; zero paid scraper tools. |
| **Outreach Engine** | WhatsApp `wa.me` Deep-Link + `mailto:` / SMTP | RFC Standards (Free) | Uses your existing WhatsApp and email client; zero Meta API fees or email service fees. |
| **Content Generation** | Rule-Based Template Engine + Optional Local Ollama | MIT / FOSS (Free) | Generates tailored messages without requiring paid OpenAI or Claude subscriptions. |

## Consequences
- **Total Operating Cost: $0.00 / month.**
- The system is completely self-contained, self-hostable, and immune to third-party vendor price hikes or API shutdowns.
- No credit card is required to discover leads, run audits, draft messages, or track sales deals.
