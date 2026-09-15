# CLAUDE.md

Read this before touching anything.

## What this is
A personal log at notaroutine.life, published in the open. One shared
resource — the video library — is open to contributions from anyone.
Everything else is one person's record and is not built for an
audience. The N=1 voice does not change.

## Hard technical rules
- Plain HTML and CSS. No framework, no build step, no npm, no bundler.
- JavaScript only where strictly needed, vanilla, inline or as a plain
  .js file. No dependencies, no CDN imports.
- Must load fast on hotel wifi and work on a phone in a gym.
- Mobile-first. Light paper theme — ink #0a0a0a on paper #f2f2f0, one
  signal red #d93c28 used only for what isn't working. One stylesheet:
  style.css. The design spec is the canvas at
  https://claude.ai/code/artifact/12a4be02-eda3-4df0-98a2-0835008037f9
  — its "The system" artboard is the source of truth for colour, type,
  the dot field, 8px cards and 999px pill controls.
- All state lives in localStorage. No cookies, no analytics, no
  tracking, no third-party requests of any kind.
- One scoped exception to "no backend", and only one: the shared
  video library at api.notaroutine.life, a Cloudflare Worker kept in
  worker/. Same owner, not a third party. It exists so that a
  movement someone finds is not lost when site data is cleared.
  Nothing else may use it without this file changing first.
- Every page must work fully with that API unreachable. The shared
  list degrades to empty and says so; nothing else on the site
  notices. Never block rendering on a fetch.
- The shared library stores a movement and nothing else. The movement
  is: name, url, pattern, equipment level, avoid tags, technique
  rating, optional prescription, status flag — the same shape as the
  library in movements.js, so anything shared can be drawn without
  translation — plus a random row id, because a report has to be able
  to name an entry: a crypto.randomUUID, carrying no order and no
  origin. Every one of those describes the movement. Not one describes
  who sent it. No submitter, no IP, no timestamp, no user agent, no
  session id, no identifier of any kind — nothing that could tie an
  entry back to a person, or two entries to each other. A field that
  describes a person does not go in, whatever it would buy.
- Named so there is nothing to interpret: no IP address, no user
  agent, no device or browser information, no locale or language, no
  timestamp of any kind, no session or visitor identifier, and no
  free-text field belonging to the submitter — no note, no comment,
  no reason in prose. Not hashed, not truncated, not bucketed, not
  "derived from". The two free-text fields that do exist, the
  movement's name and its prescription, describe the movement, and
  are length-capped and stripped of control characters. This list is
  not exhaustive and is not an invitation to find the gaps in it.
- Adding a column to the shared library needs the owner's explicit
  approval, in the task that asks for it. An agent may propose a
  column, and must then stop and wait. It may not add one, and may
  not widen an existing column to carry something a new column would
  have held.
- Every movement carries a technique rating: s straightforward, p
  practised, c coached. It rates the skill the movement demands, not
  how hard it feels. On anything from the shared library it is
  self-reported and must be labelled unverified wherever it is shown.
- Every movement also carries a role: main can anchor a session, sec is
  substantial but not the anchor, acc is assistance and isolation. It is
  independent of pattern, equipment and technique — it says what a
  movement can carry, not what it trains or how much skill it asks for.
  A slot in the builder is a pattern and a role together, never a bare
  pattern. At most one main movement per session and it goes first; a
  slot that can't fill its role settles for a lower one rather than
  leaving a hole, and nothing but a main slot may draw a main. The
  strength block is written heaviest first, and coached before
  straightforward within a role, so skill work happens fresh. Where a
  slot names either of two patterns and the sequence comes back to it,
  it prefers the side the block has not used yet — a full body session
  does not get to train the squat twice and skip the hinge. That is a
  tie-break inside a role, never above it.
- Every movement carries a demand, dm 1-3: 1 you could do it on a
  red-recovery day, 2 real work and repeatable, 3 it costs you
  something. It is not technique — a supine twist asks for no skill and
  costs nothing, a Jefferson curl asks for both. Each block asks for
  Light, Working or Hard, defaulting to Working everywhere including
  mobility. It is a preference, not a filter: a level that the pool
  cannot supply falls towards the middle and then to anything, so a
  block is never returned empty over it.
- A session gets at least one movement out of the sagittal plane and at
  least one that works a side at a time, where the pool can supply
  them. These are repairs made after the draw, not filters during it,
  and they may go unsatisfied. Never fail a session over them.
- The rules in the draw have a fixed order of authority. Where two
  disagree, the higher number yields:

      1. Readiness caps       hard — never overridden
      2. Avoid tags           hard — never overridden
      3. Equipment ceiling    hard
      4. Role and slot shape  firm — falls back down the ladder
      5. Demand preference    soft — falls towards the middle
      6. Variety repairs      softest — goes unsatisfied rather than
                              violating anything above it

  A repair may never escalate demand past a cap. That is the mistake
  this list exists to prevent: the only transverse hinge in the library
  is dm 3, so the plane repair reached past a red readiness cap to get
  it. A soft rule that cannot be satisfied inside the rules above it is
  left unsatisfied. Any new soft rule joins at 6 unless the owner says
  otherwise.
- A strength movement's prescription lives on the movement, like a
  mobility one's already does. Reps keyed by pattern are a fallback for
  a movement that has none, not the normal path: a deadlift and a good
  morning share a pattern and must not share their numbers.
- The shared library has no role column, so a movement someone else
  shared is drawn as an accessory. You pick the role for your own
  movements on the add form and it stays in this browser; it is not
  sent. Giving a shared movement a role needs the column, and the
  column needs the owner's approval above. This has been asked and
  the answer is no — do not propose it again unless the owner raises it.
