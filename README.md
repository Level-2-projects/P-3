# BloodNet

A web platform that connects **donors**, **blood centers** and **hospitals** around a single unit of blood: where to donate, how a unit is collected, tested and released, and how a hospital requests, compares offers and confirms receipt.

> **Honest scope.** BloodNet is a university MVP built on **synthetic data**. It is **not cleared for clinical use** and does not claim compliance with any medical or international standard (ISBT 128, WHO guidance, ISO 15189, or any national standard). The design is guided by them. All medical values are configuration with a verification status, and the values from the team's own sources are marked `unverified`. The app always runs with `USAGE_MODE=demo` and shows a permanent banner: *"Demo mode. Synthetic data. Rules not approved."*

## What it does

| Group | What they do in BloodNet |
|---|---|
| **Donors** (public, no account) | Find the nearest center, read approved information, ask the chatbot |
| **Blood centers** | Register donors, record consents and measurements, collect, test and release units, manage stock, answer hospital requests, issue and dispatch |
| **Hospitals** | Request blood, compare offers, approve one, confirm receipt per unit |

Paper stays the legal record. The system pre-fills and prints the request and receipt forms, tracks that the signed form arrived, and refuses to issue blood without it.

**The MVP is complete when this path runs end to end on staging with synthetic data:**
donor visit → collection → tests → physician approval and release → hospital request → one unit reserved without duplication → patient sample, typing, crossmatch → issue and dispatch → receipt confirmed. The negative tests must pass too: forbidden transitions, forbidden roles, tenant isolation at the API, append-only history, and the audit trail.

## Architecture at a glance

A **modular monolith** with one database that enforces the critical safety rules. Full details are in [`docs/architecture.md`](docs/architecture.md) (the SAD, v1.1).

| Container | Tech | Responsibility |
|---|---|---|
| `nginx` | Nginx | TLS, path routing, request size and rate limits, security headers |
| `web` | Next.js, Tailwind, shadcn/ui | All screens, including the chat panel. No business rules, no database access |
| `api` | Node.js LTS, Express 5, TypeScript (strict) | Business logic, authorization, validation, audit |
| `worker` | Same image as `api` | Scheduled jobs: expiry, routing rounds, hold timeouts, notifications |
| `chatbot` | Python, FastAPI | Answers from published content. Role-based **read-only** assistants. Never writes |
| `db` | PostgreSQL 16 | System of record. Enforces the unit state machine, the release gate, one active reservation per unit, append-only history |

No Redis and no message broker in the MVP. Email (SMTP) is the only required external system.

### Safety rules the code must keep

- A unit's status changes **only** through `transition_unit()` in the database. The app role cannot update it directly.
- No unit is released without the release gate (G1 to G9): complete tests, an independent review, and a physician approval.
- A unit has at most one active reservation. Among 20 simultaneous reservations of one unit, exactly one wins.
- History tables (audit, unit events, lab results) are append-only.
- Tenant isolation is enforced in the API and proven by tests. Row-Level Security is **not** implemented in the MVP.
- Identifiers (national ID, name, address, phone) are encrypted per field and never appear in URLs, logs, errors or notifications.
- The chatbot **cannot change data**. Its calls carry `X-Channel: chatbot`, and the API accepts only an allow-list of GET endpoints from that channel. An Action Card in the chat only opens a screen. Nothing is saved until the user does it there.
- Separation of duties is a constraint, not a policy text: reviewer ≠ performer, policy approver ≠ author, content reviewer ≠ author.

## Environments

Two independent settings. Medical approval is never tied to `NODE_ENV`.

| Setting | Values | Meaning |
|---|---|---|
| `APP_ENV` | `development`, `staging`, `production` | Technical environment |
| `USAGE_MODE` | `demo`, `clinical` | Synthetic data or real data |

The MVP always runs `USAGE_MODE=demo`, including on a staging build deployed with production-like settings. The application **refuses to start** in `clinical` mode while any active policy parameter is not approved.

| Environment | `APP_ENV` | `USAGE_MODE` | Data |
|---|---|---|---|
| Local development | `development` | `demo` | Seed script |
| Staging | `staging` | `demo` | Seed plus demo scenario data |
| Demo host | `production` | `demo` | Seed only. Banner always on |

## Repository layout

```
repo/
├── apps/
│   ├── api/        Node.js + TypeScript API (modules, jobs, core)
│   ├── web/        Next.js UI (public and staff route groups, assistant panel)
│   └── chatbot/    FastAPI, read-only assistants (pipeline, role tools, cards)
├── packages/
│   └── shared/     Zod schemas, enums, API types, error codes, card schema
├── db/
│   ├── migrations/ plain SQL, forward-only, numbered by merge order
│   ├── functions/  transition_unit, unit_release_ready, registry helpers
│   └── seed/       policy seed, synthetic data (demo only)
├── docs/           architecture.md, requirements.md, standards-register.md, adr/, runbook.md
├── docker-compose.yml
├── docker-compose.prod.yml
└── .github/workflows/
```

