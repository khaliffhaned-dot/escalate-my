# Architecture

## Product

Escalate MY™ — Crisis Command Centre for Malaysian Organisations.

## Modules

Command Centre · Incident Management · Severity Engine · First Sixty Minutes · Decision Quorum · Regulatory Clock · Holding Statement Builder · BoardBrief · Audit Trail

## Data flow

```text
MCP / Web → Workers (Hono) → D1
                          → KV (config)
                          → R2 (BoardBrief)
```

## API

`/api/v1/incidents` · `/tasks` · `/quorum` · `/regulatory` · `/reports` · `/holding-statements` · `/audit`
