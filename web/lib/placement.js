/** Placement preparation beyond DSA. Content is static; progress is real learner evidence only. */
const store = require('./store');

const TRACKS = [
  {
    id: 'cs-fundamentals', icon: '🧠', title: 'CS fundamentals',
    description: 'Operating systems, databases, networks, and object-oriented design.',
    items: ['processes-threads', 'memory-concurrency', 'sql-indexes-transactions', 'http-tcp-dns', 'oop-solid']
  },
  {
    id: 'system-design', icon: '🏗️', title: 'System design',
    description: 'Requirements, estimates, APIs, data models, scaling, reliability, and trade-offs.',
    items: ['requirements-estimation', 'api-data-model', 'caching-queues', 'partitioning-replication', 'reliability-observability']
  },
  {
    id: 'behavioral', icon: '🗣️', title: 'Behavioral communication',
    description: 'Concise STAR stories with ownership, conflict, failure, impact, and reflection.',
    items: ['introduction', 'ownership', 'conflict', 'failure-learning', 'impact-leadership']
  },
  {
    id: 'resume-projects', icon: '📄', title: 'Resume and projects',
    description: 'Evidence-led bullets, project depth, architecture decisions, and measurable outcomes.',
    items: ['resume-baseline', 'impact-bullets', 'project-architecture', 'project-tradeoffs', 'portfolio-proof']
  },
  {
    id: 'applications', icon: '📬', title: 'Applications',
    description: 'A truthful pipeline from target research through interview outcome.',
    items: ['target-list', 'tailored-resume', 'referrals', 'follow-ups', 'outcome-review']
  }
];

const RUBRIC = {
  problemFraming: 'Clarifies the problem, constraints, and success criteria.',
  technicalDepth: 'Explains mechanisms and trade-offs rather than naming tools.',
  structure: 'Communicates in a coherent sequence that an interviewer can follow.',
  evidence: 'Uses concrete examples, measurements, or verified project decisions.',
  reflection: 'Identifies limitations and what would be improved next.'
};