The exact layout, with one line per folder, is in section 5.4 of the SAD.

## Getting started

**Prerequisites:** Docker with Compose. For work outside containers, use the Node.js version pinned in `.nvmrc`.

```bash
git clone <repo-url>
cd <repo>

cp .env.example .env     # fill in the secrets. Never commit .env
docker compose up --build
```

Open the address that nginx exposes in `docker-compose.yml`. Demo accounts come from the seed script in `db/seed/`, and every seed record is synthetic.

Key configuration (all validated at startup, a missing or invalid value fails fast):

| Variable | Purpose |
|---|---|
| `APP_ENV`, `USAGE_MODE` | See *Environments*. Keep `USAGE_MODE=demo` |
| `DATA_ENC_KEY` | Field-level encryption key (AES-256-GCM). Kept outside the database and its backups |
| `ID_INDEX_KEY` | HMAC key for the searchable identifier index. Kept separate from `DATA_ENC_KEY` |

Only `.env.example` is committed. Secrets are kept in Docker secrets or an `.env` file outside the repository.

## Testing and CI

Each story ships with its own tests. Week 9 is for integration and hardening, not for writing the first tests.

| Level | Covers | Tools |
|---|---|---|
| Unit | Rule evaluator, validators, transition table equality, form rendering | Vitest |
| Integration (real PostgreSQL) | `transition_unit`, release gate, reservation concurrency, append-only, jobs, idempotency | Vitest, Testcontainers |
| API | Role and scope for every endpoint, error codes | Supertest |
| Assistant evaluation | Fixed question, slot, guard and role sets for the chatbot | pytest |
| End to end (few) | The main MVP path | Playwright (optional) |
| Performance | Stock page, unit lookup, new request fan-out | Locust |
| Security | Dependency scan, secrets scan, basic OWASP checks | `npm audit`, `pip-audit`, gitleaks |

The mandatory tests (T-01 to T-25) are listed in section 13.2 of the SAD.

CI pipeline: `lint` → `typecheck` → unit → integration (PostgreSQL) → API → assistant evaluation → build images → (on `main`) deploy to staging → smoke tests. Boundary lint and the seed-data check are part of `lint`.

Releases: a merge to `main` deploys staging. A version tag deploys the demo host after approval. Rollback is a redeploy of the previous image tag.

## Contributing

- **Layering.** Inside a module: `routes → service → repo`. The repo contains SQL only.
- **Module boundaries.** A module never imports another module's repo. It calls the other module's exported service. The boundary lint in CI enforces this.
- **Database access.** Everything goes through `withTx(ctx, fn)`. No `pool.query` outside `core/db`.
- **Tenant scope.** Every repo function takes a `Scope` and filters by it. Unscoped queries are lint-banned.
- **Migrations.** One concern per migration, forward-only, numbered by merge order. Parallel branches rebase and renumber before merge. One person owns the final review of `db/` changes.
- **Reviews.** Every module has one owner and a different reviewer (SAD Appendix C). Anything that touches permissions or SQL gets a second reviewer.
- **Strings and RTL.** All Arabic strings live in `messages/ar.json`. No literals in components. The UI is right to left.
- **Scope changes.** Every addition removes something of equal size. Never cut the release gate, the review steps, the physician approval, or the chatbot channel guard.

## Documentation

| Document | What it is |
|---|---|
| [`docs/architecture.md`](docs/architecture.md) | The Software Architecture Document (SAD v1.1): drivers, containers, data model, lifecycles and invariants, workflows, API, security, UX, quality, operations, decisions (ADRs), risks |
| `docs/requirements.md` | The Must stories, the Must NFRs and the MVP scope |
| `docs/standards-register.md` | Sources for the medical values and their verification status |
| `docs/adr/` | Architecture decision records |
| `docs/runbook.md` | Deploy, rollback, backup, restore, rotate keys, add a center, reset a lockout, handle a failed job |

User stories and epics are tracked as GitHub issues (an epic issue with its stories as sub-issues).

## Team
P-3 
A three-person team working in a 12-week plan. Module ownership and reviewers (A, B, C) are in Appendix C of the SAD.

| Role | Name |
|---|---|
| A |Islam Yasser|
| B |Hazem Gamal |
| C |Ziad Mohamed|



_To be decided by the team._
