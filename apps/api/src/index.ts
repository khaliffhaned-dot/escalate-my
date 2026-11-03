import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from '@escalate-my/shared'
import { AppError } from '@escalate-my/shared'
import { IncidentService } from '@escalate-my/incidents'
import { listRegulatoryClocks } from '@escalate-my/regulatory'
import { generateAndStoreBrief } from '@escalate-my/boardbrief'

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())

app.get('/health', (c) => c.json({ ok: true, service: 'escalate-my-api' }))

app.get('/api/v1/regulatory/clocks', (c) => c.json({ clocks: listRegulatoryClocks() }))

app.get('/api/v1/incidents', async (c) => {
  const org = c.req.query('organisation_id')
  if (!org) return c.json({ error: 'organisation_id required' }, 400)
  const svc = new IncidentService(c.env)
  const items = await svc.listActive(org)
  return c.json({ items })
})

app.get('/api/v1/incidents/:id', async (c) => {
  const svc = new IncidentService(c.env)
  const item = await svc.get(c.req.param('id'))
  return c.json({ item })
})

app.post('/api/v1/incidents', async (c) => {
  const body = await c.req.json<{ organisation_id: string; title: string; scenario?: string; owner?: string; actor?: string }>()
  if (!body.organisation_id || !body.title) return c.json({ error: 'organisation_id and title required' }, 400)
  const svc = new IncidentService(c.env)
  const item = await svc.create(body)
  return c.json({ item }, 201)
})

app.post('/api/v1/incidents/:id/close', async (c) => {
  const body = await c.req.json<{ actor?: string }>().catch(() => ({}))
  const svc = new IncidentService(c.env)
  const item = await svc.close(c.req.param('id'), body.actor)
  return c.json({ item })
})

app.post('/api/v1/severity/recommend', async (c) => {
  const body = await c.req.json()
  const svc = new IncidentService(c.env)
  return c.json(svc.recommend(body))
})

app.get('/api/v1/first60', (c) => {
  const svc = new IncidentService(c.env)
  return c.json({ steps: svc.first60() })
})

app.post('/api/v1/holding-statements', async (c) => {
  const body = await c.req.json<{
    scenario: string
    company: string
    issue: string
    lang?: 'en' | 'bm' | 'both'
  }>()
  const svc = new IncidentService(c.env)
  return c.json(
    svc.holding({
      scenario: body.scenario || 'operational',
      company: body.company || 'Company',
      issue: body.issue || '[issue]',
      lang: body.lang || 'both',
    })
  )
})

app.post('/api/v1/reports/board-brief', async (c) => {
  const body = await c.req.json<{ incident_id: string; kind?: string; actor?: string }>()
  if (!body.incident_id) return c.json({ error: 'incident_id required' }, 400)
  const svc = new IncidentService(c.env)
  const incident = await svc.get(body.incident_id)
  const kind = (body.kind as any) || 'situation_report'
  const result = await generateAndStoreBrief(c.env, incident, kind, body.actor)
  return c.json(result, 201)
})

app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message, code: err.code }, err.status as any)
  }
  console.error(err)
  return c.json({ error: 'Internal error' }, 500)
})

export default app
