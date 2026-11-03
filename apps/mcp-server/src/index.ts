import { McpServer } from '@modelcontextprotocol/server'
import { createMcpHandler } from 'agents/mcp/server'
import { z } from 'zod'
import { recommendSeverity, SEVERITY } from '@escalate-my/shared'
import { first60Checklist, createHoldingStatement } from '@escalate-my/incidents'
import { listRegulatoryClocks } from '@escalate-my/regulatory'

function createServer() {
  const server = new McpServer({ name: 'escalate-my', version: '0.1.0' })

  server.tool('recommend_severity', 'Recommend L1–L4 severity from incident facts (MY listed-company context).', {
    facts: z.string(),
    mediaAttention: z.boolean().optional(),
    possibleMaterialInfo: z.boolean().optional(),
    regulatoryInvolved: z.boolean().optional(),
  }, async (input) => {
    const level = recommendSeverity(input)
    const profile = SEVERITY[level]
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ level, profile, disclaimer: 'Operational guidance — not legal advice.' }, null, 2),
      }],
    }
  })

  server.tool('first_60_checklist', 'Return Escalate MY First Sixty Minutes checklist (13 steps).', {}, async () => ({
    content: [{ type: 'text' as const, text: JSON.stringify(first60Checklist(), null, 2) }],
  }))

  server.tool('list_regulatory_clocks', 'List Malaysia regulatory clocks (Bursa, PDPA, DOSH, NACSA, SC, BNM).', {}, async () => ({
    content: [{ type: 'text' as const, text: JSON.stringify(listRegulatoryClocks(), null, 2) }],
  }))

  server.tool('create_holding_statement', 'Create EN/BM holding statement outline from scenario template.', {
    scenario: z.string(),
    company: z.string(),
    issue: z.string(),
    lang: z.enum(['en', 'bm', 'both']).optional(),
  }, async (input) => ({
    content: [{
      type: 'text' as const,
      text: JSON.stringify(createHoldingStatement({
        scenario: input.scenario,
        company: input.company,
        issue: input.issue,
        lang: input.lang || 'both',
      }), null, 2),
    }],
  }))

  server.tool('create_incident', 'Create incident via API (requires API_BASE + organisation_id).', {
    organisation_id: z.string(),
    title: z.string(),
    scenario: z.string().optional(),
    owner: z.string().optional(),
  }, async (input, extra) => {
    const base = (extra as any)?.env?.API_BASE || ''
    if (!base) {
      return { content: [{ type: 'text' as const, text: 'API_BASE not configured on MCP worker. Use local tools or set API_BASE.' }] }
    }
    const res = await fetch(`${base.replace(/\/$/, '')}/api/v1/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.text()
    return { content: [{ type: 'text' as const, text: json }] }
  })

  server.tool('get_incident', 'Fetch incident by id via API.', {
    id: z.string(),
  }, async (input, extra) => {
    const base = (extra as any)?.env?.API_BASE || ''
    if (!base) return { content: [{ type: 'text' as const, text: 'API_BASE not configured' }] }
    const res = await fetch(`${base.replace(/\/$/, '')}/api/v1/incidents/${encodeURIComponent(input.id)}`)
    return { content: [{ type: 'text' as const, text: await res.text() }] }
  })

  server.tool('list_active_incidents', 'List active incidents for organisation via API.', {
    organisation_id: z.string(),
  }, async (input, extra) => {
    const base = (extra as any)?.env?.API_BASE || ''
    if (!base) return { content: [{ type: 'text' as const, text: 'API_BASE not configured' }] }
    const res = await fetch(`${base.replace(/\/$/, '')}/api/v1/incidents?organisation_id=${encodeURIComponent(input.organisation_id)}`)
    return { content: [{ type: 'text' as const, text: await res.text() }] }
  })

  server.tool('close_incident', 'Close incident via API.', {
    id: z.string(),
    actor: z.string().optional(),
  }, async (input, extra) => {
    const base = (extra as any)?.env?.API_BASE || ''
    if (!base) return { content: [{ type: 'text' as const, text: 'API_BASE not configured' }] }
    const res = await fetch(`${base.replace(/\/$/, '')}/api/v1/incidents/${encodeURIComponent(input.id)}/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: input.actor }),
    })
    return { content: [{ type: 'text' as const, text: await res.text() }] }
  })

  server.tool('generate_board_brief', 'Generate BoardBrief markdown and store in R2 via API.', {
    incident_id: z.string(),
    kind: z.enum(['situation_report', 'board_update', 'ceo_brief', 'chairman_brief', 'post_incident_review']).optional(),
  }, async (input, extra) => {
    const base = (extra as any)?.env?.API_BASE || ''
    if (!base) return { content: [{ type: 'text' as const, text: 'API_BASE not configured' }] }
    const res = await fetch(`${base.replace(/\/$/, '')}/api/v1/reports/board-brief`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    return { content: [{ type: 'text' as const, text: await res.text() }] }
  })

  return server
}

const handler = createMcpHandler(createServer)

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(request.url)
    if (url.pathname === '/mcp' || url.pathname === '/') return handler(request, env, ctx)
    return new Response(JSON.stringify({ name: 'escalate-my-mcp', mcp: '/mcp' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
