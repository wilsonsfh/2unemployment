CREATE TABLE applications (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
 job_id TEXT,
 company TEXT NOT NULL,
 title TEXT NOT NULL,
 apply_url TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'saved' CHECK(status IN ('saved','applied','interviewing','offer','rejected','withdrawn')),
 notes TEXT NOT NULL DEFAULT '',
 applied_on TEXT,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(user_id,job_id)
);
CREATE INDEX applications_user_updated ON applications(user_id,updated_at DESC,id);