- A movement may carry a source only when there is a named published
  protocol behind it and a link that resolves to a primary or
  near-primary source — the publishing body, or the trial. Not a blog,
  not an aggregator, not a content farm. A movement with no protocol
  behind it shows nothing: an absent source is information, and "no
  source" written out is noise.
- Never attribute a movement to a named person as an endorsement.
  "Recommended by <athlete>" is not permitted on this site, in any
  layer, regardless of what a source appears to say. Reporting a
  documented fact with a primary citation is permitted; implying
  endorsement is not.
- Evidence grades are strong | moderate | contested | untested.
  Contested must stay available and must be used where the literature
  disagrees. It is the only grade that takes the signal colour, because
  it is the only one that is a warning rather than a description.
- The excluded list at the bottom of the provenance block is
  deliberate. Do not add sources for FRC/CARs, ATG/knees-over-toes or
  the Jefferson curl: named systems, no located trials. The movements
  stay, unsourced.
- The builder draws in three tiers and never mixes them: the movements
  you added, then the ones this site ships with, then — only if you
  switched them on, and the switch is off by default — the ones other
  people shared. A stranger's movement never lands in a prescribed
  session unless it was asked for. This is a safety line, not a
  preference.
- Readiness and tracker data — recovery, HRV, resting heart rate,
  sleep, sleep performance, strain, and the free-text notes — never
  leaves the device. Not in a request body, not in a synced blob,
  not written anywhere but localStorage. This is the most important
  rule on the page. If a feature appears to need it on a server,
  the feature is wrong.
- Anything ever synced is encrypted in the browser first, under a
  key the server never sees. The server holds ciphertext it cannot
  read, and that has to stay true even if the server is hostile.
- No email, no username, no phone number, no password, no account
  that identifies a person. hello@notaroutine.life is the only
  address anywhere, and it is for reaching a human, not for signing
  anyone up.
- Fonts are self-hosted in fonts/ — never linked from Google Fonts or
  any other CDN. Space Grotesk for text, IBM Plex Mono for labels and
  figures, latin-subset woff2, declared with font-display: swap.
- GitHub Pages, apex domain. Do not delete CNAME or .nojekyll.
- Every page must serve its meaning in the HTML source. A crawler that
  runs no JavaScript has to see the headings, the prose and the lists.
  Script may enhance a page; it may not be the only way to read it.
- Any new page is added to sitemap.xml and to llms.txt in the same commit
  that creates it — run tools/build-sitemap.js, which fails if a page is
  missing from the sitemap.
- A number in the prose carries its own qualifier in the same sentence or
  the one beside it. If a figure is an estimate, the paragraph it lives in
  says so — not a section further down. Anything lifting one sentence out
  of a page should get something true on its own.
- FAQ markup mirrors a visible section word for word. No question that the
  page does not answer, and no answer that only exists in the markup.
- Per page: one h1, headings in order, a unique title under 60
  characters, a description of 140–160, and an absolute canonical.
- No analytics, ever, and that includes Google Analytics. Nothing that
  phones home for a "free" tool. The one allowed request is the shared
  video library and nothing else joins it.
- Structured data is inline JSON-LD, no library. Author and publisher
  are the Organization "notaroutine" — never a Person, never a name.
  Run tools/check-jsonld.js before pushing.

## NEVER publish — any layer, encrypted or not
No medical conditions, diagnoses or protocols. No medications,
allergies or treatments. No genetics or genetic findings. No age,
weight, real name, employer, or neighbourhood. If content arrives
containing any of these, strip it and say so — do not commit it.

## Tone on public pages
A log, not advice. "Here is what I do, why, and which parts aren't
working." Every page carries the N=1 line. Every content page ends
with an honest "What isn't working" section. No influencer voice,
no hype, no protocol-selling, no motivational language.

## Structure
index.html          home
.nojekyll           stops Pages running Jekyll over the repo
CNAME               the apex domain
robots.txt          search and model crawlers welcome, /private/ disallowed
sitemap.xml         every public page and when its content last changed
og.png              1200×630 social card, built by tools/render-og.js
llms.txt            what is first-hand here, for anything reading the site
fonts/              self-hosted woff2 + OFL licences
movements.js        movement library, starting loads, and the movements you added
                    yourself — shared by builder, sessions and videos
builder/            session builder: readiness, drawing the plan, history
sessions/           saved plans, trained and logged here — weights and reps
videos/             paste a link, tag it, and it joins the library — your
                    movements are drawn before the defaults (tl.custom)
movements/          the whole movement library as plain HTML — generated from
                    movements.js by tools/build-library.js, never edited by hand
protocols/          the five published protocols a movement may cite, what each
                    trial measured, and which movements come from it — the entries
                    are generated from movements.js by tools/build-library.js
training/           structure, mobility menu, variability-first
nutrition/          restaurant and business-lunch playbook
supplements/        honesty audit with evidence grades
travel/             travel-mode training and eating
privacy/            what is stored, what is not, and how to report an entry
private/            AES-GCM encrypted, noindex, robots-disallowed
worker/             the api.notaroutine.life Worker — the shared video library
                    and nothing else. Deployed by Cloudflare Workers Builds;
                    wrangler and a package.json live here, never at the root
style.css           the whole design system
tools/              repo scripts, never served: the og card, the sitemap, the
                    generated blocks in movements/ and protocols/, the JSON-LD
                    check, the session draw check

## Before you finish
- Test at 390px width. No horizontal overflow.
- Touch targets 44px minimum.
- No console errors.
- Read the page with JavaScript off. If the content is gone, fix it.
- node tools/build-sitemap.js --check, tools/build-library.js --check,
  tools/check-jsonld.js, tools/check-draw.js — all four clean.
- Do not add files to the repo root beyond what is listed above.