const ITEM_BRIEFS = {
  'processes-threads': 'A process is an isolated address space; a thread shares that space with siblings. Interviewers want context-switch cost, when you pick a process (crash isolation, GIL-free parallelism) vs a thread (cheap shared memory), and what a race looks like without a lock.',
  'memory-concurrency': 'Explain heap vs stack, a mutex vs a concurrent collection, and deadlock (wait-for cycle). Have one story: a bug you found with a race, how you reproduced it, and the lock or immutability that fixed it.',
  'sql-indexes-transactions': 'Walk a SELECT with an index (B-tree, covering vs lookup), then isolation: dirty read, non-repeatable read, phantom. Know when you want a transaction vs an idempotent retry, and why SELECT FOR UPDATE exists.',
  'http-tcp-dns': 'DNS → TCP handshake → TLS → HTTP. Say what a 301 vs 302 vs 304 is, why HTTP/2 multiplexes, and where a timeout should live (client, gateway, DB). Draw the packets if asked.',
  'oop-solid': 'SOLID is a checklist, not a religion. Give one class you split because it had two reasons to change, one interface you kept small, and one place inheritance would have been worse than composition.',
  'requirements-estimation': 'Start with users, QPS, payload size, and read/write ratio. Back-of-envelope: 100M users × 10% DAU × 20 requests ≈ 2M req/day ≈ 25 QPS average, spike 10×. Storage = records × bytes × replication. State assumptions out loud.',
  'api-data-model': 'Write the API first: resources, verbs, error bodies, idempotency keys. Then tables or documents, primary keys, and what is denormalized for the hot read. Call out the consistency you are giving up.',
  'caching-queues': 'Cache-aside: read cache, miss → DB → fill. Invalidate on write or set a TTL. Queues absorb spikes and decouple workers; say at-least-once vs exactly-once, and how you make handlers idempotent.',
  'partitioning-replication': 'Partition by a key that spreads load (user id, not created_at). Replication: leader-follower for reads, quorum if you cannot lose writes. Name the failure: hot partition, replication lag, split brain.',
  'reliability-observability': 'SLI/SLO, retries with jitter, circuit breakers, and what you log vs metric vs trace. An interviewer wants the dashboard you would look at at 2am, not a tool name.',
  'introduction': '60 seconds: who you are, the strongest proof you can ship, the role you want, and one sentence on why this company. No life story. Practise until it is boring.',
  'ownership': 'STAR: you noticed the gap, you decided, you shipped, you measured. Use "I" for decisions. If it was a team win, still name the part that would have failed without you.',
  'conflict': 'Disagree on the work, not the person. State their view fairly, the risk you saw, the experiment or data you proposed, and the outcome. Never end on "they were wrong."',
  'failure-learning': 'Pick a real miss. What you believed, what broke, who was affected, the fix, and the system change so it cannot recur. Blame the process you owned, not a teammate.',
  'impact-leadership': 'Leadership here means moving people or a metric without a title. Mentoring, a design review you ran, a rollback you called. Tie it to a number or a decision that stuck.',
  'resume-baseline': 'One page if you have under 10 years. Name, contacts, 3–5 bullets per role, tech that is true. Drop "responsible for." Every bullet should survive "so what?"',
  'impact-bullets': 'Verb + what + constraint + result. "Cut p95 checkout from 1.4s to 160ms by batching an N+1 query on 2M daily orders." If you cannot measure it, describe the decision and who uses it.',
  'project-architecture': 'For each project: users, API, data store, auth, the hardest component you designed. Be ready to redraw it from memory in 3 minutes.',
  'project-tradeoffs': 'Name two designs you rejected and why (latency, cost, complexity, team size). "We used Postgres instead of a graph DB because the access pattern was relational and we had one backend engineer."',
  'portfolio-proof': 'A public repo, a live URL, or a design doc. The interviewer will ask to see code. Pin the README to how to run it and what you would change at 10× traffic.',
  'target-list': '20 companies you can explain in one sentence each. Mix reach, fit, and safety. Track them here — a spreadsheet you never open is not a pipeline.',
  'tailored-resume': 'Mirror the job\'s language only where it is true. Reorder bullets so the first two match the posting. One tailored page beats five generic ones.',
  'referrals': 'Ask a specific person for a specific role with a 5-line blurb they can forward. Do not ask strangers to "see if there is anything."',
  'follow-ups': 'After apply: one polite check-in at 7–10 days. After interview: thank-you that restates one trade-off you discussed. Stop at two pings.',
  'outcome-review': 'Log offer / reject / ghost here. After 10 real outcomes you can compare your own history — still not a hiring probability. Adjust the next application from what actually happened.'
};

function trackById(id) {
  return TRACKS.find((track) => track.id === id);
}

function dashboard() {
  const placement = store.getPlacement();
  const tracks = TRACKS.map((track) => {
    const evidence = placement.evidence.filter((row) => row.trackId === track.id);
    const completed = new Set(evidence.filter((row) => row.rating >= 3).map((row) => row.itemId));
    return {
      ...track,
      evidenceCount: evidence.length,
      completedItems: completed.size,
      percent: track.items.length ? Math.round((completed.size / track.items.length) * 100) : 0,
      nextItem: track.items.find((item) => !completed.has(item)) || null
    };
  });
  const simulations = placement.simulations;
  const outcomes = placement.outcomes;
  return {
    empty: placement.evidence.length === 0 && simulations.length === 0 && placement.applications.length === 0,
    tracks,
    rubric: RUBRIC,
    simulations,
    applications: placement.applications,
    outcomes,
    calibration: {
      sampleCount: outcomes.length,
      status: outcomes.length >= 10 ? 'personal-history-available' : 'insufficient-real-outcomes',
      hiringProbability: null,
      note: outcomes.length >= 10
        ? 'Recommendations may compare your own preparation history; they still do not predict hiring.'
        : 'No hiring prediction is shown. Ten or more real outcomes are required even for personal historical comparison.'
    },
    briefs: ITEM_BRIEFS,
    stages: INTERVIEW_STAGES
  };
}

