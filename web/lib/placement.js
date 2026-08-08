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
    }
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

function addOutcome({ company, role, result, applicationId = null, note = '' } = {}) {
  if (!['offer', 'rejected', 'withdrawn', 'no-response'].includes(result)) throw new Error('Choose a real application outcome.');
  if (!String(company || '').trim() || !String(role || '').trim()) throw new Error('Company and role are required.');
  return store.addPlacementRecord('outcomes', {
    company: String(company).trim().slice(0, 120), role: String(role).trim().slice(0, 120),
    result, applicationId, note: String(note).trim().slice(0, 1000)
  });
}

module.exports = { TRACKS, RUBRIC, dashboard, addEvidence, addApplication, addSimulation, addOutcome };