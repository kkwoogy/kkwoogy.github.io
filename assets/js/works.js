// Every piece of work on the site, and the areas they are filed under. This is the only list to edit:
// the nav and footer, the home page, each area page, and each work page's area link, details line and
// other-work tiles all read it. Paths are from the site root. Each area has its own page at /<id>/.
// img: the picture used on tiles. photo: true for a screenshot or photo (fills its box);
// leave it out for a cut-out object or a drawing on black (sits inside its box).

export const AREAS = [
  { id: 'product', name: '제품', note: '손에 들고 쓰는 물건입니다. 겉모양을 설계하고, 안에 들어갈 회로와 펌웨어까지 만듭니다.',
    img: 'assets/img/cam-parts.jpg' },
  { id: 'robotics', name: '로봇·자율주행', note: '센서로 주변을 보고 스스로 움직이는 기계입니다.',
    img: 'assets/img/mr-map.png' },
  { id: 'software', name: '소프트웨어', note: '화면 안에서 쓰는 앱과 웹입니다.',
    img: 'assets/img/sw-cafe-rain.jpg', photo: true },
];

// date: year-month the work started (or the event, for a competition), used for order. Newest goes first.
// when / context / status: shown on the work page and its area page. line: one sentence for the area page.
export const WORKS = [
  {
    id: 'camera', title: '디지털카메라', area: 'product', date: '2026-11',
    context: '개인 작업', when: '2026년 11월부터', status: '출력 준비 중',
    line: '라즈베리 파이와 800만 화소 카메라 모듈로 만드는 레트로 디카. 바디를 코드로 설계했습니다.',
    page: 'projects/camera.html', img: 'assets/img/cam-clay.png',
  },
  {
    id: 'racing', title: 'MR 자율주행 레이스카', area: 'robotics', date: '2026-11',
    context: '동아리 MR (KAIST)', when: '2026년 11월 14일, POSTECH', status: '대회 출전',
    line: '라이다와 카메라로 트랙을 보고 스스로 5랩을 도는 레이스카. 전장과 펌웨어, 주행 프로그램을 맡았습니다.',
    page: 'projects/racing.html', img: 'assets/img/mr-lap.png',
  },
  {
    id: 'imac-g3', title: 'iMac G3 화면과 컨트롤러', area: 'product', date: '2026-10',
    context: '개인 작업', when: '2026년 10월부터', status: '컨트롤러 설계 중',
    line: '책상 위에 두는 작은 iMac G3 화면과, 그 화면에서 할 게임을 위한 무선 컨트롤러.',
    page: 'projects/imac-g3.html', img: 'assets/img/ctrl-clay.png',
  },
  {
    id: 'somewhere', title: 'Somewhere', area: 'software', date: '2026-07',
    context: '개인 작업', when: '2026년 7월부터', status: '비공개 베타 0.8.4',
    line: '머물고 싶은 공간을 꾸미면, 그 분위기에 맞는 음악이 흐르는 3D 웹앱.',
    page: 'projects/somewhere.html', img: 'assets/img/sw-attic-night.jpg', photo: true,
  },
];

// newest first; works from the same month keep the order they have above
export const sorted = (list = WORKS) => list.map((w, i) => [w, i]).sort((a, b) => b[0].date.localeCompare(a[0].date) || a[1] - b[1]).map(([w]) => w);
export const area = id => AREAS.find(a => a.id === id);
export const ym = d => d.replace('-', '.');
export const BLOG = 'https://blog.naver.com/koreatonystark';
export const GITHUB = 'https://github.com/kkwoogy';