function addEvidence({ trackId, itemId, rating, note = '' } = {}) {
  const track = trackById(trackId);
  const numeric = Number(rating);
  if (!track || !track.items.includes(itemId)) throw new Error('Choose a valid placement track item.');
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 4) throw new Error('Evidence rating must be from 1 to 4.');
  return store.addPlacementRecord('evidence', {
    trackId, itemId, rating: numeric, note: String(note).trim().slice(0, 1000)
  });
}

function addApplication({ company, role, status = 'planned', url = '', note = '' } = {}) {
  const statuses = ['planned', 'applied', 'screen', 'interview', 'offer', 'rejected', 'withdrawn'];
  if (!String(company || '').trim() || !String(role || '').trim()) throw new Error('Company and role are required.');
  if (!statuses.includes(status)) throw new Error('Unknown application status.');
  return store.addPlacementRecord('applications', {
    company: String(company).trim().slice(0, 120),
    role: String(role).trim().slice(0, 120), status,
    url: String(url).trim().slice(0, 500), note: String(note).trim().slice(0, 1000)
  });
}

function addSimulation({ kind = 'mixed', scores = {}, note = '' } = {}) {
  const values = Object.keys(RUBRIC).map((key) => Number(scores[key]));
  if (values.some((value) => !Number.isInteger(value) || value < 1 || value > 4)) {
    throw new Error('Every interview rubric dimension requires a score from 1 to 4.');
  }
  const score = Math.round((values.reduce((sum, value) => sum + value, 0) / (values.length * 4)) * 100);
  return store.addPlacementRecord('simulations', {
    kind: String(kind).slice(0, 40), scores: Object.fromEntries(Object.keys(RUBRIC).map((key, index) => [key, values[index]])),
    score, note: String(note).trim().slice(0, 2000)
  });
}

const INTERVIEW_STAGES = [
  { id: 'HR_SCREENING', title: '1. HR & Resume Screening', desc: 'Behavioral alignment, background, and candidate story.' },
  { id: 'TECH_SCREENING', title: '2. Technical DSA Screening', desc: 'Timed Data Structures & Algorithms coding under constraints.' },
  { id: 'SYSTEM_DESIGN', title: '3. System & Object Design', desc: 'Requirements, APIs, data modeling, and trade-off analysis.' },
  { id: 'BAR_RAISER', title: '4. Bar Raiser & Debrief', desc: 'Deep technical reflection, leadership, and final decision.' }
];

function addInterviewRound({ company, role, stage = 'HR_SCREENING', scores = {}, note = '' } = {}) {
  const stageIds = INTERVIEW_STAGES.map((s) => s.id);
  if (!stageIds.includes(stage)) throw new Error('Choose a valid interview round stage.');
  if (!String(company || '').trim() || !String(role || '').trim()) throw new Error('Company and role are required.');
  
  const values = Object.keys(RUBRIC).map((key) => Number(scores[key]));
  if (values.some((v) => !Number.isInteger(v) || v < 1 || v > 4)) {
    throw new Error('Every interview rubric dimension requires a score from 1 to 4.');
  }
  const avgScore = values.reduce((sum, v) => sum + v, 0) / values.length;
  const passed = avgScore >= 3.0;
  
  return store.addPlacementRecord('simulations', {
    kind: `round_${stage}`,
    stage,
    company: String(company).trim().slice(0, 120),
    role: String(role).trim().slice(0, 120),
    scores: Object.fromEntries(Object.keys(RUBRIC).map((key, index) => [key, values[index]])),
    score: Math.round((avgScore / 4) * 100),
    passed,
    note: String(note).trim().slice(0, 2000)
  });
}

function addOutcome({ company, role, result, applicationId = null, note = '' } = {}) {
  if (!['offer', 'rejected', 'withdrawn', 'no-response'].includes(result)) throw new Error('Choose a real application outcome.');
  if (!String(company || '').trim() || !String(role || '').trim()) throw new Error('Company and role are required.');
  return store.addPlacementRecord('outcomes', {
    company: String(company).trim().slice(0, 120), role: String(role).trim().slice(0, 120),
    result, applicationId, note: String(note).trim().slice(0, 1000)
  });
}

module.exports = { TRACKS, RUBRIC, INTERVIEW_STAGES, ITEM_BRIEFS, dashboard, addEvidence, addApplication, addSimulation, addOutcome, addInterviewRound };