// Shared 3D stage for the work pages: one dark studio, one family of materials,
// CAD parts loaded from one packed file per object, drag to turn, parts that spread apart, and labels that follow parts.
import * as THREE from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
export { THREE };

export const BG = '#000000';

export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch { return false; }
}

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// A black room with soft boxes for the clay sheen, and a cool rim light that cuts the outline out of the black.
// On tall, narrow screens the camera backs off so an object `span` units wide still fits across.
export function createStage(canvas, { fov = 22, dist = 7.2, span = 2.3 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(BG);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, 0, dist);

  const room = new THREE.Scene();
  const panel = (w, h, p, I) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(I), side: THREE.DoubleSide }));
    m.position.set(...p); m.lookAt(0, 0, 0); room.add(m);
  };
  panel(8, 8, [0, 6, 1], 2.2); panel(1.4, 7, [-6, 1, 3], 3.6); panel(1.4, 7, [6, 2, -3], 5.5); panel(9, 2, [0, 0.5, 7], 0.25);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.85;
  const key = new THREE.DirectionalLight('#ffffff', 1.6); key.position.set(-3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight('#dfe6ff', 2.4); rim.position.set(4, 2, -5); scene.add(rim);
  // a soft light from the viewer's side, so the face turned toward you does not go dull on the black page
  const fill = new THREE.DirectionalLight('#ffffff', 0.55); fill.position.set(1, 0.6, 6); scene.add(fill);

  // keep the drawing buffer the size of the canvas element; offset(w, h) may shift the picture inside it
  const fit = (offset) => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = Math.max(dist, span / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * camera.aspect));
    const o = offset ? offset(w, h) : null;
    if (o) camera.setViewOffset(w, h, o[0], o[1], w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  return { renderer, scene, camera, fit };
}

// One family of materials, so every project reads as part of one set. Each mesh gets its own copy,
// so a case page can fade the parts it is not talking about.
const MAT = {
  clay: () => new THREE.MeshPhysicalMaterial({ color: '#d7d5d0', roughness: 0.55, clearcoat: 0.12, clearcoatRoughness: 0.5, sheen: 0.25, sheenRoughness: 0.8 }),
  graphite: () => new THREE.MeshPhysicalMaterial({ color: '#2a2a2c', roughness: 0.62, clearcoat: 0.08 }),
  part: () => new THREE.MeshStandardMaterial({ color: '#6c6c70', roughness: 0.7 }),
  gloss: () => new THREE.MeshPhysicalMaterial({ color: '#0b0b0d', roughness: 0.12, clearcoat: 1 }),
  glass: () => new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.95, roughness: 0.04, thickness: 1, ior: 1.5 }),
  frost: () => new THREE.MeshPhysicalMaterial({ color: '#f4f4f4', transmission: 0.9, roughness: 0.38, thickness: 2.2, ior: 1.46, clearcoat: 0.4 }),
};

// Each object is one file of simplified, grid-snapped parts (made by studio/bake_web.py, which documents the layout):
// light to load, and deliberately too coarse to print and assemble. Curves are shaded smooth, edges sharper than
// CREASE stay crisp.
const CREASE = THREE.MathUtils.degToRad(35);
async function readPack(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  const buf = await res.arrayBuffer();
  const n = new DataView(buf).getUint32(0, true);
  const head = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, n)).replace(/\0+$/, ''));
  const out = new Map();
  let at = 4 + n;
  for (const p of head.parts) {
    const q = new Int16Array(buf, at, p.v * 3); at += (p.v * 6 + 3) & ~3;
    const I = p.v > 65535 ? Uint32Array : Uint16Array;
    const idx = new I(buf, at, p.t * 3); at += (p.t * 3 * I.BYTES_PER_ELEMENT + 3) & ~3;
    const pos = new Float32Array(q.length);
    for (let i = 0; i < q.length; i++) pos[i] = q[i] * head.step;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1));
    out.set(p.name, toCreasedNormals(g, CREASE));
  }
  return out;
}

// Center the group and scale it so every object sits at the same size; wrap it in a pivot to turn.
function mount(inner, size) {
  const b = new THREE.Box3().setFromObject(inner), c = b.getCenter(new THREE.Vector3());
  inner.position.sub(c);
  const outer = new THREE.Group(); outer.add(inner); outer.scale.setScalar(size / b.getSize(new THREE.Vector3()).length());
  const pivot = new THREE.Group(); pivot.add(outer);
  return pivot;
}

export async function loadModel(def, { root = '', size = 1.85, onPart } = {}) {
  const inner = new THREE.Group(), items = [], geo = await readPack(root + def.pack);
  for (const [name, m, o] of def.parts) {
    const g = geo.get(name);
    g.computeBoundingBox();
    onPart && onPart();
    const mesh = new THREE.Mesh(g, MAT[m]());
    if (def.zUp) mesh.rotation.x = -Math.PI / 2;
    if (o.rx) mesh.rotation.x += THREE.MathUtils.degToRad(o.rx);
    const h = new THREE.Group(); h.add(mesh);
    if (o.o) h.position.set(...o.o);
    items.push({ h, mesh, base: h.position.clone(), ex: new THREE.Vector3(...(o.ex || [0, 0, 0])), g: o.g, label: o.label, side: o.side,
      center: g.boundingBox.getCenter(new THREE.Vector3()), f: 1 });
    inner.add(h);
  }
  return { pivot: mount(inner, size), items, def, explodable: true };
}

