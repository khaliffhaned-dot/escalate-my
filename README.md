# Escalate MY™

**Crisis Intelligence Platform for Malaysian Organisations**

> From uncertainty to action in the moments that matter most.

The First Hour Decides Everything.

Escalate MY helps organisations assess incidents, coordinate decision-makers, manage regulatory obligations and execute crisis response through a single intelligent operating environment.

Built for listed companies, government-linked organisations, regulated industries and enterprise leadership teams.

**Not** a PR platform · communications tool · media monitor · social listening product.

---

## Stack

```text
Pages → Web Platform
Workers + Hono → Crisis Intelligence API
D1 → System of Record
KV → Configuration
R2 → BoardBrief exports
MCP → AI-powered crisis workflows
```

## Monorepo

```text
apps/web | api | mcp-server
packages/shared | core | incidents | regulatory | boardbrief
infrastructure/migrations | wrangler
docs/
tests/api | mcp | integration
```

## Modules

Command Centre™ · Incident Management™ · First Sixty Minutes™ · Severity Engine™ · Decision Quorum™ · Regulatory Clock™ · Holding Statement Builder™ · BoardBrief™ · Audit Trail™

## Editions

Starter · Professional · Enterprise · PLC Edition

## Docs

- [Positioning](docs/POSITIONING.md)
- [Modules](docs/MODULES.md)
- [Audience](docs/AUDIENCE.md)
- [Architecture](docs/ARCHITECTURE.md)

## Quick start

```bash
pnpm install
# set real D1/KV/R2 IDs in infrastructure/wrangler/wrangler.jsonc
pnpm db:migrate:local
pnpm dev:api
```
