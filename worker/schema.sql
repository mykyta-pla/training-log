-- The shared video library. This is the entire schema, and the rule in
-- CLAUDE.md is that it stays this size: movement, url, optional label, status,
-- plus a random id so a report can name a row.
--
-- Deliberately absent: any column for who submitted it, when, from where, or
-- with what. There is no created_at. Ordering is by movement then by the
-- random id, so the table cannot be read back as a submission timeline.

CREATE TABLE IF NOT EXISTS videos (
  id       TEXT PRIMARY KEY,          -- crypto.randomUUID, no order, no origin
  movement TEXT NOT NULL,             -- the movement it demonstrates
  url      TEXT NOT NULL,             -- allowlisted host, query stripped
  label    TEXT,                      -- optional, 80 chars, e.g. "the cue at 0:14"
  -- 'ok'                clean
  -- 'flagged:<reason>'   reported broken, wrong or spam — still served
  -- 'hidden:unsafe'      reported unsafe — not served, waiting on review
  status   TEXT NOT NULL DEFAULT 'ok'
);

-- GET /videos is WHERE status NOT LIKE 'hidden:%' ORDER BY movement, id.
CREATE INDEX IF NOT EXISTS videos_status_movement ON videos (status, movement);

-- The same link for the same movement is stored once.
CREATE UNIQUE INDEX IF NOT EXISTS videos_movement_url ON videos (movement, url);
