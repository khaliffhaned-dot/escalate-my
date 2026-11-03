# Crisis Intelligence Layer

Escalate MY earns **Crisis Intelligence Platform** by recommending and enriching decisions — not by monitoring media.

## Do not build

- Media monitoring platform
- Social listening tool
- Meltwater / Brandwatch clone

## Current vs target flow

```text
Current:  Incident → Playbook → Response

Target:   Incident → Risk Assessment → Decision Support
            → Recommended Actions → Board Brief
```

That pipeline is intelligence.

---

## Three modules to add (only)

### 1. Decision Intelligence™

**Purpose:** What should leadership do next?

**Stack:** Workers AI + incident context (severity, industry, regulatory flags, stakeholder impact)

**Output example:**

```json
{
  "severity": "L2",
  "confidence": 92,
  "regulatory_risk": "Medium",
  "first_actions": [
    "Activate legal review",
    "Prepare holding statement",
    "Notify operations"
  ]
}
```

Recommendations only — **never auto-release** statements or filings.

---

### 2. Regulatory Intelligence™

**Purpose:** Match incident → obligations (Bursa, PDPA, DOSH, NACSA, SC, BNM).

**Stack:** D1 table `regulatory_obligations` + rules engine (+ optional Workers AI for narrative)

**Flow:**

```text
Incident → Match regulations → Show obligations → “Potential Bursa disclosure — review required”
```

Still counsel-verified tags: Verified / Practice / Calibrate.

---

### 3. Board Intelligence™

**Purpose:** Upgrade BoardBrief from “generate report” to **generate insights**.

**Outputs:**

- Top risks
- Pending decisions
- Regulatory exposure
- Recommended board actions

**Stack:** existing BoardBrief + R2 + Workers AI summary over incident + quorum + clocks + audit.

---

## Optional later (not required for the name)

| Module | Idea |
|--------|------|
| Similar Incident Intelligence™ | D1 history + similarity score |
| Operational Readiness Score™ | 0–100 from tasks, quorum, clocks |
| Scenario Intelligence™ | “What if national media?” simulation |

---

## Workers AI pattern (incident assess)

**Input:** free-text facts + listed company flag + media/regulatory hints  
**Output:** severity, confidence, regulatory_risk, first_actions[]  
**Hard rule:** human clearance (Decision Quorum) before any external action.

---

## Positioning (earned)

> **Escalate MY™**  
> Crisis Intelligence Platform for Malaysian Organisations

Because the platform:

- Assesses risk
- Recommends actions
- Maps regulatory obligations
- Supports decisions
- Generates board insights

**Not** because it listens to social media.

---

## Stack

```text
Workers AI  → recommendations & narrative insights
D1          → incidents, obligations, history
KV          → config / feature flags
R2          → BoardBrief exports
MCP         → agent access to the same tools
```
