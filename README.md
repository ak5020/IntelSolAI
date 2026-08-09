# IntelSol AI — Landing Page

Single-page marketing site for IntelSol AI. Dark, technical, enterprise-grade.

**Read [`HANDOFF.md`](./HANDOFF.md) first** — it lists everything that still needs
real assets or configuration before launch.

## Stack

- Next.js 15 (App Router) + TypeScript strict
- Tailwind CSS v4, tokens defined in `@theme` in `app/globals.css`
- `next/font/google` — Bricolage Grotesque, Public Sans, JetBrains Mono, self-hosted
- Zod + Resend — the only two runtime dependencies
- No UI library, no animation library, no icon package. Every icon and
  illustration is hand-authored inline SVG.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values — see HANDOFF.md §1.1
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |

## Editing content

All marketing copy lives in **`lib/content.ts`**. Sections import from it and
never hardcode strings, so any wording change is a one-file edit.

Design tokens — colour, spacing rhythm, radii, motion easing — live in the
`@theme` block at the top of **`app/globals.css`**. Nothing else defines colour.

## Principles worth preserving

- **The page renders fully without JavaScript.** JS only enhances (counters,
  tabs, accordion, video, mobile nav). Anything interactive is hidden rather than
  left dead when JS is unavailable — never gate content behind a control.
- **`--section-y` is defined once** and never overridden per section. That is what
  keeps the vertical rhythm consistent.
- **The accent colour appears on primary CTAs, active states and live data points
  only.** Spending it anywhere else is what makes pages like this look generic.
- **`prefers-reduced-motion` is honoured everywhere.** If you add an animation,
  add the reduced-motion case at the same time.
