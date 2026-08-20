# 나고야 뚜벅이 노선도 🍁

2026.10.21 – 10.25 · 4박 5일 · 상미 & 호동 나고야 일정.
OpenStreetMap 기반 실지도 위에 하루 동선을 그리고, 지하철 노선·구글맵 길찾기·예외 상황(플랜 B)까지 한 페이지에 담은 모바일 우선 페이지.

- `index.html` — 배포본 (단일 파일, 외부 라이브러리 0개)
- `artifact.html` — 클로드 아티팩트용 (head/body 래퍼 없는 버전)
- `src/` — 원본 조각 (template / style / engine / app), `data/` — 일정·좌표·OSM 벡터 데이터
- `python3 build.py` 로 `index.html`·`artifact.html` 재생성

## 지도
- 타일: [OpenStreetMap](https://www.openstreetmap.org/copyright) 타일 (온라인)
- 타일을 못 불러오는 환경에서는 파일에 내장된 OSM 벡터 데이터(지하철·메이테츠 노선, 물·공원·간선도로·해안선)로 자동 대체
- 데이터 © OpenStreetMap 기여자 · ODbL
