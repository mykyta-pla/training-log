# api.notaroutine.life

The shared video library. One Worker, three endpoints, five columns. Nothing
else may move in here — see the scoped-exception rule in `../CLAUDE.md`.

The site itself is still plain HTML and CSS with no build step. This directory
is the only place in the repository with a `package.json`, and wrangler is the
only dependency.

## Endpoints

| | | |
|---|---|---|
| `GET /videos` | everything not hidden | edge-cached 60s |
| `POST /videos` | `{movement, url, pattern, equip, avoid[], technique, dose?}` | no auth, rate limited |
| `POST /report` | `{id, reason}` | hides the entry immediately |

`reason` is one of `unsafe`, `broken`, `wrong`, `spam`. Anything else is a 400.

`pattern` is one of the eleven the builder uses, `equip` is 0–3, `avoid` comes
from `deepknee|overhead|jump|floor|grip`, and `technique` is `s`, `p` or `c` —
straightforward, practised, coached. A submission that would not fit the builder
is refused rather than stored. The technique rating is **self-reported**: the
Worker serves it with `techniqueVerified: false` and the site labels it that way
everywhere it appears.
Links must point at youtube.com, youtu.be, instagram.com, vimeo.com or
tiktok.com — exact host or a subdomain of it, so `m.youtube.com` passes and
`youtube.com.example.net` does not.

## Reports have two tiers

| reason | status becomes | still served? |
|---|---|---|
| `unsafe` | `hidden:unsafe` | **no** — one report is enough |
| `broken` | `flagged:broken` | yes |
| `wrong` | `flagged:wrong` | yes |
| `spam` | `flagged:spam` | yes |

One report hiding an entry for everybody is trivially abusable, so only the
one reason where a false hide is cheaper than a false leave-up does it. A
false hide costs an hour of attention; the alternative is a movement that
hurts somebody staying up while a queue is drained.

`unsafe` overrides whatever the row's state was. The other three only mark a
clean row, so a later report cannot overwrite the first reason and nothing can
flag an entry back into view.

## Reviewing what has been reported

There is no admin UI on purpose. These are the queries.

Everything reported, hidden first:

```sh
npx wrangler d1 execute notaroutine-videos --remote --command \
  "SELECT status, id, movement, label, url FROM videos WHERE status <> 'ok' ORDER BY status, movement"
```

Only what is hidden and waiting on you:

```sh
npx wrangler d1 execute notaroutine-videos --remote --command \
  "SELECT id, movement, label, url FROM videos WHERE status LIKE 'hidden:%' ORDER BY movement"
```

Put one back, or take it down for good:

```sh
npx wrangler d1 execute notaroutine-videos --remote --command \
  "UPDATE videos SET status = 'ok' WHERE id = 'THE-ID'"

npx wrangler d1 execute notaroutine-videos --remote --command \
  "DELETE FROM videos WHERE id = 'THE-ID'"
```

Either write changes what `GET /videos` returns, but the edge cache holds the
old list for up to 60 seconds.

CORS answers `https://notaroutine.life` and nothing else.

## Why D1 and not KV

KV has no compare-and-set. The library is one list, so a KV design is either
one key holding the whole JSON array — where two people submitting at the same
moment means one submission is silently overwritten — or one key per entry,
where `GET /videos` becomes a list call plus a read per entry. D1 gives a real
`WHERE status = 'ok'` in one round trip, an `INSERT` that cannot lose a
concurrent write, and a report that is a one-row `UPDATE`. The read volume is
handled by the 60-second edge cache regardless, so KV's read latency was never
the deciding factor. At this size both are free; only one of them can't drop a
submission.

## What is not stored

No submitter, no IP, no timestamp, no user agent, no session id. Every column
describes the movement; none describes the person who sent it. There is no
`created_at` column and rows are ordered by movement then by a random UUID, so
the table cannot be read back as a timeline of who was here when.

Submitted URLs are stripped of everything after the path except YouTube's `v`
and `t`. Share links carry identifiers — Instagram's `igshid`, TikTok's share
ids, `utm_*`, YouTube's `si` — and some of those name the person who copied
the link.

