// Work page with a pinned model. Each .step says how far apart the parts should be (data-x, 0 to 1), which groups
// to point at (data-f, space-separated), and an optional turn (data-yaw, data-pitch).
// On wide screens the first step is the hero: the object sits small under the centered title. After that it moves
// to the right of the stage and the step text comes up on the left. On narrow screens the stage is the top half.
import { createStage, loadModel, pose, focus, partLabels, orbit, wrap, webglOK, reducedMotion } from './stage.js';
import { MODELS } from './models.js';

const stageEl = document.getElementById('stage');
const steps = [...document.querySelectorAll('.step')];
const wide = () => innerWidth > 900;
let active = steps[0];
function pick() {
  const line = innerHeight * (wide() ? 0.6 : 0.82);
  let a = steps[0];
  for (const s of steps) if (s.getBoundingClientRect().top < line) a = s;
  if (a !== active) { active.classList.remove('on'); active = a; }
  a.classList.add('on');
  stageEl.querySelector('.hint').style.opacity = a === steps[0] ? 1 : 0;
}
addEventListener('scroll', pick, { passive: true }); pick();

if (!webglOK()) stageEl.classList.add('static');
else run().catch(e => { console.error(e); stageEl.classList.add('static'); });

async function run() {
  const def = MODELS[stageEl.dataset.model];
  const canvas = stageEl.querySelector('canvas'), bar = stageEl.querySelector('.load');
  const { renderer, scene, camera, fit } = createStage(canvas);
  let n = 0;
  const model = await loadModel(def, { root: '../', onPart: () => { bar.style.width = (++n / def.parts.length * 100) + '%'; } });
  scene.add(model.pivot);
  const tags = partLabels(stageEl.querySelector('.tags'), model, camera);
  const orb = orbit(canvas);
  new ResizeObserver(() => fit()).observe(stageEl); fit();

  // only draw while the stage is on screen
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stageEl);

  // ox / oy: where the object sits on the stage, as a share of its width / height; s: its size on the first step
  const cur = { x: 0, yaw: 0, pitch: 0, ox: 0, oy: wide() ? 0.17 : 0, s: wide() ? 0.74 : 1 };
  let drift = 0, last = performance.now();
  stageEl.classList.add('ready');
  renderer.setAnimationLoop(() => {
    const now = performance.now(), raw = Math.min(0.1, (now - last) / 1000); last = now;
    if (!visible) return;
    const d = active.dataset, k = Math.min(1, raw * 2.6), hero = active === steps[0], W = wide();
    const groups = d.f ? d.f.split(' ') : null;
    cur.x += ((+d.x || 0) - cur.x) * k;
    cur.yaw += ((+d.yaw || 0) - cur.yaw) * k;
    cur.pitch += ((+d.pitch || 0) - cur.pitch) * k;
    cur.ox += ((W && !hero ? 0.2 : 0) - cur.ox) * k;
    cur.oy += ((W && hero ? 0.17 : 0) - cur.oy) * k;
    cur.s += ((W && hero ? 0.74 : 1) - cur.s) * k;

    // a turn by hand drifts back to the step's own view after a moment
    orb.step();
    if (!orb.drag && now - orb.last > 2200) { const r = Math.min(1, raw * 1.6); orb.yaw = wrap(orb.yaw) * (1 - r); orb.pitch *= 1 - r; }
    if (!reducedMotion && hero && !orb.drag) drift += raw * 0.12;
    else drift = wrap(drift) * (1 - Math.min(1, raw * 1.6));

    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.setViewOffset(w, h, -cur.ox * w, -cur.oy * h, w, h); camera.updateProjectionMatrix();
    pose(model, { yaw: def.yaw + cur.yaw + orb.yaw + drift, pitch: def.pitch + cur.pitch + orb.pitch, explode: cur.x, scale: cur.s * (1 - 0.3 * cur.x), y: -0.12 * cur.x });
    focus(model, groups, raw);
    renderer.render(scene, camera);
    tags(groups);
  });
}
