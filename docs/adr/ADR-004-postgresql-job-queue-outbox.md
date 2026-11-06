# ADR-004: Durable PostgreSQL-Backed Job Queue and Transactional Outbox

- **Status:** Approved (Phase 0)
- **Date:** 2026-11-07
- **Deciders:** Lead Architecture Review Board

## Context
Background tasks (website auditing, Lighthouse testing, OpenStreetMap discovery queries, message draft generation) require durable queuing, retry logic, concurrency control, and dead-letter handling. Traditional queue systems (BullMQ, Celery) require Redis, introducing an extra cloud dependency and recurring hosting costs that violate the zero-cost pilot objective.

## Decision
Implement a native **PostgreSQL-backed job queue** and **Transactional Outbox** pattern directly within Neon PostgreSQL:
1. **Schema:** `jobs_queue` table with columns: `id`, `workspace_id`, `task_type`, `payload (JSONB)`, `status ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`, `scheduled_for`, `retry_count`, `max_retries`, `locked_at`, `locked_by`.
2. **Concurrency & Locking:** Use Postgres standard `SELECT ... FOR UPDATE SKIP LOCKED LIMIT 1` inside an ACID transaction to claim jobs without race conditions across multiple worker threads.
3. **Outbox Pattern:** When a domain action creates a lead that requires an audit, the business record and the audit job are inserted in the *same* database transaction, eliminating state drift.

## Consequences
- Zero additional infrastructure or hosting cost (runs on existing Neon Postgres).
- Full durability: if the local worker is paused or restarted, no pending jobs are lost.
- ACID guarantees between business state changes and job scheduling.
