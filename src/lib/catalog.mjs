export class CatalogQueryError extends Error {
  constructor(message) { super(message); this.name = 'CatalogQueryError'; }
}

function choice(params, key, choices, fallback) {
  const value = params.get(key) ?? fallback;
  if (!choices.includes(value)) throw new CatalogQueryError(`Invalid ${key}`);
  return value;
}

function integer(params, key, fallback, min, max) {
  const value = params.get(key);
  if (value === null) return fallback;
  if (!/^\d+$/.test(value) || Number(value) < min || Number(value) > max) {
    throw new CatalogQueryError(`${key} must be between ${min} and ${max}`);
  }
  return Number(value);
}

export async function listJobs(db, params = new URLSearchParams()) {
  const limit = integer(params, 'limit', 25, 1, 50);
  const offset = integer(params, 'offset', 0, 0, 10000);
  const queue = choice(params, 'queue', ['graduate', 'review', 'closed', 'all'], 'graduate');
  const sort = choice(params, 'sort', ['recommended', 'company', 'newest', 'salary'], 'recommended');
  const salary = choice(params, 'salary', ['all', 'known', 'employer', 'unknown'], 'all');
  const employer = choice(params, 'employer', ['0', '1', 'false', 'true'], '0');
  const cohort = params.get('cohort') ?? 'all';
  if (cohort !== 'all' && !/^20\d{2}$/.test(cohort)) throw new CatalogQueryError('Invalid cohort');
  const query = (params.get('q') ?? '').trim();
  if (query.length > 100) throw new CatalogQueryError('q must be at most 100 characters');

  const where = [], values = [];
  if (queue !== 'all' && !params.has('ids')) { where.push('j.queue = ?'); values.push(queue); }
  if (employer === '1' || employer === 'true') where.push('j.employer = 1');
  if (salary === 'known') where.push('j.salary_annual IS NOT NULL');
  if (salary === 'unknown') where.push('j.salary_annual IS NULL');
  if (salary === 'employer') where.push("j.salary_kind = 'advertised'");
  if (cohort !== 'all') {
    where.push('j.id IN (SELECT job_id FROM job_cohorts WHERE cohort = ?)'); values.push(cohort);
  }
  if (params.has('ids')) {
    const ids = [...new Set(params.get('ids').split(','))];
    if (!ids.length || ids.length > 50 || ids.some(id => !validId(id))) {
      throw new CatalogQueryError('ids must contain 1–50 valid job IDs');
    }
    where.push(`j.id IN (${ids.map(() => '?').join(',')})`); values.push(...ids);
  }
  if (query) {
    // Only words reach FTS syntax; quote every token and add a prefix wildcard.
    const tokens = query.match(/[\p{L}\p{N}]+/gu) ?? [];
    if (!tokens.length) where.push('0');
    else {
      where.push('j.rowid IN (SELECT rowid FROM jobs_search WHERE jobs_search MATCH ?)');
      values.push(tokens.map(token => `"${token}"*`).join(' AND '));
    }
  }
  const clause = where.length ? ` WHERE ${where.join(' AND ')}` : '';
  const orders = {
    recommended: 'j.employer DESC, j.company COLLATE NOCASE, j.id',
    company: 'j.company COLLATE NOCASE, j.id',
    newest: 'j.first_seen DESC, j.id',
    salary: 'j.salary_annual DESC, j.id',
  };
  const results = await db.batch([
    db.prepare(`SELECT COUNT(*) AS total FROM jobs j${clause}`).bind(...values),
    db.prepare(`SELECT j.summary_json FROM jobs j${clause} ORDER BY ${orders[sort]} LIMIT ? OFFSET ?`).bind(...values, limit, offset),
    db.prepare('SELECT payload_json FROM catalog_meta WHERE id = 1'),
  ]);
  const total = results[0].results[0].total;
  if (!results[2].results[0]) throw new Error('Catalog has not been published');
  const meta = JSON.parse(results[2].results[0].payload_json);
  return {jobs: results[1].results.map(row => JSON.parse(row.summary_json)), total, limit, offset, hasMore: offset + limit < total,
    generatedAt: meta.generatedAt ?? null, version: meta.version ?? null};
}

function validId(id) { return typeof id === 'string' && /^[A-Za-z0-9_-]{1,160}$/.test(id); }

export async function getJob(db, id) {
  if (!validId(id)) throw new CatalogQueryError('Invalid job ID');
  const row = await db.prepare('SELECT payload_json FROM jobs WHERE id = ?').bind(id).first();
  return row ? JSON.parse(row.payload_json) : null;
}

export async function getCatalogMeta(db) {
  const row = await db.prepare('SELECT payload_json FROM catalog_meta WHERE id = 1').first();
  return row ? JSON.parse(row.payload_json) : null;
}
