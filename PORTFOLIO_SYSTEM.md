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

## Writing index

`data/articles.json` is the canonical index of Anirudh Sharma's public writing across platforms.

An article may point to:
- LinkedIn articles/newsletters
- Substack, Beehiiv, Medium, or another public publication
- a public research/engineering essay hosted elsewhere
- a portfolio-native article hosted in this repository

The portfolio is the **index**, not necessarily the publishing platform. Clicking a card should normally take the reader to the original article.

### Writing inclusion threshold

Add a piece only if it is one of:
- a substantive technical essay
- a research note with a clear argument or result
- an engineering retrospective/postmortem
- a substantial public explainer
- a thoughtful essay that is part of Anirudh's public creative/professional identity

Do not index:
- ordinary social posts
- reposts
- short reactions to news
- private journaling
- personal-life updates
- unverified claims
- low-effort AI-generated filler

Prefer quality over completeness. The website should make the body of work easier to understand, not mirror every post ever made.

### Article schema rules

Each record may contain:
- `title`
- `source`
- `date` in `YYYY-MM-DD`
- `summary`
- up to four short `tags`
- `url`
- optional `featured`
- optional `published` (set false to hide without deleting)

Guardrails:
- use only public HTTP/HTTPS URLs
- never embed external article HTML
- never put credentials, tokens, drafts, private documents, or unpublished employer material into the index
- summaries must describe the article accurately and conservatively
- use the original publication URL when known
- portfolio-native essays must be intentional publications, not temporary notes

## Update threshold

Before changing the portfolio, ask:

1. Does this change the public story materially?
2. Is it already safe and appropriate to make public?
3. Is there evidence behind the claim?
4. Will it still matter in 3–6 months?
5. Does it replace older information rather than merely add noise?

If fewer than 4 answers are yes, do not update the portfolio state.

Writing is slightly different: a new article does not need to change the overall career story, but it must pass the writing inclusion threshold above.

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
- inserts portfolio-state and article copy via `textContent`, never unsanitized HTML
- validates ISO date formats
- validates article URLs
- accepts only pre-defined seasonal theme names
- falls back to static HTML if JSON is absent or malformed

This means a broken or incomplete dynamic update should not break the portfolio.

## Recommended update workflow

When updating through ChatGPT or another agent:

1. Read this file first.
2. Read the relevant current data file (`portfolio-state.json`, `articles.json`, or `seasonal.json`).
3. Decide whether the requested change passes the applicable threshold.
4. Reject or omit private, ephemeral, unverifiable, confidential, or over-personal content.
5. Update only the smallest relevant field/record.
6. Preserve schemas and date formats.
7. Do not rewrite the main portfolio copy merely because dynamic state changed.
8. For writing, link to the original publication unless the essay intentionally lives on the portfolio.

## Design principle

**Stable identity, current evidence, restrained personality.**

The portfolio should function as the public website for Anirudh Sharma: a coherent home for selected work, research, public writing, technical direction and contact information — with enough personality to feel human, but without becoming a life feed.
