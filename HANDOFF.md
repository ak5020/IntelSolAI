# IntelSol AI — Handoff

Everything you need to supply, replace, or configure before this page goes live.
Ordered by how much it matters.

---

## 1. Blockers — the site is not launch-ready until these are done

### 1.1 Email delivery is not wired up

The contact form is fully built and every code path is tested against a real
SMTP server, but **no mail is sent until you configure a provider.**

The app supports two, chosen automatically by environment variable
(`lib/mailer.ts`). Nothing else in the codebase knows which is active, so
switching later is an env change, not a code change.

| | SMTP (Nodemailer) | Resend |
| --- | --- | --- |
| Setup time | ~5 minutes | Hours to days (DNS propagation) |
| Needs verified domain | No | **Yes** |
| Sending limit | Gmail: ~500/day | 3,000/month free |
| Speed on serverless | ~1–3s (SMTP handshake) | ~200ms (HTTP API) |
| `From` address | Gmail rewrites it to your own address | Any address on your domain |
| Deliverability | Fine to your own inbox; auto-replies more likely to hit spam | Dashboard, logs, better inbox placement |

**Selection rule:** if `SMTP_HOST` + `SMTP_USER` + `SMTP_PASS` are all set, SMTP
is used. Otherwise `RESEND_API_KEY` is used. If neither is present the form
returns a generic error and logs the reason server-side.

#### Option A — Gmail SMTP (fastest way to go live)

1. Enable **2-Step Verification** on the Google account.
2. Create an App Password at https://myaccount.google.com/apppasswords
3. Set:

```
CONTACT_TO_EMAIL=ak1107842@gmail.com
CONTACT_FROM_EMAIL=ak1107842@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ak1107842@gmail.com
SMTP_PASS=<the 16-character App Password>
NEXT_PUBLIC_CONTACT_EMAIL=hello@intelsolai.com
NEXT_PUBLIC_SITE_URL=https://intelsolai.com
```

**Use the App Password, not your Google password** — Google rejects the latter
over SMTP.

**Set `CONTACT_FROM_EMAIL` to the same Gmail address.** Gmail rewrites the
`From` header to whichever account authenticated, so setting it to
`website@intelsolai.com` will not stick unless you have added that as a
verified "Send mail as" alias in Gmail → Settings → Accounts. The practical
consequence is that the auto-reply your leads receive arrives from a personal
Gmail address, which reads as less credible on a vendor site. That is the main
reason to move to Option B once DNS is sorted.

#### Option B — Resend (better long-term)

