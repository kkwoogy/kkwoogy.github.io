// What every page shares: the global nav, the footer, and things fading up as they are scrolled to.
// The nav and footer list the areas in works.js, so a new area shows up in both on its own.
// A page says where it is with <body data-area="id">, <body data-work="id"> or <body data-page="about">.
import { AREAS, WORKS, area, BLOG, GITHUB } from './works.js';

export const root = new URL('../../', import.meta.url).href;
// on this computer, show the places still to fill in (dashed boxes); the published site hides them
if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) document.documentElement.classList.add('dev');
const here = document.body.dataset;
const work = WORKS.find(w => w.id === here.work);
const at = here.area || (work && work.area) || here.page || '';
const logo = 'MODE<i>Lab</i>';

const nav = document.querySelector('.gnav');
if (nav) {
  const items = [...AREAS.map(a => [a.name, `${root}${a.id}/`, a.id]), ['소개', `${root}about.html`, 'about'], ['블로그', BLOG, '']];
  nav.innerHTML = `<div class="in"><a class="logo" href="${root}" aria-label="MODE Lab 홈">${logo}</a>`
    + `<ul class="links">${items.map(([t, h, id]) => `<li><a href="${h}"${id && id === at ? ' class="on" aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul>`
    + `<button class="menu" type="button" aria-label="메뉴 열기" aria-expanded="false"><i></i><i></i></button></div>`;
  const btn = nav.querySelector('.menu');
  const set = open => {
    nav.classList.toggle('open', open); document.documentElement.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  matchMedia('(min-width: 835px)').addEventListener('change', e => { if (e.matches) set(false); });
}

const foot = document.querySelector('.foot');
if (foot) {
  const a = area(here.area || (work && work.area));
  const trail = [[`<span class="logo">${logo}</span>`, root]];
  if (a) trail.push([a.name, work ? `${root}${a.id}/` : '']);
  if (work) trail.push([work.title, '']);
  if (here.page === 'about') trail.push(['소개', '']);
  const link = ([t, h]) => h ? `<a href="${h}">${t}</a>` : `<span>${t}</span>`;
  foot.innerHTML = `<div class="in">`
    + `<nav class="trail" aria-label="위치">${trail.map(link).join('<i>›</i>')}</nav>`
    + `<div class="dir">`
    + `<div><h4>분야</h4><ul>${AREAS.map(x => `<li><a href="${root}${x.id}/">${x.name}</a></li>`).join('')}</ul></div>`
    + `<div><h4>MODE Lab</h4><ul><li><a href="${root}about.html">소개</a></li><li><a href="${BLOG}">블로그</a></li><li><a href="${GITHUB}">GitHub</a></li></ul></div>`
    + `</div><p class="tm">iMac, iOS, Apple Music은 Apple Inc.의 상표입니다. MODE Lab은 Apple과 관계없는 개인 사이트입니다.</p>`
    + `<div class="legal"><span>Copyright © ${new Date().getFullYear()} 경욱. 모든 권리 보유.</span></div></div>`;
}

// Fade up as they come into view. Marked here rather than in the markup, so without this script nothing stays hidden.
const io = 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches
  ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' })
  : null;
export function reveal(els, step = 0.08) {
  if (!io) return;
  [...els].forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return; // already on screen: leave it be
    el.classList.add('reveal');
    const i = [...el.parentNode.children].indexOf(el); // things side by side come up one after another
    if (step) el.style.setProperty('--d', `${((i % 4) * step).toFixed(2)}s`);
    io.observe(el);
  });
}
reveal(document.querySelectorAll('.sec > *:not(.tiles):not(.pair)'), 0);
reveal(document.querySelectorAll('.tiles > *, .pair > *'));
