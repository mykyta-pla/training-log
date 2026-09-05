# training-log

A personal training and health log. Static HTML and one stylesheet — no framework,
no build step, no dependencies. Served by GitHub Pages.

N=1, not medical advice.

## Structure

```
index.html            home
sessions/             session archive, newest first
  template.html       copy this to add a session
training/             structure, mobility menu, variability-first programming
nutrition/            restaurant and business-lunch playbook
supplements/          thinking + honesty audit, with evidence grades
travel/               travel-mode training and eating
private/              encrypted; noindex
style.css             the whole design system
```

## Adding a session

1. Copy `sessions/template.html` to `sessions/YYYY-MM-DD-slug.html` and fill it in.
2. Add one `<li>` at the top of the list in `sessions/index.html`.
3. Update the "Latest session" card on `index.html`.

## private/

`private/data.json` is AES-256-GCM ciphertext. The key is derived in the browser
from a passphrase via PBKDF2-SHA256. The passphrase is never transmitted and is
not stored in this repository. Every page under `private/` carries a `noindex`
meta tag and the path is disallowed in `robots.txt`.
