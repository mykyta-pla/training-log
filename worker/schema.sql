-- The shared movement library. Every column describes the movement; none
-- describes who sent it. That is the rule in CLAUDE.md and it is the reason
-- there is no created_at, no submitter and no address here.
--
-- It is the same shape as the library the site ships with in movements.js, so
-- anything stored here can be drawn by the builder without translation.

CREATE TABLE IF NOT EXISTS videos (
  id        TEXT PRIMARY KEY,          -- crypto.randomUUID, no order, no origin
  movement  TEXT NOT NULL,             -- what it is called
  url       TEXT NOT NULL,             -- allowlisted host, query stripped
  pattern   TEXT NOT NULL,             -- m_shoulder … fin: what it trains
  equip     INTEGER NOT NULL,          -- 0 bodyweight, 1 band, 2 dumbbells, 3 full gym
  avoid     TEXT NOT NULL DEFAULT '',  -- comma-separated, from a fixed list of five
  technique TEXT NOT NULL,             -- s | p | c — SELF-REPORTED, verified by nobody
  dose      TEXT,                      -- optional prescription, e.g. "8 each side"
  -- 'ok'                clean
  -- 'flagged:<reason>'  reported broken, wrong or spam — still served
  -- 'hidden:unsafe'     reported unsafe — not served, waiting on review
  status    TEXT NOT NULL DEFAULT 'ok'
);

-- GET /videos is WHERE status NOT LIKE 'hidden:%' ORDER BY movement, id.
CREATE INDEX IF NOT EXISTS videos_status_movement ON videos (status, movement);

-- The same link for the same movement is stored once.
CREATE UNIQUE INDEX IF NOT EXISTS videos_movement_url ON videos (movement, url);
