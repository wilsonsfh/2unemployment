import {createHash} from 'node:crypto';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const sql = value => value === null || value === undefined ? 'NULL' : typeof value === 'number' ? String(value) : `'${String(value).replaceAll("'", "''")}'`;
const hash = value => createHash('sha256').update(value).digest('hex');

export function buildCatalogImport(feed) {
  if (!feed || !Array.isArray(feed.jobs) || !Array.isArray(feed.sources) || !Number.isFinite(Date.parse(feed.generatedAt))) {
    throw new Error('Catalog requires jobs, sources, and a valid generatedAt');
  }
  if (!feed.jobs.length) throw new Error('Refusing to publish an empty catalog');
  const ids = new Set();
  const statements = ['-- D1 owns the file transaction. Do not add BEGIN/COMMIT.'];
  // A stale publication violates the singleton CHECK before changing any jobs.
  statements.push(`INSERT INTO catalog_meta(id, payload_json) SELECT 0, '{}' WHERE EXISTS (SELECT 1 FROM catalog_meta WHERE julianday(json_extract(payload_json, '$.generatedAt')) > julianday(${sql(feed.generatedAt)}));`);
  for (const job of feed.jobs) {
    if (!job || !/^[A-Za-z0-9_-]{1,160}$/.test(job.id) || ids.has(job.id)) throw new Error('Invalid or duplicate job ID');
    ids.add(job.id);
    if (!job.company || !job.title || !['listed', 'closed'].includes(job.status) || !['explicit', 'review'].includes(job.eligibility) ||
        !Number.isFinite(Date.parse(job.firstSeen)) || !Array.isArray(job.cohort) || !Array.isArray(job.tags) ||
        job.cohort.some(year => !/^20\d{2}$/.test(year)) || (job.salary && (!Number.isFinite(job.salary.annual) || job.salary.annual < 0))) {
      throw new Error(`Invalid catalog job: ${job.id}`);
    }
    const {description, requirements, ...summary} = job;
    summary.requirementsCount = Array.isArray(requirements) ? requirements.length : 0;
    const {firstSeen, ...content} = job;
    const queue = job.status === 'closed' ? 'closed' : job.eligibility === 'explicit' ? 'graduate' : 'review';
    const employer = Number(['employer-api', 'employer-page'].includes(job.sourceType));
    const values = [job.id, job.company, job.title, queue, employer, job.salary?.kind, job.salary?.annual, job.firstSeen,
      `${job.company} ${job.title} ${job.tags.join(' ')}`, hash(JSON.stringify(content)), JSON.stringify(job), JSON.stringify(summary)];
    statements.push(`INSERT INTO jobs (id, company, title, queue, employer, salary_kind, salary_annual, first_seen, search_text, payload_hash, payload_json, summary_json)
VALUES (${values.map(sql).join(', ')})
ON CONFLICT(id) DO UPDATE SET company=excluded.company, title=excluded.title, queue=excluded.queue, employer=excluded.employer,
 salary_kind=excluded.salary_kind, salary_annual=excluded.salary_annual, search_text=excluded.search_text, payload_hash=excluded.payload_hash,
 payload_json=json_set(excluded.payload_json, '$.firstSeen', jobs.first_seen), summary_json=json_set(excluded.summary_json, '$.firstSeen', jobs.first_seen)
WHERE jobs.payload_hash <> excluded.payload_hash;`);
    // Reconcile projected cohorts from the persisted row, also for unchanged jobs.
    statements.push(`DELETE FROM job_cohorts WHERE job_id=${sql(job.id)} AND cohort NOT IN (SELECT value FROM json_each((SELECT payload_json FROM jobs WHERE id=${sql(job.id)}), '$.cohort'));`);
    for (const year of new Set(job.cohort)) statements.push(`INSERT OR IGNORE INTO job_cohorts(job_id, cohort) VALUES (${sql(job.id)}, ${sql(year)});`);
  }
  const metadata = {version: hash(JSON.stringify(feed)), generatedAt: feed.generatedAt, sources: feed.sources};
  statements.push(`INSERT INTO catalog_meta(id, payload_json) VALUES (1, ${sql(JSON.stringify(metadata))}) ON CONFLICT(id) DO UPDATE SET payload_json=excluded.payload_json;`);
  statements.push(`UPDATE catalog_meta SET payload_json=json_set(payload_json,
 '$.stats', json((SELECT json_object('total', COUNT(*), 'graduate', SUM(queue='graduate'), 'review', SUM(queue='review'), 'closed', SUM(queue='closed'),
  'companies', COUNT(DISTINCT CASE WHEN queue='graduate' THEN company END), 'employerGraduate', SUM(queue='graduate' AND employer=1)) FROM jobs)),
 '$.cohorts', json((SELECT json_group_array(cohort) FROM (SELECT DISTINCT cohort FROM job_cohorts ORDER BY cohort))),
 '$.salaryBenchmarks', json((SELECT json_group_array(json(summary_json)) FROM (SELECT summary_json FROM jobs WHERE queue='graduate' AND salary_kind='estimate' GROUP BY company ORDER BY salary_annual DESC, company)))
) WHERE id=1;`);
  // Keep the last 20 previous payloads per job, for at most 90 days.
  statements.push("DELETE FROM job_history WHERE changed_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-90 days');");
  statements.push('DELETE FROM job_history WHERE history_id IN (SELECT history_id FROM (SELECT history_id, row_number() OVER (PARTITION BY job_id ORDER BY history_id DESC) AS position FROM job_history) WHERE position > 20);');
  return `${statements.join('\n')}\n`;
}

async function main() {
  const args = process.argv.slice(2);
  const options = {input: 'public/data/jobs.json', output: '.wrangler/catalog-import.sql'};
  while (args.length) {
    const key = args.shift();
    if (!['--input', '--output'].includes(key) || !args[0]) throw new Error('Usage: node scripts/catalog-import.mjs [--input snapshot.json] [--output import.sql]');
    options[key.slice(2)] = args.shift();
  }
  const feed = JSON.parse(await readFile(options.input, 'utf8'));
  const output = buildCatalogImport(feed);
  await mkdir(dirname(options.output), {recursive: true});
  await writeFile(options.output, output);
  console.log(`Prepared ${feed.jobs.length} catalog records at ${options.output}. Apply with wrangler d1 execute <database> --local|--remote --file ${options.output}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
