const INFO = `
<div class="info">
  <div class="card">
    <h3>✈️ 항공 · 🏨 숙소</h3>
    <div class="body">
      <table class="tt">
        <tr><td style="width:80px"><b>가는편</b></td><td>10/21(수) <span class="mono">LJ0345</span> · 인천 T2 <span class="mono">07:30</span> → 나고야 <span class="mono">09:25</span></td></tr>
        <tr><td><b>오는편</b></td><td>10/25(일) <span class="mono">LJ0292</span> · 나고야 <span class="mono">20:00</span> → 인천 T2 <span class="mono">22:15</span></td></tr>
        <tr><td><b>예약</b></td><td>진에어 <span class="mono">JP283U</span> · 위탁 15kg</td></tr>
        <tr><td><b>호텔</b></td><td>마이스테이스 나고야-사카에 · <span class="mono">HH2635447294</span><br><span style="color:var(--muted)">사카에역 5번 출구 도보 7분</span></td></tr>
      </table>
    </div>
  </div>

  <div class="card">
    <h3>🚇 교통, 딱 이것만</h3>
    <div class="body">
      <table class="tt">
        <tr><td style="width:104px"><span class="chip c-yellow">노란선</span></td><td>사카에 → <b>나고야역</b> 5분 (<b>타카바타 방면</b>)</td></tr>
        <tr><td><span class="chip c-purple">보라선</span></td><td>야바초 · 카미마에즈(오스) · 카나야마 · 나고야조 — 전부 1~4정거장</td></tr>
        <tr><td><span class="chip c-red">공항</span></td><td>뮤스카이 → 카나야마 → 보라선 → 사카에 (40분)</td></tr>
        <tr><td><span class="chip">💳 카드 터치</span></td><td>지하철 전 역 + 공항↔카나야마 메이테츠 = <b>컨택리스 카드 터치</b> (2026-09-03~). 단 <b>산노역은 안 됨</b>. 교통카드(마나카) 안 삼. <b>1인 1카드</b>(하나·토스) 고정, 들어간 카드로 나오기</td></tr>
      </table>
      <p style="margin:14px 0 0; font-size:14px; color:var(--muted)">수족관 가는 名港線만 10분 간격 — 「名古屋港行」인지 확인하고 타기.</p>
      <table class="tt" style="margin-top:14px">
        <tr><td style="width:104px"><span class="chip">🎫 Day 1</span></td><td><b>뮤 티켓 ¥450/인</b> — 공항 메이테츠 창구 · 좌석 지정 (10:17 일반 특급이면 불필요)</td></tr>
        <tr><td><span class="chip">🎫 Day 1 밤</span></td><td><b>메이테츠 나고야↔산노 ¥180/인 종이표</b> — 산노역은 카드 터치 안 됨 · 普通만 정차</td></tr>
        <tr><td><span class="chip">🎫 Day 3</span></td><td><b>이누야마 성하마을 킷푸 ¥1,950/인</b> — 메이테츠 나고야역 서비스센터 창구 (CentX 앱 ¥1,840)</td></tr>
        <tr><td><span class="chip">🎫 Day 4</span></td><td><b>도니치에코킷푸 ¥620/인</b> — 사카에역 발매기 현금 · 수족관 ¥200 할인</td></tr>
        <tr><td><span class="chip">🎫 Day 5</span></td><td><b>뮤 티켓 ¥450/인</b> — 카나야마역 메이테츠 발매기·창구. 지하철은 2번뿐이라 도니치에코킷푸 안 사고 카드 터치</td></tr>
        <tr><td><span class="chip">🆘 비상</span></td><td>개찰에서 카드 거부되면 그 자리 창구에서 마나카 ¥2,000 (현금)</td></tr>
      </table>
    </div>
  </div>

  <div class="card wide">
    <h3>🚨 이것만 지키면 성공</h3>
    <div class="body">
      <table class="tt">
        <tr><td style="width:128px"><b>Day 2 <span class="mono">08:50</span></b></td><td><b>시라카와고 버스</b> — 놓치면 하루 통째로 날아가. 8:35엔 커피 끊고 출발</td></tr>
        <tr><td><b>Day 2 <span class="mono">18:16</span></b></td><td>버스 늦으면 라신반만 — 애니메이트·라신반 20시 마감</td></tr>
        <tr><td><b>Day 4 <span class="mono">17:35</span></b></td><td><b>호라이켄 대기 명부</b>에 이름 먼저 → 마루젠에서 기다리기</td></tr>
        <tr><td><b>Day 4</b></td><td>에비스야는 일요일 휴무라 오늘뿐 · 나고야성은 Be GOLD로 19:30까지</td></tr>
        <tr><td><b>Day 5</b></td><td>덴무스 센주 14시 전 (아침 전화 주문 052-262-0466 · 현금만)</td></tr>
        <tr><td><b>마감 주의</b></td><td>BAPE 19시 · 만다라케 12시 오픈 · 가챠 대부분 20시</td></tr>
      </table>
      <div class="callout" style="margin-top:14px">
        <span aria-hidden="true">📌</span>
        <span>10/18~24 아시아파라경기대회 기간이라 시내가 붐벼 — 특히 <b>10/24(토) 저녁</b>은 이동 여유 있게. 10/20 예보로는 <b>토·일 비</b>(토 90%) — 태풍 30호는 남쪽 바다로 지나가는 예보지만 10/23에 한 번 더 확인.</span>
      </div>
    </div>
  </div>

  <div class="card wide">
    <h3>✅ 출발 전 체크리스트</h3>
    <div class="body">
      <div style="display:grid; gap:12px 32px; grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))">
        <ul class="check">
          <li><span class="bx"></span><span><b>환전 1인 ¥20,000</b> — 쓸 돈 ¥15,000(덴무스·온천·종이표) + 카드 거부 대비 비상 ¥5,000</span></li>
          <li><span class="bx"></span><span>여권 (면세 때문에 여행 중에도 소지)</span></li>
          <li><span class="bx"></span><span>겉옷·목도리 — 시라카와고 아침 5도</span></li>
          <li><span class="bx"></span><span>보조배터리 · 온천용 속옷 여벌</span></li>
        </ul>
        <ul class="check">
          <li class="done"><span class="bx">✓</span><span>항공 · 호텔 · 시라카와고 버스 · 마에사와규샤 예약</span></li>
          <li class="done"><span class="bx">✓</span><span>Visit Japan Web — QR 캡처해 두기</span></li>
          <li class="done"><span class="bx">✓</span><span>eSIM — 도착하면 회선 켜고 데이터 로밍 ON</span></li>
          <li class="done"><span class="bx">✓</span><span>🐾 정야웅 돌봄 가이드 — 노션 + 모바일 HTML 정리 완료</span></li>
        </ul>
      </div>
    </div>
  </div>
</div>`;
