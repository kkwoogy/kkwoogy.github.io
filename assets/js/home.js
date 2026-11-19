// Home, in this order: what this place is (the hero, then one statement that lights up word by word as it is
// read), the areas, then the newest work in a row you can slide. Everything below the statement comes from works.js.
import { AREAS, WORKS, sorted } from './works.js';
import { root, reveal } from './chrome.js';

const list = sorted();
const pic = x => `<span class="pic${x.photo ? ' photo' : ''}"><img src="${root}${x.img}" alt="" loading="lazy"></span>`;

// the newest work, one line under the nav
const ribbon = document.getElementById('ribbon');
if (ribbon && list[0]) ribbon.innerHTML = `최근 작업<a class="go" href="${root}${list[0].page}">${list[0].title}</a>`;

// areas
document.getElementById('area-tiles').innerHTML = AREAS.map(a =>
  `<a class="area-tile" href="${root}${a.id}/"><h3>${a.name}</h3><p>${a.note}</p><span class="go">둘러보기</span>${pic(a)}</a>`).join('');

// newest works
const SHOW = 8;
const gal = document.getElementById('gallery');
gal.innerHTML = list.slice(0, SHOW).map(w => {
  const a = AREAS.find(x => x.id === w.area);
  return `<a class="card" href="${root}${w.page}"><small>${a.name}</small><h3>${w.title}</h3><p class="st">${w.status}</p>${pic(w)}</a>`;
}).join('');
const [back, fwd] = document.querySelectorAll('.paddles button');
const by = () => (gal.firstElementChild?.offsetWidth || 372) + 20;
back.addEventListener('click', () => gal.scrollBy({ left: -by(), behavior: 'smooth' }));
fwd.addEventListener('click', () => gal.scrollBy({ left: by(), behavior: 'smooth' }));
const ends = () => { back.disabled = gal.scrollLeft < 4; fwd.disabled = gal.scrollLeft + gal.clientWidth > gal.scrollWidth - 4; };
gal.addEventListener('scroll', ends, { passive: true }); addEventListener('resize', ends); ends();
if (gal.scrollWidth <= gal.clientWidth + 4) document.querySelector('.paddles').hidden = true;

reveal(document.querySelectorAll('.head, .area-tile, .card, .duo > a'));

// the statement: each word turns white as the paragraph moves up the screen
const st = document.querySelector('.statement p');
if (st) {
  const words = [];
  const split = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) { frag.append(t); return; }
        const s = document.createElement('span'); s.className = 'w'; s.textContent = t; words.push(s); frag.append(s);
      });
      n.replaceWith(frag);
    } else split(n);
  });
  split(st);
  let lit = -1;
  const paint = () => {
    const r = st.getBoundingClientRect(), h = innerHeight;
    const k = Math.min(1, Math.max(0, (h * 0.82 - r.top) / (r.height + h * 0.3)));
    const n = Math.round(k * words.length);
    if (n === lit) return;
    lit = n; words.forEach((w, j) => w.classList.toggle('lit', j < n));
  };
  addEventListener('scroll', paint, { passive: true }); addEventListener('resize', paint); paint();
}