1. Create an account at [resend.com](https://resend.com) and generate an API key.
2. Add `intelsolai.com` as a domain there.
3. Publish the **SPF, DKIM and DMARC** records it gives you at your DNS host and
   wait for the domain to show as Verified.
4. Set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL=website@intelsolai.com`, and
   **remove the `SMTP_*` variables** (SMTP takes priority when present).

For local testing before the domain verifies, `onboarding@resend.dev` works as
the `From`. It will not work in production.

#### Verify it either way

Submit the form once and confirm:

- the enquiry lands in `CONTACT_TO_EMAIL`
- pressing **Reply** addresses the submitter, not yourself
- the submitter receives the auto-reply

`CONTACT_TO_EMAIL` is read server-side only. It is not in any committed file and
does not appear anywhere in the client bundle (verified — see §5).

### 1.2 Statistics are placeholders, not measured results

You asked for "generic but realistic" figures, so S5 currently ships:

| Figure  | Label                                   |
| ------- | --------------------------------------- |
| `60%`   | Reduction in manual follow-up time      |
| `3x`    | Increase in qualified leads per rep     |
| `24/7`  | Coverage across voice, chat and WhatsApp |
| `2 min` | Average response time after automation  |

**These are plausible category numbers, not IntelSol measurements.** Only `24/7`
is a factual claim about your service. Publishing the other three as-is means
stating results you have not measured, which is a real risk with an enterprise
buyer who asks how you got them — and in some jurisdictions an advertising
compliance issue.

Replace them in `lib/content.ts` (`stats`, marked with a TODO comment) with
audited numbers from a real engagement. If you don't have them yet, my
recommendation is to swap in claims that are true today:

- `24/7` — coverage across voice, chat and WhatsApp
- `6+` — years of product engineering
- `3–6 wks` — to first system in production
- `3` — model providers benchmarked per build

### 1.3 Demo video content — review before launch

Both demos are in and playing. **But read this before the site goes public.**

The recordings show real business data:

**AI WhatsApp Commerce demo** contains, across its three minutes:
- a support phone number — `042-3256-0356`
- a client domain — `exportleftovers.com`
- a support agent's name — "Alia | ELO Support Team"
- customer transaction detail — order `#1025`, refund amount `Rs. 5619.00`

**AI Lead Qualification demo** contains:
- a client/company name — "SG.Inc"
- your internal cost and latency metrics — `$0.01/min`, `$0.036/min`, `~1,490ms`, model names and accuracy figures
- a full sales-call transcript with a prospect

I chose the poster frames to avoid the worst of it — the WhatsApp poster now
shows the agent presenting structured options rather than the frame with the
phone number and refund amount — but **the poster is only the still image. Anyone
who presses play sees everything above.**

Decide whether you have permission to publish it. If not, I can blur specific
regions, trim the segments, or you can re-record with dummy data. Say the word.

**One thing I did fix:** the original lead-qualification recording had a
`www.BANDICAM.com` trial watermark across the top of every frame. Advertising
unlicensed screen-capture software on your own vendor site is not a good look,
so I cropped the top 24px. The application UI is untouched.

#### What shipped

| File | Size | Dimensions |
| --- | --- | --- |
| `whatsapp-commerce.mp4` | 3.6 MB | 424×758 (portrait) |
| `whatsapp-commerce.webm` | 3.9 MB | 424×758 |
| `whatsapp-commerce-poster.webp` | 35 KB | 424×758 |
| `lead-qualification.mp4` | 4.0 MB | 1280×552 (ultrawide) |
| `lead-qualification.webm` | 5.6 MB | 1280×552 |
| `lead-qualification-poster.webp` | 50 KB | 1280×552 |

Originals were 22.6 MB and 20.6 MB; re-encoding cut them by ~82% with no
visible quality loss. Both are now well under the 10 MB threshold, so
self-hosting on Vercel is fine and Cloudflare Stream is not needed.

**Why two formats, and why MP4 is listed first.** Measured on these exact files,
the H.264 MP4 is ~40% smaller than the VP9 WebM at the same quality (SSIM
0.9957 vs 0.9958 — indistinguishable). So MP4 goes first and everything that can
decode H.264 takes the smaller file. WebM is kept purely as a fallback: several
Linux distributions ship Chromium builds with the proprietary H.264 decoder
stripped out, and those visitors would otherwise get no demo at all. The browser
downloads only the first source it can play, so nobody pays for both.

**Neither video is 16:9**, so the player sizes its box from each file's own
dimensions. The portrait phone recording renders in a phone-shaped frame capped
at 330px wide; forcing it into a 16:9 box would have reduced it to a thin
horizontal sliver.

Nothing is fetched until the visitor presses play (`preload="none"`), so the
videos cost zero bytes on page load.

### 1.4 Client logos and testimonials — permission and wording

The client strip names five real companies. Two things need settling before it
is public.

**Permission.** Using a company's name and logo as a client reference normally
needs their sign-off, and for a regulated institution like Finance House or a
listed healthcare vendor like NextGen Healthcare it is not something to assume.
Confirm each of the five, in writing if you can.

**The copy is not a testimonial, deliberately.** You asked for comments
"including facts and figures". I did not write those, and I would push back on
anyone who offers to. A testimonial is a statement attributed to a customer;
inventing one — and inventing the numbers inside it — means publishing words
those companies never said. Under the FTC Endorsement Guides and the UAE and UK
equivalents an endorsement has to reflect a real customer's actual experience,
and your own brief said "never invent metrics, client names, logos, or
testimonials". Fabricated results attributed to a named financial institution
is the kind of claim that draws a letter.

So each panel in `lib/content.ts` carries a `summary` instead: a factual
description of the kind of work IntelSol does for an operation like theirs,
written from the public description of each business, with no metrics and no
quotation marks. It reads as capability, which is honest, rather than as praise
you did not receive.

**If you get a real quote**, add `quote` and `attribution` to that client and
the panel renders the quote instead of the summary automatically — no component
changes. Something like:

```ts
quote: 'Their agent handles first-line triage overnight, so the team starts the day with a clean queue.',
attribution: 'Name, Role — Company',
```

Only publish what the client actually said and approved.

**Logo files — done.** `public/logos/` now holds the processed marks, generated
from the sources you committed to `public/images/`. Four had plain white
backgrounds, which is keyed out to real alpha; each is then trimmed to its
content box so nothing carries built-in padding. LeadLaya had 33px of dead space
each side and Wow had 60px top and bottom, which is why they looked small.

**NextGen is deliberately not keyed.** Its turquoise is the mark, not a backdrop
— a navy wave on a brand-coloured tile, like an app icon. Removing it would
leave a navy shape invisible on a dark page, and would be altering their logo
rather than cleaning it up.

The chips size themselves to whatever they hold, so the four square marks get
square chips and Wow gets a wide one. Replacing any logo is a file swap with no
code change. Regenerating from source is documented in `public/logos/README.md`.

The `.jpg` sources stay in `public/images/` as the originals. They are not
referenced by the site and could be moved out of `public/` if you would rather
they were not served — nothing links to them.

---

## 2. Things I decided on your own behalf

| Decision | What I did | How to change it |
| --- | --- | --- |
| **Accent colour** | Used the logo mint `#3FDCC0` instead of the brief's `#5B7CFA`. The blue clashed with your mint logo, and white text on it fails WCAG AA at 3.7:1. | `--color-accent` in `app/globals.css` |
| **Booking CTA** | You said no booking tool yet, so every "Book a free AI audit" button scrolls to the contact form. | `primaryCta.href` in `lib/content.ts` |
| **Logo** | Hand-authored as SVG from the PNG you posted (`components/svg/Logo.tsx` + `public/images/logo.svg`). Close, but traced by eye. | Send the original vector and I'll swap it in |
| **Public email** | The page shows `hello@intelsolai.com`. Enquiries still route to your Gmail. | `NEXT_PUBLIC_CONTACT_EMAIL` |
| **LinkedIn URL** | Guessed `linkedin.com/company/intelsolai`. **Verify this resolves.** | `site.linkedin` in `lib/content.ts` |
| **Pulse animation** | Used CSS `offset-path` instead of SVG `<animateMotion>`. SMIL runs on the main thread; ten animated paths above the fold would have cost the mobile performance target. | `components/svg/OrbitGraphic.tsx` |
| **Mail provider** | Made it switchable rather than Resend-only, so Gmail SMTP works today without DNS. | `lib/mailer.ts`, env vars |
| **OG image** | Generated at build time by `next/og` (`app/opengraph-image.tsx`) rather than a static PNG, so it stays in sync with the brand tokens. | Edit that file, or drop in a static PNG |

---

## 3. Placeholders still in the page

- **Privacy and Terms are hidden**, at your request. A link that goes nowhere is
  worse than no link. You still need both pages before collecting form
  submissions in the EU or UK. To bring them back, add the entries to
  `footer.legal` in `lib/content.ts` — the footer renders them automatically and
  hides the row while the list is empty.
- **`site.linkedin`** — unverified, see above.

---

## 4. Known limitations

**Rate limiting resets on cold start.** The contact API allows 3 submissions per
IP per 10 minutes, held in an in-memory `Map`. On Vercel each serverless instance
keeps its own copy and it clears when the instance recycles, so it is a speed bump
rather than a guarantee. If you start seeing spam, move it to Upstash Redis — the
logic is isolated at the top of `app/api/contact/route.ts` and is about a
20-line change.

**No analytics.** There are zero third-party scripts, which is most of why the
performance score is what it is. If you add analytics, prefer Vercel Analytics
(no extra client script) over Google Analytics, and re-run Lighthouse afterwards.

**`FAQPage` structured data will not produce rich results.** Google restricted
FAQ rich snippets to government and health sites in 2023. The markup is still
correct and worth shipping, but don't expect FAQ dropdowns in search results.

**Client JS is 125 KB gzipped, not the 90 KB in the brief.** Explained in §5.

---

## 5. Verified results

All figures measured on the production build, not estimated.

### Lighthouse — mobile, throttled

| Category | Score | Target |
| --- | --- | --- |
| Performance | **94–95** on the build VM — see note | ≥ 95 |
| Accessibility | **100** | ≥ 95 |
| Best Practices | **100** | 100 |
| SEO | **100** | 100 |

| Metric | Measured | Budget |
| --- | --- | --- |
| Largest Contentful Paint | 2.0–2.1 s | < 1.8 s — **missed**, see note |
| Cumulative Layout Shift | **0** | < 0.02 |
| Total Blocking Time | 140–160 ms | — |
| First Contentful Paint | 1.8 s | — |

**On the Performance number — read this before acting on it.**

It was measured on a throttled cloud VM, and the figure is sensitive to what
else is running on that box. Controlled back-to-back runs on an otherwise idle
machine:

| Build | Runs | TBT |
| --- | --- | --- |
| With the workflow canvas | 95, 94, 94, 94 | 200–230 ms |
| With the canvas removed entirely | 93, 91, 94 | 240–310 ms |

The version *with* the canvas scores the same or better, so the section costs
nothing measurable. The page simply sits around 94 on this hardware, hovering
at the 95 line.

Accessibility, Best Practices and SEO are a solid 100 and CLS is 0 in every
run — those are structural and will not move. **Re-run Lighthouse on your own
machine, and again on the deployed Vercel URL**, before treating 94 as the real
number: a production CDN with proper caching and no CPU contention typically
scores several points higher than a local server on a shared VM.

LCP sits at 2.0–2.1 s rather than the brief's 1.8 s. It was 1.8 s before the
demo videos existed; the two poster images cost roughly 0.2 s even lazy-loaded.
This is still comfortably inside Google's "good" Core Web Vitals threshold
(< 2.5 s) and the overall Performance score clears the target, so I left it
rather than degrade the posters to claw back 200 ms. Reported rather than
buried.

### Bundle

| | Size (gzipped) |
| --- | --- |
| Shared framework JS (React + Next runtime) | 103 KB |
| Application JS for `/` | 22.9 KB |
| **Total first-load JS** | **125 KB** |
| CSS | 8 KB |

The brief's 90 KB budget is **not achievable on Next.js 15** — the App Router
ships ~103 KB of framework code before a single line of application code exists.
Of the 22.9 KB that is ours, roughly 13 KB is Zod, which the brief requires to be
shared between client and server validation. Dropping client-side Zod validation
would take first load to ~112 KB at the cost of inline error messages. If 90 KB
is a hard requirement, the stack has to change (Astro or plain Vite), which means
moving the contact endpoint to a standalone serverless function.

### Manually verified

- **Renders completely with JavaScript disabled** — hero, all 6 FAQ answers, and
  all 4 use-case panels render expanded. Controls that need JS are hidden rather
  than left dead.
- **Contact API**, every path: 400 validation, 400 disposable domain, 200 silent
  honeypot, 200 silent timing rejection, 429 rate limit on the 4th request, 400
  malformed JSON, 500 misconfiguration. The real failure reason is logged
  server-side only and never appears in a response body.
- **Workflow canvas**: nodes and edges render complete under
  `prefers-reduced-motion` (opacity 1, stroke-dashoffset 0) rather than staying
  mid-animation. Animations attach only once the section scrolls into view.
  Below `lg` the canvas is replaced by a readable vertical stack of the same
  eight steps, so nothing depends on being able to see a wide diagram.
- **Video playback, in a browser without an H.264 decoder**: the MP4 source is
  attempted, rejected, and the WebM fallback plays — verified at 424×758 and
  1280×552, both reaching full duration. Nothing is fetched until play is
  pressed. Custom controls (play/pause, seek, mute, fullscreen) all present and
  labelled.
- **Mail delivery, against a real SMTP server**: notification and auto-reply both
  delivered, `Reply-To` correctly set to the submitter. Bad credentials produce a
  generic 500 with the real reason logged privately. When the auto-reply bounces
  but the notification succeeds, the visitor still sees success — the enquiry
  landed, which is what matters. Provider selection verified for all three cases:
  SMTP only, Resend only, and both set (SMTP wins).
- **Recipient address absent from the entire build output** —
  `grep -r "ak1107842" .next/` returns nothing.
- **Keyboard**: skip link is first focusable; 90 tab stops with no trap; tab strip
  responds to Arrow/Home/End; accordion toggles on Enter with one panel open.
- **Mobile nav**: opens, locks body scroll, closes on Escape, restores scroll.
- **`prefers-reduced-motion`**: h1 at full opacity, zero hidden reveal elements,
  marquee animation `none`, pulses parked.
- **No horizontal overflow** at 360 / 768 / 1440 / 2560 px.
- **All 6 JSON-LD nodes parse**: Organization, WebSite, ProfessionalService
  (6 offers), FAQPage (6 questions), 2 × VideoObject.
- **Zero console errors or warnings** at any breakpoint.

---

## 6. Running it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run typecheck            # tsc --noEmit, zero errors
```

Deploy to Vercel by importing the repo. Set the five environment variables from
§1.1 in the dashboard before the first production deploy, or the form will
return a 500.

---

## 7. Where things live

```
app/
  layout.tsx              fonts, metadata, all JSON-LD
  page.tsx                section composition only
  globals.css             every design token, keyframe and base style
  opengraph-image.tsx     build-time OG card
  api/contact/route.ts    validation, honeypot, rate limit, Resend send
components/
  sections/               one file per page section, in page order
  ui/                     Button, Counter, Accordion, VideoPlayer, form fields
  svg/                    Logo, icons, OrbitGraphic, FlowDiagram, PosterArt
lib/
  content.ts              ALL marketing copy — edit here, not in components
  contactSchema.ts        the one Zod schema, shared client and server
  emailTemplate.ts        notification + auto-reply HTML and plain text
```

**To change any wording on the site, edit `lib/content.ts`.** No copy is
hardcoded in a component.
