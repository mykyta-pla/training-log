# notaroutine

notaroutine.life

A personal training and health log. Static HTML and one stylesheet — no framework,
no build step, no dependencies. Served by GitHub Pages.

N=1, not medical advice.

## Structure

```
index.html            home
movements.js          the movement library, shared by builder and videos
builder/              session builder — readiness, set logging, history
sessions/             your saved and completed sessions
videos/               one video link per movement
training/             structure, mobility menu, variability-first programming
nutrition/            restaurant and business-lunch playbook
supplements/          thinking + honesty audit, with evidence grades
travel/               travel-mode training and eating
private/              encrypted; noindex
style.css             the whole design system
```

## Adding a session

Build one in `builder/` and press Save. Sessions live in the browser's local
storage, not in this repository — there are no per-session HTML files.

## private/

`private/data.json` is AES-256-GCM ciphertext. The key is derived in the browser
from a passphrase via PBKDF2-SHA256. The passphrase is never transmitted and is
not stored in this repository. Every page under `private/` carries a `noindex`
meta tag and the path is disallowed in `robots.txt`.
