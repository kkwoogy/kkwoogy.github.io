# MODE Lab

KAIST 학부생 경욱이 직접 설계하고 만든 것들을 분야별로 모아 두는 사이트입니다.
https://kkwoogy.github.io

빌드 도구 없는 정적 사이트입니다. 3D는 three.js 0.160을 CDN(jsdelivr)에서 불러옵니다.

```
index.html                     홈
product/ robotics/ software/   분야 페이지 (내용은 assets/js/area.js가 채움)
about.html                     소개
projects/*.html                작업 페이지
assets/js/works.js             분야와 작업 목록. 메뉴, 푸터, 홈, 분야 페이지가 모두 이 목록을 읽음
assets/js/chrome.js            모든 페이지의 메뉴와 푸터, 스크롤 효과
assets/js/home.js, area.js, work.js   홈, 분야 페이지, 작업 페이지
assets/js/stage.js, models.js, case.js   작업 페이지의 3D
assets/css/site.css            색, 글꼴, 레이아웃
assets/models/*.bin            보기용으로 줄인 3D 모델
```

## 미리 보기

```bash
python3 -m http.server 8000
```

http://localhost:8000 을 엽니다. 파일을 더블클릭해서 열면 3D가 뜨지 않습니다. 로컬에서는 아직 채우지 않은 자리(점선 칸)가 보이고, 공개된 사이트에서는 숨겨집니다.

## 작업 추가하기

1. `assets/js/works.js`의 `WORKS`에 항목을 하나 더합니다.
2. `projects/`의 비슷한 페이지를 복사하고 `<body data-work="새 id">`로 바꿉니다.
3. 메뉴, 홈, 분야 페이지, 다른 작업 칸은 목록을 따라 저절로 바뀝니다.

## 3D 모델

`assets/models/*.bin`은 화면에 보여 주려고 면을 줄이고 꼭짓점을 0.1 mm 격자에 맞춘 파일입니다. 출력용 STL은 이 저장소에 없습니다.

## 출처와 라이선스

- 글꼴: [Pretendard](https://github.com/orioncactus/pretendard) (SIL Open Font License 1.1)
- 3D: [three.js](https://threejs.org) (MIT)
- Somewhere 화면 속 3D 모델 일부: Poly Pizza의 CC BY 저작물. 목록은 `projects/somewhere.html` 아래 '3D 모델 출처'에 있습니다.
- MR 트랙 맵: 2026 ISTech IT Arena 대회 자료
- iMac, iOS, Apple Music은 Apple Inc.의 상표입니다. 이 사이트는 Apple과 관계없는 개인 사이트입니다.
- 위에 적은 것 말고 이 사이트의 글, 이미지, 3D 모델, 코드의 권리는 경욱에게 있습니다.