Rate limiting uses Cloudflare's rate limiting binding, which counts at the
edge. The Worker hands it a SHA-256 of the connecting address, never the
address, and keeps no counter of its own. `[observability]` is off, because
request logs would hold exactly what this API promises not to keep.

## Where this has got to

| | |
|---|---|
| D1 database and schema | **done** — created through the Cloudflare API |
| `wrangler.toml` binding | **done** |
| GitHub App authorisation | to do |
| Workers Builds project | to do |
| `api.notaroutine.life` | blocked on DNS, and disabled in config so it cannot fail a deploy |

## The database — already done, do not re-run

The database exists and its schema is applied. Both were created through the
Cloudflare API rather than wrangler, so **`schema.sql` is a record of what is
there, not something to run.** Re-running it would be harmless — every
statement is `IF NOT EXISTS` — but there is nothing for it to do, and no
script here applies it remotely.

```
database_name  notaroutine-videos
database_id    a048e123-d723-407b-96a3-f9a2f6077c4b
binding        DB
```

Live: the `videos` table with all nine columns — `id`, `movement`, `url`,
`pattern`, `equip`, `avoid`, `technique`, `dose`, `status` — the
`videos_status_movement` index, and the unique index on `(movement, url)`.
`wrangler.toml` is the only place that id needs to appear.

`npm run schema:local` seeds a local copy for `wrangler dev`.

## Deploying: the two steps left

### 1. Authorise the GitHub App

Workers Builds connects through the **Cloudflare Workers and Pages** GitHub
App. In **Workers & Pages → Create → Workers → Import a repository**, choose
GitHub and authorise it against `mykyta-pla/training-log`. Granting it that one
repository is enough; it does not need the account.

If the repository does not appear in the list, the App was installed with
"only select repositories" and this one was not among them — fix that in
GitHub under **Settings → Applications → Cloudflare Workers and Pages →
Configure**, not by re-authorising from the Cloudflare side.

### 2. Workers Builds settings

There is no build step: the Worker is one file of plain JavaScript and
wrangler uploads it.

| | |
|---|---|
| **Root directory** | `worker` |
| **Build command** | *(leave empty)* |
| **Deploy command** | `npx wrangler deploy` |
| **Build branch** | `main` |
| **Non-production branches** | off — nothing should deploy from a branch |

**The root directory is the one that catches people.** `wrangler.toml`,
`package.json` and `src/` all live under `worker/`; a build run from the
repository root finds no configuration and fails with "Missing entry-point".

Workers Builds installs from `package.json` before running the deploy command.
Wrangler is the only dependency, and there is no lockfile, so it resolves the
latest 4.x each time.

### Where it lands, for now

```
https://notaroutine-api.plastomak-nikita.workers.dev
```

`workers_dev = true` in `wrangler.toml` makes that explicit rather than
leaving it to a default. **The site does not call it and must not be changed
to.** `/videos/` keeps calling `api.notaroutine.life`, which does not resolve
yet, so it keeps running its API-down path — that is the designed behaviour
and not a fault to work around.

### The custom domain, when DNS moves

`wrangler.toml` has the route commented out, with the conditions written
beside it. It binds `api.notaroutine.life` to the Worker and asks Cloudflare
to create the DNS record, which Cloudflare can only do for a zone it runs.
The zone is on Porkbun today, so leaving it enabled fails every deploy — the
Worker uploads fine, the route cannot be created, and wrangler calls that a
failed deploy.

Uncomment it when **both** are true:

1. The `notaroutine.life` zone is on Cloudflare — nameservers moved, zone
   Active in the dashboard.
2. The apex A records for GitHub Pages are **DNS-only** (grey cloud).
   Proxying them puts Cloudflare in front of Pages, which is a separate
   decision and breaks the Pages certificate if it happens by accident here.

Then deploy. The alternative, adding the custom domain by hand in **Settings
→ Domains & Routes**, does the same thing but leaves `wrangler.toml` lying
about what is bound, so prefer the route block.


## Telling deployed from deployed-but-broken

