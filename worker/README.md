# api.notaroutine.life

The shared video library. One Worker, three endpoints, five columns. Nothing
else may move in here — see the scoped-exception rule in `../CLAUDE.md`.

The site itself is still plain HTML and CSS with no build step. This directory
is the only place in the repository with a `package.json`, and wrangler is the
only dependency.

## Endpoints

| | | |
|---|---|---|
| `GET /videos` | every entry that isn't flagged | edge-cached 60s |
| `POST /videos` | `{movement, url, label?}` | no auth, rate limited |
| `POST /report` | `{id, reason}` | hides the entry immediately |

`reason` is one of `broken`, `wrong-movement`, `unsafe`, `spam`,
`not-a-movement`. Anything else is a 400. Links must point at youtube.com,
youtu.be, instagram.com, vimeo.com or tiktok.com — exact host or a subdomain
of it, so `m.youtube.com` passes and `youtube.com.example.net` does not.

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

No submitter, no IP, no timestamp, no user agent, no session id. There is no
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

## First deploy

```sh
npm install
npx wrangler d1 create notaroutine-videos     # put the id in wrangler.toml
npm run schema                                # creates the table remotely
npx wrangler deploy
```

Then in the dashboard: **Workers & Pages → notaroutine-api → Settings →
Domains & Routes**, add `api.notaroutine.life` as a custom domain. The apex
stays on GitHub Pages.

## Continuous deployment

Cloudflare Workers Builds, connected to this repository:

- **Root directory**: `worker`
- **Build command**: *(none)*
- **Deploy command**: `npx wrangler deploy`
- **Branch**: `main`

## Tests

```sh
node test/api.test.js
```

Plain node, no wrangler, no network. D1 and the edge cache are stubbed. The
tests assert the allowlist, the query stripping, CORS, the report vocabulary,
the shape of a stored row, and that there is no endpoint that would accept
readiness data.
