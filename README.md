# Escalate MY™

**Crisis Command Centre for Malaysian Organisations**

Not a PR platform. Not media monitoring. Not social listening.

## Stack

- **Pages** → Web UI (`apps/web`)
- **Workers + Hono** → API (`apps/api`)
- **D1** → System of record
- **KV** → Config cache
- **R2** → BoardBrief exports
- **MCP** → AI agents (`apps/mcp-server`)

## Monorepo

```text
apps/web | api | mcp-server
packages/shared | core | incidents | regulatory | boardbrief
infrastructure/migrations | wrangler
docs/
tests/api | mcp | integration
```

## Editions

Starter · Professional · Enterprise · PLC Edition

## Quick start

```bash
pnpm install
pnpm db:migrate:local
pnpm dev:api
```

See `docs/ARCHITECTURE.md`.