The site is built to survive this API being down, which is a virtue with one
cost: **a broken deploy and no deploy look identical on the page.** These are
the checks that separate them.

### From a terminal

Until DNS moves, run these against the workers.dev hostname; after it moves,
against `api.notaroutine.life`. Everything else is identical.

```sh
API=https://notaroutine-api.plastomak-nikita.workers.dev

# 1. the Worker answers at all
curl -si $API/videos | head -5

# 2. it answers this site, and only this site
curl -si -H 'Origin: https://notaroutine.life' $API/videos \
  | grep -i access-control-allow-origin   # → https://notaroutine.life
curl -si -H 'Origin: https://evil.example' $API/videos \
  | grep -ci access-control-allow-origin  # → 0

# 3. the D1 binding is really bound
curl -s $API/videos                       # → {"videos":[]} on an empty table
                                          #   a 500 here means DB is missing
# 4. it is the Worker, not something else on the hostname
curl -s $API/nope                         # → 404 with this API's own message
```

| what you see | what it means |
|---|---|
| `{"videos":[]}` and a 200 | deployed, bound, working. An empty table is the correct answer today. |
| Cloudflare error 1016 / 522, or DNS failure on `api.notaroutine.life` | expected until the zone moves and the route is uncommented. Use the workers.dev hostname. |
| HTML rather than JSON | the hostname is resolving to something that is not this Worker |
| `{"error":"The library is having a bad moment…"}` with a 500 | the Worker is running and the D1 binding is wrong — wrong id, or the deploy did not pick up `wrangler.toml` |
| 200 but no `access-control-allow-origin` for this site's Origin | `ORIGIN` in `src/index.js` does not match the site; the browser will refuse the body even though curl sees it |

### On /videos/ itself

**Working.** The Shared heading has no count beside it and the section reads
"Nothing shared yet" — the shared library is empty until somebody adds
something. Add a movement: it appears under Yours immediately, the status line
says *"… is yours now, and shared with everyone else"*, and the entry appears
under Shared within a second, carrying its group, its equipment and its
technique rating labelled **self-reported**. Reload: it is still there, which
is the proof it came back from the server rather than from this browser.

**Not deployed, or the domain is not attached.** The Shared section shows the
note *"The shared library isn't reachable"*. Adding a movement still works and
still says so: *"… is in your library and the builder will draw it. The shared
library could not be reached, so nobody else has it yet."*

**This is the state the site is in today and will stay in until DNS moves,
even once the Worker is deployed and healthy on workers.dev.** The page is
correct; the hostname it calls does not exist yet. Confirm the Worker with
curl against workers.dev rather than by looking at `/videos/`.

**Deployed but half-working — the cases worth naming:**

| symptom | cause |
|---|---|
| The list loads, but adding gives *"… is in your library and the builder will draw it. The shared library refused it: …"* | The Worker is up and validating. The message is the Worker's own — a pattern or technique it would not accept. That is the API working, not failing. |
| Adding says *"could not be reached"* while the list loads fine | Almost always CORS on the POST preflight: `OPTIONS` is answered but the origin does not match. Check `ORIGIN` in `src/index.js`. |
| Everything works but nothing ever appears for a second browser | The D1 write is failing behind a 500, or you are looking at the 60-second edge cache. Wait a minute, then query the table directly. |
| The list is stale after a report | Expected for up to 60 seconds. `POST /report` purges the cache, but only in the colo that served it. |
| A 429 on the second or third add | The rate limit, working. Five submissions a minute, ten reports. |

The one check that settles it:

```sh
npx wrangler d1 execute notaroutine-videos --remote \
  --command "SELECT id, movement, technique, status FROM videos"
```

If a movement you added on the site is in that output, the whole path works.

## Tests

```sh
node test/api.test.js
```

Plain node, no wrangler, no network. D1 and the edge cache are stubbed. The
tests assert the allowlist, the query stripping, CORS, the report vocabulary,
the shape of a stored row, that a technique rating is always served as
unverified, that a submission the builder could not draw is refused, and that
there is no endpoint that would accept readiness data.