// Place the model: rotation, overall scale, and how far apart its parts are (0 together, 1 fully apart).
export function pose(model, { yaw = 0, pitch = 0, scale = 1, x = 0, y = 0, explode = 0 }) {
  model.pivot.rotation.set(pitch, yaw, 0, 'YXZ');
  model.pivot.scale.setScalar(Math.max(scale, 0.001));
  model.pivot.position.set(x, y, 0);
  for (const it of model.items) it.h.position.copy(it.base).addScaledVector(it.ex, explode);
}

// Fade every part outside the given groups (null = show all). Call each frame; it eases on its own.
export function focus(model, groups, raw) {
  const k = Math.min(1, raw * 6);
  for (const it of model.items) {
    const want = !groups || groups.includes(it.g) ? 1 : 0;
    it.f += (want - it.f) * k;
    const m = it.mesh.material, ghost = it.f < 0.995;
    m.transparent = ghost; m.opacity = 0.06 + 0.94 * it.f; m.depthWrite = it.f > 0.5;
    if (m.userData.ghost !== ghost) { m.userData.ghost = ghost; m.needsUpdate = true; }
  }
}

// Small names beside the parts in focus. The layer must cover the canvas exactly.
export function partLabels(layer, model, camera) {
  const tags = model.items.filter(it => it.label).map(it => {
    const el = document.createElement('div'); el.className = 'tag';
    el.innerHTML = `<i></i><span>${it.label}</span>`;
    layer.appendChild(el);
    return { it, el };
  });
  const v = new THREE.Vector3(), mid = new THREE.Vector3();
  return function update(groups) {
    const w = layer.clientWidth, h = layer.clientHeight;
    model.pivot.updateMatrixWorld(true);
    mid.setFromMatrixPosition(model.pivot.matrixWorld).project(camera);
    const placed = [];
    for (const t of tags) {
      const { it, el } = t, on = groups && groups.includes(it.g);
      v.copy(it.center).applyMatrix4(it.mesh.matrixWorld).project(camera);
      const x = (v.x + 1) / 2 * w, y = (1 - v.y) / 2 * h;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      // a name that would run off the canvas goes on the other side of its dot
      const sw = t.sw || (t.sw = el.lastChild.offsetWidth) || 80;
      let left = it.side ? it.side === 'l' : v.x < mid.x;
      if (left && x - 32 - sw < 6) left = false; else if (!left && x + 32 + sw > w - 6) left = true;
      // names that would sit on top of each other (small screens) move apart; the dot stays on its part
      let ty = y;
      if (on) {
        const x0 = left ? x - 32 - sw : x + 32, x1 = x0 + sw;
        for (const p of placed) if (x0 < p.x1 && p.x0 < x1 && Math.abs(ty - p.y) < 18) ty = p.y + (ty >= p.y ? 18 : -18);
        placed.push({ x0, x1, y: ty });
      }
      el.lastChild.style.top = `${(ty - y - 10).toFixed(1)}px`;
      el.classList.toggle('left', left);
      el.classList.toggle('on', !!on);
    }
  };
}

// Drag to turn with a little inertia. state.yaw / state.pitch are offsets the page adds to its own view.
export function orbit(el, { pitchLimit = 0.9, onDown, onUp } = {}) {
  const s = { yaw: 0, pitch: 0, vy: 0, vp: 0, drag: null, last: -1e9 };
  el.addEventListener('pointerdown', e => {
    s.drag = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, id: e.pointerId };
    el.setPointerCapture(e.pointerId); el.classList.add('drag');
    s.vy = s.vp = 0; s.moved = 0; s.last = performance.now(); onDown && onDown(e);
  });
  el.addEventListener('pointermove', e => {
    if (!s.drag) return;
    const dx = e.clientX - s.drag.x, dy = e.clientY - s.drag.y;
    s.vy = dx * 0.006; s.vp = dy * 0.004;
    s.yaw += s.vy; s.pitch = THREE.MathUtils.clamp(s.pitch + s.vp, -pitchLimit, pitchLimit);
    s.drag.x = e.clientX; s.drag.y = e.clientY; s.last = performance.now();
    s.moved = Math.hypot(e.clientX - s.drag.x0, e.clientY - s.drag.y0);
  });
  const up = () => { if (!s.drag) return; s.drag = null; el.classList.remove('drag'); onUp && onUp(); };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  s.step = () => { if (!s.drag) { s.yaw += s.vy; s.pitch += s.vp; s.vy *= 0.94; s.vp *= 0.9; } };
  return s;
}

export const ease = t => t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3);
export const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
