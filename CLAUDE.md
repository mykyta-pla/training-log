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
- Mobile-first. Dark theme. One stylesheet: style.css.
- All state lives in localStorage. No backend, no accounts, no
  cookies, no analytics, no third-party requests of any kind.
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
movements.js        movement library — shared by builder and videos
builder/            session builder: readiness, set logging, history
sessions/           saved and completed sessions (reads localStorage)
videos/             one video link per movement
training/           structure, mobility menu, variability-first
nutrition/          restaurant and business-lunch playbook
supplements/        honesty audit with evidence grades
travel/             travel-mode training and eating
private/            AES-GCM encrypted, noindex, robots-disallowed
style.css           the whole design system

## Before you finish
- Test at 390px width. No horizontal overflow.
- Touch targets 44px minimum.
- No console errors.
- Do not add files to the repo root beyond what is listed above.
