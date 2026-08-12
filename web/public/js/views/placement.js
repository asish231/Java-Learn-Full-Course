import { h, toast } from '../util.js';
import { pageHeader, pageBody, progressBar, loading, errorBox } from '../shell.js';
import { api } from '../api.js';

const pretty = (value) => String(value).replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

export async function render(root) {
  root.append(pageHeader({ title: 'Placement prep', crumb: 'Evidence beyond DSA', back: '#/' }));
  const body = pageBody(loading('Loading your real placement evidence…'));
  root.append(body);
  await paint(body.firstChild);
}

async function paint(pad) {
  let data;
  try {
    data = await api.placement();
  } catch (err) {
    pad.replaceChildren(errorBox(err.message));
    return;
  }

  const nodes = [h('section', { class: 'hero' },
    h('h2', {}, 'Preparation evidence, not hiring probability'),
    h('p', {}, data.calibration.note),
    h('div', { class: 'dim' }, `${data.calibration.sampleCount} real outcomes recorded · ${data.simulations.length} interview simulations`))];

  nodes.push(h('div', { class: 'section-title mt' }, 'Complete preparation tracks'));
  nodes.push(h('div', { class: 'grid grid-2' }, ...data.tracks.map((track) => trackCard(track, data.briefs || {}, pad))));
  nodes.push(h('div', { class: 'section-title mt' }, 'Interview simulation rubric'));
  nodes.push(simulationCard(data, pad));
  nodes.push(h('div', { class: 'section-title mt' }, 'Log a real interview round'));
  nodes.push(roundCard(data, pad));
  nodes.push(h('div', { class: 'section-title mt' }, 'Application pipeline'));
  nodes.push(applicationCard(pad));
  nodes.push(h('div', { class: 'section-title mt' }, 'Recorded applications'));
  nodes.push(data.applications.length
    ? h('div', { class: 'grid grid-2' }, ...data.applications.slice().reverse().map((row) => h('div', { class: 'card' },
      h('strong', {}, `${row.company} · ${row.role}`), h('p', { class: 'dim' }, `${pretty(row.status)} · ${new Date(row.createdAt).toLocaleDateString()}`))))
    : h('div', { class: 'card dim' }, 'No applications recorded. Add only companies and roles you actually plan to pursue.'));
  pad.replaceChildren(...nodes);
}

function trackCard(track, briefs, pad) {
  const item = h('select', { class: 'input', 'aria-label': `${track.title} item` },
    ...track.items.map((id) => h('option', { value: id }, pretty(id))));
  const rating = h('select', { class: 'input', 'aria-label': `${track.title} evidence rating` },
    h('option', { value: '1' }, '1 · Not started'), h('option', { value: '2' }, '2 · Can explain with help'),
    h('option', { value: '3' }, '3 · Independent evidence'), h('option', { value: '4' }, '4 · Interview-ready explanation'));
  const note = h('textarea', { class: 'input', rows: 2, placeholder: 'Link or describe the real evidence…', 'aria-label': `${track.title} evidence note` });
  const brief = h('p', { class: 'dim mt-s' }, briefs[item.value] || 'Select an item to read what to study.');
  item.addEventListener('change', () => { brief.textContent = briefs[item.value] || 'Select an item to read what to study.'; });
  return h('div', { class: 'card' },
    h('div', { class: 'row' }, h('span', {}, track.icon), h('strong', {}, track.title), h('span', { class: 'spacer' }), h('span', {}, `${track.completedItems}/${track.items.length}`)),
    h('p', { class: 'dim' }, track.description), progressBar(track.percent),
    brief,
    h('div', { class: 'grid mt-s' }, item, rating, note),
    h('button', { class: 'btn btn-sm mt-s', onClick: async () => {
      try {
        await api.addPlacementEvidence({ trackId: track.id, itemId: item.value, rating: Number(rating.value), note: note.value });
        toast('Placement evidence recorded.', 'success');
        await paint(pad);
      } catch (err) { toast(err.message, 'error'); }
    } }, 'Record evidence'));
}

