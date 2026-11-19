// Fills in the parts of a work page that come from works.js, so every work page has the same frame:
// the local nav (name, the page's sections, blog), the area link above the title, the details line,
// and two other works at the end. The page names itself with <body data-work="id">; sections that
// should appear in the local nav carry data-nav="짧은 이름".
import { sorted, area, BLOG } from './works.js';
import { root, reveal } from './chrome.js';

const list = sorted(), i = list.findIndex(w => w.id === document.body.dataset.work), w = list[i];
const pic = x => `<span class="pic${x.photo ? ' photo' : ''}"><img src="${root}${x.img}" alt="" loading="lazy"></span>`;

if (w) {
  const a = area(w.area);

  const lnav = document.querySelector('.lnav');
  const secs = [...document.querySelectorAll('[data-nav][id]')];
  if (lnav) {
    lnav.innerHTML = `<div class="in"><b><a href="#">${w.title}</a></b><div class="to">`
      + secs.map(s => `<a href="#${s.id}">${s.dataset.nav}</a>`).join('')
      + `<a class="pill" href="${BLOG}">블로그</a></div></div>`;
    // the section being read is lit in the local nav
    const links = [...lnav.querySelectorAll('.to > a:not(.pill)')];
    const mark = () => {
      let k = -1;
      secs.forEach((s, j) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) k = j; });
      links.forEach((l, j) => l.classList.toggle('on', j === k));
    };
    addEventListener('scroll', mark, { passive: true }); mark();
  }

  const crumb = document.querySelector('.crumb');
  if (crumb) crumb.innerHTML = `<a href="${root}${a.id}/">${a.name}</a>`;
  const meta = document.querySelector('[data-meta]');
  if (meta) meta.textContent = [w.context, w.when, w.status].filter(Boolean).join(' · ');

  const more = document.querySelector('.more-works');
  if (more && list.length > 1) {
    const prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
    const tile = (x, label) => `<a href="${root}${x.page}"><small>${label} · ${area(x.area).name}</small><b>${x.title}</b><span class="go">더 알아보기</span>${pic(x)}</a>`;
    more.innerHTML = `<h2>다른 작업</h2><div class="pager">${tile(prev, '이전')}${prev === next ? '' : tile(next, '다음')}</div>`;
    reveal(more.querySelectorAll('h2, .pager > a'));
  }
}
