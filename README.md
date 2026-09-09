# notaroutine

notaroutine.life

A personal training and health log. Static HTML and one stylesheet — no framework,
no build step, no dependencies. Served by GitHub Pages.

N=1, not medical advice.

## Structure

```
index.html            home
movements.js          the movement library and starting loads, shared by
                      builder, sessions and videos
builder/              session builder — readiness, drawing the plan, history
sessions/             your saved plans: trained and logged here
videos/               paste a link and tag it: your own movements, drawn before
                      the defaults — plus the shared library anyone can add to
training/             structure, mobility menu, variability-first programming
nutrition/            restaurant and business-lunch playbook
supplements/          thinking + honesty audit, with evidence grades
travel/               travel-mode training and eating
privacy/              what is stored, what is not, and how to report an entry
private/              encrypted; noindex
worker/               the api.notaroutine.life Worker: the shared video library
style.css             the whole design system
```

## The shared video library

One request, on one page. `videos/` asks `api.notaroutine.life` for the shared
list when it opens, and posts to it when you share a link or report an entry.
Everything else on the site is still files and localStorage, and every page
works normally when that API is unreachable — the shared list goes empty and
says so.

An entry is a movement, a link, an optional note, a status flag and a random
id. No submitter, no IP, no timestamp, nothing that ties an entry to a person
or two entries to each other. Readiness and tracker data never go near it:
there is no endpoint that would accept them. The Worker, its schema and its
tests are in `worker/`; what is kept and what isn't is written out in
`privacy/`.

## Adding a session

Three steps, and each page does one of them.

**Build it.** Set the constraints in `builder/` and press **Build the session**. It
draws a list of movements, each with a set-and-rep target as text — no input boxes.
Swap anything you don't want, or draw the whole thing again. Nothing is saved yet, and
if what you asked for doesn't fit the time it says so and draws nothing.

**Tell your tracker what you're doing.** Training gets logged in Whoop, and Whoop
needs telling first. `copy Whoop prompt` puts the drawn session on the clipboard as a
statement — every block, every movement, the sets and reps, and the weights it would
prefill (last time's, or a starting load for a movement you haven't done) — ending in
"set this up as a workout I can save and log". It asks nothing and argues nothing: the
session is drawn and you approved it by pressing the button. The tracker name follows
whichever one is picked in the readiness panel.

**Save it.** **Save session** files the plan under `sessions/` and takes you to the
list of everything you've built. The builder is empty again.

**Train it.** Open a saved session from that list. Now there are fields: kg and reps
per set, prefilled with what you lifted last time or an ordinary starting load if
there is no last time, saved as you type. Tick sets off as you go, swap a movement if
the machine is taken, and **Mark as done** when you're finished — that is what the
builder steers away from next time.

Sessions live in the browser's local storage, not in this repository — there are no
per-session HTML files.

## private/

`private/data.json` is AES-256-GCM ciphertext. The key is derived in the browser
from a passphrase via PBKDF2-SHA256. The passphrase is never transmitted and is
not stored in this repository. Every page under `private/` carries a `noindex`
meta tag and the path is disallowed in `robots.txt`.