function simulationCard(data, pad) {
  const controls = Object.entries(data.rubric).map(([key, description]) => {
    const select = h('select', { class: 'input', 'aria-label': pretty(key) },
      ...[1, 2, 3, 4].map((value) => h('option', { value: String(value) }, String(value))));
    return { key, select, row: h('label', { class: 'row' }, h('span', {}, pretty(key)), h('span', { class: 'dim' }, description), h('span', { class: 'spacer' }), select) };
  });
  const note = h('textarea', { class: 'input mt-s', rows: 3, placeholder: 'What happened in this real practice interview?', 'aria-label': 'Simulation notes' });
  return h('div', { class: 'card' }, ...controls.map(({ row }) => row), note,
    h('button', { class: 'btn btn-primary mt-s', onClick: async () => {
      try {
        const scores = Object.fromEntries(controls.map(({ key, select }) => [key, Number(select.value)]));
        const saved = await api.addSimulation({ kind: 'mixed', scores, note: note.value });
        toast(`Rubric saved: ${saved.score}% practice performance.`, 'success');
        await paint(pad);
      } catch (err) { toast(err.message, 'error'); }
    } }, 'Save simulation rubric'));
}

function roundCard(data, pad) {
  const stages = data.stages || [];
  const company = h('input', { class: 'input', placeholder: 'Company', 'aria-label': 'Round company' });
  const role = h('input', { class: 'input', placeholder: 'Role', 'aria-label': 'Round role' });
  const stage = h('select', { class: 'input', 'aria-label': 'Interview round stage' },
    ...stages.map((row) => h('option', { value: row.id }, row.title)));
  const controls = Object.entries(data.rubric).map(([key, description]) => {
    const select = h('select', { class: 'input', 'aria-label': `Round ${pretty(key)}` },
      ...[1, 2, 3, 4].map((value) => h('option', { value: String(value) }, String(value))));
    return { key, select, row: h('label', { class: 'row' }, h('span', {}, pretty(key)), h('span', { class: 'dim' }, description), h('span', { class: 'spacer' }), select) };
  });
  const note = h('textarea', { class: 'input mt-s', rows: 2, placeholder: 'What happened in this round?', 'aria-label': 'Round notes' });
  const hint = stages[0] ? h('p', { class: 'dim' }, stages[0].desc) : null;
  if (hint) {
    stage.addEventListener('change', () => {
      const found = stages.find((row) => row.id === stage.value);
      hint.textContent = found ? found.desc : '';
    });
  }
  return h('div', { class: 'card' },
    h('p', { class: 'dim' }, 'Log a round you actually sat — HR screen, DSA, system design, or bar raiser. This is a scorecard, not a prediction.'),
    h('div', { class: 'grid grid-3 mt-s' }, company, role, stage),
    hint,
    ...controls.map(({ row }) => row), note,
    h('button', { class: 'btn mt-s', onClick: async () => {
      try {
        const scores = Object.fromEntries(controls.map(({ key, select }) => [key, Number(select.value)]));
        const saved = await api.addInterviewRound({
          company: company.value, role: role.value, stage: stage.value, scores, note: note.value
        });
        toast(`${saved.passed ? 'Round passed' : 'Round needs work'} · ${saved.score}%.`, 'success');
        await paint(pad);
      } catch (err) { toast(err.message, 'error'); }
    } }, 'Save interview round'));
}

function applicationCard(pad) {
  const company = h('input', { class: 'input', placeholder: 'Company', 'aria-label': 'Application company' });
  const role = h('input', { class: 'input', placeholder: 'Role', 'aria-label': 'Application role' });
  const status = h('select', { class: 'input', 'aria-label': 'Application status' },
    ...['planned', 'applied', 'screen', 'interview', 'offer', 'rejected', 'withdrawn'].map((value) => h('option', { value }, pretty(value))));
  return h('div', { class: 'card' }, h('div', { class: 'grid grid-3' }, company, role, status),
    h('button', { class: 'btn mt-s', onClick: async () => {
      try {
        await api.addApplication({ company: company.value, role: role.value, status: status.value });
        toast('Application recorded.', 'success');
        await paint(pad);
      } catch (err) { toast(err.message, 'error'); }
    } }, 'Add application'));
}
