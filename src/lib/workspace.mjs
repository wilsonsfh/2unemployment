export const PAGE_SIZE = 25;
const views = ['jobs', 'saved', 'salaries', 'sources'];
const queues = ['graduate', 'review', 'closed'];
const sorts = ['recommended', 'company', 'newest', 'salary'];
export function parseWorkspaceState(search = '') {
 const params = new URLSearchParams(search);
 const page = Number(params.get('page'));
 return {
  view: views.includes(params.get('view')) ? params.get('view') : 'jobs',
  query: (params.get('q') || '').slice(0, 100),
  queue: queues.includes(params.get('queue')) ? params.get('queue') : 'graduate',
  cohort: /^20\d{2}$/.test(params.get('cohort') || '') ? params.get('cohort') : 'all',
  salaryOnly: params.get('salary') === 'known',
  employerOnly: params.get('employer') === 'true',
  sort: sorts.includes(params.get('sort')) ? params.get('sort') : 'recommended',
  unit: params.get('unit') === 'month' ? 'month' : 'year',
  page: Number.isSafeInteger(page) && page > 0 && page <= 401 ? page : 1,
 };
}
export function workspaceSearch(state) {
 const params = new URLSearchParams();
 if (state.view !== 'jobs') params.set('view', state.view);
 if (state.query) params.set('q', state.query);
 if (state.queue !== 'graduate') params.set('queue', state.queue);
 if (state.cohort !== 'all') params.set('cohort', state.cohort);
 if (state.salaryOnly) params.set('salary', 'known');
 if (state.employerOnly) params.set('employer', 'true');
 if (state.sort !== 'recommended') params.set('sort', state.sort);
 if (state.unit !== 'year') params.set('unit', state.unit);
 if (state.page > 1) params.set('page', String(state.page));
 return params.toString();
}
export function updateWorkspaceState(state, patch) {
 const changesResults = ['view', 'query', 'queue', 'cohort', 'salaryOnly', 'employerOnly', 'sort'].some(key => key in patch && patch[key] !== state[key]);
 return {...state, ...patch, ...(changesResults ? {page: 1} : {})};
}
export function jobsSearch(state) {
 const params = new URLSearchParams({queue: state.queue, sort: state.sort, limit: String(PAGE_SIZE), offset: String((state.page - 1) * PAGE_SIZE)});
 if (state.query) params.set('q', state.query);
 if (state.cohort !== 'all') params.set('cohort', state.cohort);
 if (state.salaryOnly) params.set('salary', 'known');
 if (state.employerOnly) params.set('employer', 'true');
 return params.toString();
}
export function savedIdChunks(ids) {
 const unique = [...new Set(ids)];
 return Array.from({length: Math.ceil(unique.length / 50)}, (_, i) => unique.slice(i * 50, (i + 1) * 50));
}
export function compareJobs(sort) {
 const employer = job => Number(job.sourceType === 'employer-api' || job.sourceType === 'employer-page');
 return (a, b) => (sort === 'salary' ? (b.salary?.annual || 0) - (a.salary?.annual || 0) : sort === 'company' ? a.company.localeCompare(b.company) : sort === 'newest' ? b.firstSeen.localeCompare(a.firstSeen) : employer(b) - employer(a) || a.company.localeCompare(b.company)) || a.id.localeCompare(b.id);
}

export function workspaceHistoryMethod(patch) {
 return Object.keys(patch).length === 1 && 'query' in patch ? 'replaceState' : 'pushState';
}
export function pageSnapshot(pages) {
 const first = pages[0];
 return first?.version && pages.every(page => page.version === first.version)
  ? {version:first.version, generatedAt:first.generatedAt} : {};
}
