# Portfolio Update System

This portfolio has a **stable core** and a **small dynamic layer**. The goal is to keep it current without turning it into a personal diary or a constantly changing personal-brand experiment.

## What may change dynamically

Only these public, professional fields belong in `data/portfolio-state.json`:

- `current.focus` — the technical area currently receiving sustained depth
- `current.question` — one concrete technical/research question
- `current.milestone` — one meaningful public milestone
- `last_updated` — ISO date (`YYYY-MM-DD`)

Examples of acceptable milestones:
- paper accepted/published
- substantial open-source release
- public talk or technical presentation
- significant project release
- major role/scope change that is already public

Do **not** use the state file for:
- daily activity
- exercise/routines
- travel diary updates
- family or relationships
- health
- compensation or negotiations
- private employer/customer information
- unfinished claims or confidential work
- every course, paper, LeetCode problem, or small GitHub commit

Rule: **If the update helps a stranger understand technical direction, evidence of work, or public creative/professional identity, it may belong. If it merely tells them what happened in private life, it does not.**

## Update threshold

Before changing the portfolio, ask:

1. Does this change the public story materially?
2. Is it already safe and appropriate to make public?
3. Is there evidence behind the claim?
4. Will it still matter in 3–6 months?
5. Does it replace older information rather than merely add noise?

If fewer than 4 answers are yes, do not update the portfolio.

## Seasonal layer

`data/seasonal.json` contains explicit, date-bounded occasions.

Seasonal treatments are deliberately constrained:
- one short greeting
- temporary accent-color changes
- no layout replacement
- no religious/political claims on behalf of visitors
- no automatic external-calendar ingestion
- no permanent copy changes

Allowed theme names are hard-coded in `script.js`; the JSON cannot inject arbitrary CSS or HTML.

For movable festivals, add the exact date window for that year after verifying the date. Do not encode guessed recurring dates.

## Safety and rendering guardrails

The browser code:
- accepts only an allowlist of state fields
- enforces length limits
- inserts dynamic copy via `textContent`, never `innerHTML`
- validates ISO date formats
- accepts only pre-defined seasonal theme names
- falls back to static HTML if JSON is absent or malformed

This means a broken or incomplete state update should not break the portfolio.

## Recommended update workflow

When updating through ChatGPT or another agent:

1. Read this file first.
2. Read the current `data/portfolio-state.json`.
3. Decide whether the requested change passes the update threshold.
4. Reject or omit private, ephemeral, unverifiable, confidential, or over-personal content.
5. Update only the smallest relevant field.
6. Preserve the schema and date format.
7. Do not rewrite the main portfolio copy merely because the state changed.

## Design principle

**Stable identity, current evidence, restrained personality.**

The portfolio should communicate technical capability, trajectory, taste and enough personality to feel human — without becoming a life feed.
