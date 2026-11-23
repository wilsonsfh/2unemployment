CREATE TABLE jobs (
  id TEXT PRIMARY KEY NOT NULL,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  queue TEXT NOT NULL CHECK (queue IN ('graduate', 'review', 'closed')),
  employer INTEGER NOT NULL CHECK (employer IN (0, 1)),
  salary_kind TEXT,
  salary_annual REAL,
  first_seen TEXT NOT NULL,
  search_text TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
  summary_json TEXT NOT NULL CHECK (json_valid(summary_json))
);
CREATE INDEX jobs_queue_company ON jobs(queue, company COLLATE NOCASE, id);
CREATE INDEX jobs_queue_recommended ON jobs(queue, employer DESC, company COLLATE NOCASE, id);
CREATE INDEX jobs_queue_newest ON jobs(queue, first_seen DESC, id);
CREATE INDEX jobs_queue_salary ON jobs(queue, salary_annual DESC, id);
CREATE INDEX jobs_company ON jobs(company COLLATE NOCASE, id);
CREATE TABLE job_cohorts (
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  cohort TEXT NOT NULL,
  PRIMARY KEY (job_id, cohort)
);
CREATE INDEX job_cohorts_cohort ON job_cohorts(cohort, job_id);

CREATE VIRTUAL TABLE jobs_search USING fts5(search_text, tokenize='unicode61');
CREATE TRIGGER jobs_search_insert AFTER INSERT ON jobs BEGIN
  INSERT INTO jobs_search(rowid, search_text) VALUES (new.rowid, new.search_text);
END;
CREATE TRIGGER jobs_search_update AFTER UPDATE ON jobs BEGIN
  DELETE FROM jobs_search WHERE rowid = old.rowid;
  INSERT INTO jobs_search(rowid, search_text) VALUES (new.rowid, new.search_text);
END;

CREATE TABLE job_history (
  history_id INTEGER PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  changed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  payload_json TEXT NOT NULL
);
CREATE INDEX job_history_job ON job_history(job_id, history_id DESC);
CREATE INDEX job_history_age ON job_history(changed_at);
CREATE TRIGGER jobs_history_update BEFORE UPDATE ON jobs BEGIN
  INSERT INTO job_history(job_id, payload_json) VALUES (old.id, old.payload_json);
END;

CREATE TABLE catalog_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  payload_json TEXT NOT NULL CHECK (json_valid(payload_json))
);
