# CLAUDE.md

Read this before touching anything.

## What this is
A personal training and health log at notaroutine.life. One person's
log — not a product, not advice. Published in the open; strangers may
find it, but it is not built for them.

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
- The shared library stores four fields per entry and nothing else,
  ever: movement, url, optional label, status flag. No submitter, no
  IP, no timestamp, no user agent, no session id, no identifier of
  any kind — nothing that could tie an entry back to a person, or
  two entries to each other.
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
fonts/              self-hosted woff2 + OFL licences
movements.js        movement library, starting loads, and the movements you added
                    yourself — shared by builder, sessions and videos
builder/            session builder: readiness, drawing the plan, history
sessions/           saved plans, trained and logged here — weights and reps
videos/             paste a link, tag it, and it joins the library — your
                    movements are drawn before the defaults (tl.custom)
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

## Before you finish
- Test at 390px width. No horizontal overflow.
- Touch targets 44px minimum.
- No console errors.
- Do not add files to the repo root beyond what is listed above.
