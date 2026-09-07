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
videos/               one video link per movement
training/             structure, mobility menu, variability-first programming
nutrition/            restaurant and business-lunch playbook
supplements/          thinking + honesty audit, with evidence grades
travel/               travel-mode training and eating
private/              encrypted; noindex
style.css             the whole design system
```

## Adding a session

Set the constraints in `builder/` and press **Build and open the session**. That one
press draws the session, files it under `sessions/` and opens it there — the builder
keeps nothing. If what you asked for doesn't fit the time, it says so and saves
nothing.

The plan itself is text: movements and a set-and-rep target. Weights and reps are
typed in on the session, prefilled with what you lifted last time or an ordinary
starting load if there is no last time, and saved as you type. A movement can be
swapped for another there — the machine is taken, the shoulder says no. **Mark as
done** files it into history, which is what the builder steers away from next time.

Sessions live in the browser's local storage, not in this repository — there are no
per-session HTML files.

## private/

`private/data.json` is AES-256-GCM ciphertext. The key is derived in the browser
from a passphrase via PBKDF2-SHA256. The passphrase is never transmitted and is
not stored in this repository. Every page under `private/` carries a `noindex`
meta tag and the path is disallowed in `robots.txt`.
