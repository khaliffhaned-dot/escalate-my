# Deploy Escalate MY API

## Prerequisites

```powershell
cd C:\Users\Mkhal\escalate-my
git pull
pnpm install
npx wrangler login
```

## 1. Check migrations are visible

```powershell
pnpm db:list
```

You should see `0001_init.sql` and `0002_regulatory_obligations.sql`.

If list is empty, confirm folder `infrastructure\migrations` exists after `git pull`.

## 2. Apply migrations (remote D1)

```powershell
pnpm db:migrate:remote
```

## 3. Verify tables

```powershell
pnpm db:tables
```

Expect: organisations, users, incidents, incident_updates, tasks, quorum_responses, reports, audit_log, regulatory_obligations, d1_migrations

## 4. Deploy API

```powershell
pnpm deploy:api
```

Copy the published URL, e.g. `https://escalate-my-api.<account>.workers.dev`

## 5. Smoke test

```powershell
curl https://escalate-my-api.<account>.workers.dev/health

curl -X POST https://escalate-my-api.<account>.workers.dev/api/v1/intelligence/assess `
  -H "content-type: application/json" `
  -d "{\"facts\":\"Product recall, three customers, no national media\",\"bursaListed\":true}"
```

## 6. Wire UI (Cloudflare Pages)

Set environment variable on the Pages project (crisis-comms-my):

```text
VITE_API_BASE=https://escalate-my-api.<account>.workers.dev
```

Redeploy Pages.

## Troubleshooting

### "No migrations to apply" but tables missing

```powershell
pnpm db:list
pnpm db:tables
```

If tables are empty and list shows migrations as not applied, run `pnpm db:migrate:remote` again from repo root (uses `wrangler.jsonc` at root).

### Static assets error

Do not run bare `wrangler pages deploy` without a dist folder. API deploy is:

```powershell
pnpm deploy:api
```

or

```powershell
npx wrangler deploy --config wrangler.jsonc
```
