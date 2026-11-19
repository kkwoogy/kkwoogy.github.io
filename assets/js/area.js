// An area page (/product/, /robotics/, /software/): a row of its works to jump to, the area's name and note,
// every work in it (newest first), then the other areas. All of it comes from works.js; the page only says
// which area it is with <body data-area="id">.
import { AREAS, WORKS, sorted, area } from './works.js';
import { root, reveal } from './chrome.js';

const a = area(document.body.dataset.area);
const list = sorted(WORKS.filter(w => w.area === a.id));
const src = x => `${root}${x.img}`;

document.title = `${a.name} · MODE Lab`;
document.getElementById('area').innerHTML =
  (list.length ? `<nav class="chapters" aria-label="${a.name} 작업"><ul>${list.map(w =>
    `<li><a href="${root}${w.page}"><span class="ic${w.photo ? ' photo' : ''}"><img src="${src(w)}" alt=""></span><span>${w.title}</span></a></li>`).join('')}</ul></nav>` : '')
  + `<section class="area-hero wrap"><h1 class="rise">${a.name}</h1><p class="rise" style="--d: .15s">${a.note}</p></section>`
  + `<section class="lineup wrap-wide" data-n="${Math.min(list.length, 3)}" aria-label="${a.name} 작업 전체">`
  + (list.map(w => `<article class="item">`
      + `<a class="pic${w.photo ? ' photo' : ''}" href="${root}${w.page}" tabindex="-1" aria-hidden="true"><img src="${src(w)}" alt="" loading="lazy"></a>`
      + `<p class="st">${w.status}</p><h2>${w.title}</h2><p class="line">${w.line}</p>`
      + `<p class="meta">${[w.context, w.when].filter(Boolean).join(' · ')}</p>`
      + `<a class="go" href="${root}${w.page}">더 알아보기</a></article>`).join('')
    || `<p class="line">아직 올린 작업이 없습니다.</p>`)
  + `</section>`
  + `<section class="others" aria-labelledby="others-h"><div class="head wrap"><h2 id="others-h">다른 분야.</h2></div><div class="area-tiles">`
  + AREAS.filter(x => x.id !== a.id).map(x =>
      `<a class="area-tile small" href="${root}${x.id}/"><h3>${x.name}</h3><p>${x.note}</p><span class="go">둘러보기</span>`
      + `<span class="pic${x.photo ? ' photo' : ''}"><img src="${src(x)}" alt="" loading="lazy"></span></a>`).join('')
  + `</div></section>`;

reveal(document.querySelectorAll('.item, .others .head, .others .area-tile'));
