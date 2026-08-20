const INFO = `
<div class="info">
  <div class="card">
    <h3>✈️ 항공 · 🏨 숙소</h3>
    <div class="body">
      <table class="tt">
        <tr><td style="width:80px"><b>가는편</b></td><td>10/21(수) <span class="mono">LJ0345</span><br>인천 T2 <span class="mono">07:30</span> → 나고야 <span class="mono">09:25</span></td></tr>
        <tr><td><b>오는편</b></td><td>10/25(일) <span class="mono">LJ0292</span><br>나고야 <span class="mono">20:00</span> → 인천 T2 <span class="mono">22:15</span></td></tr>
        <tr><td><b>예약</b></td><td>진에어 <span class="mono">JP283U</span> · 성인 2 · 위탁수하물 15kg</td></tr>
        <tr><td><b>호텔</b></td><td>마이스테이스 나고야-사카에 4박 · <span class="mono">HH2635447294</span> · ₩670,896<br><span style="color:var(--muted)">사카에역 5번 출구 도보 7–8분</span></td></tr>
      </table>
    </div>
  </div>

  <div class="card">
    <h3>🚇 지하철, 딱 이것만</h3>
    <div class="body">
      <p style="margin:0 0 14px; font-size:15px; color:var(--ink-2)"><b>우리 집(호텔) = 사카에역.</b> 5일 동안 타는 노선은 딱 2개야.</p>
      <table class="tt">
        <tr><td style="width:104px"><span class="chip c-yellow">노란선</span></td><td><b>히가시야마선</b> — 나고야역 갈 때 (신칸센·버스센터·애니메이트). 사카에→나고야 5분 직행.</td></tr>
        <tr><td><span class="chip c-purple">보라선</span></td><td><b>메이조선</b> — 야바초(미소카츠·히쓰마부시), 카미마에즈(오스), 카나야마(공항 환승), 나고야조. 전부 1~4정거장.</td></tr>
        <tr><td><span class="chip c-red">뮤스카이</span></td><td>공항↔호텔은 딱 한 패턴 — 뮤스카이 → 카나야마 → 보라선 2정거장 → 사카에 (약 40분 · ¥1,600/인)</td></tr>
      </table>
      <p style="margin:14px 0 0; font-size:14.5px; color:var(--muted)">외울 게 하나 있다면: 노란선 타고 나고야역 갈 땐 <b>타카바타(高畑) 방면</b> 열차.</p>
    </div>
  </div>

  <div class="card">
    <h3>⏱️ 배차 간격 — 기다림이 생기는 곳</h3>
    <div class="body">
      <table class="tt">
        <tr><td style="width:104px"><span class="chip c-yellow">노란선</span></td><td>토·휴일 낮 <b>4분 30초</b> · 저녁 <b>3분 30초</b><br><span style="color:var(--muted)">사실상 기다림 없음</span></td></tr>
        <tr><td><span class="chip c-purple">보라선</span></td><td>사카에~카나야마 <b>약 5분</b><br><span style="color:var(--muted)">환상선이라 좌·우회전 방향만 확인</span></td></tr>
        <tr><td><span class="chip c-purple">名港線</span></td><td><b>약 10분</b> — 5일 중 유일하게 성긴 구간<br><span style="color:var(--warn)">환상선과 번갈아 다녀서, 사카에역에서 「名古屋港行」이 아닌 열차를 타면 카나야마에서 갈아타야 해</span><br><span style="color:var(--muted)">21시 이후엔 직통이 아예 없음 (Day 4는 낮이라 해당 없음)</span></td></tr>
      </table>
      <p style="margin:14px 0 0; font-size:14px; color:var(--ink-2)">지도에서 나고야항으로 내려가는 <b>사다리 무늬 선</b>이 이 지선이야 — 본선과 다른 열차라는 표시.</p>
    </div>
  </div>

  <div class="card wide">
    <h3>🚨 5일 전체에서 진짜 위험한 곳</h3>
    <div class="body">
      <table class="tt stack">
        <thead><tr><th>순위</th><th>언제</th><th>무슨 일이 생기나 / 어떻게 막나</th></tr></thead>
        <tr>
          <td><b style="color:var(--warn)">1위</b></td>
          <td><b>Day 3</b><br><span class="mono">08:20</span></td>
          <td><b>시라카와고 고속버스를 놓치는 것.</b> 예약제라 다음 편으로 못 옮기고, 놓치면 그날 하루가 통째로 날아가. 앞에 부쵸커피(7:15 오픈·오픈런 명소)가 있어서 줄이 길면 그대로 위험해져.<br><span style="color:var(--ok)">→ 8:05엔 무조건 커피를 끊고 나오기. 줄이 길면 미련 없이 버스센터 편의점으로.</span></td>
        </tr>
        <tr>
          <td><b style="color:var(--warn)">2위</b></td>
          <td><b>Day 4</b><br><span class="mono">18:15→18:30</span></td>
          <td><b>오아시스21 → 호라이켄 정리권.</b> 개찰 4분 + 보라선 대기 5분 + 승차 2분 + 도보 4분 = 15분. 여유가 사실상 0이고 한 대만 놓치면 저녁이 날아가.<br><span style="color:var(--ok)">→ 둘이 나누기. 한 명은 타워에서 바로 야바초로 가서 번호표부터 받기.</span></td>
        </tr>
        <tr>
          <td><b>—</b></td>
          <td><b>Day 5</b><br><span class="mono">해소됨</span></td>
          <td><s style="color:var(--muted)">오후 전체에 여유가 0이었음</s> → <b>동물원을 빼면서 2시간 50분이 생겨 해소됐어.</b> 이제 오스가 2시간이고 아침도 늦잠이 가능해. 남은 제약은 만다라케 12시 오픈(그래서 오스가 오후)과 덴무스 14시 전뿐.<br><span style="color:var(--ok)">→ 덴무스만 그날 아침 전화 주문(052-262-0466)해두면 오늘은 편해. 현금만 받으니 지폐 챙기기.</span></td>
        </tr>
        <tr>
          <td><b>4위</b></td>
          <td><b>Day 3</b><br><span class="mono">18:16</span></td>
          <td><b>시라카와고 버스 복귀 지연.</b> 금요일 저녁 고속도로라 늦을 수 있는데, 애니메이트·라신반이 20시 마감이야. 30분만 늦어도 3연타가 무너져.<br><span style="color:var(--ok)">→ 늦으면 라신반 한 곳만. 쿠지 공식샵(21시)이 제일 늦게 닫으니 순서를 바꿔도 돼.</span></td>
        </tr>
        <tr>
          <td><b>5위</b></td>
          <td><b>Day 4</b><br><span class="mono">12:20~13:00</span></td>
          <td><b>수족관 왕복 배차.</b> 名港線만 10분 간격이라 한 대 놓치면 점심이 밀리고, 그러면 나고야성 16시 입장 마감까지 연쇄로 밀려.<br><span style="color:var(--ok)">→ 12:10엔 수족관에서 나오기. 에비스야는 13:20까지 늦어도 성은 지킬 수 있어.</span></td>
        </tr>
        <tr>
          <td><b>6위</b></td>
          <td><b>Day 1</b><br><span class="mono">09:25~10:20</span></td>
          <td><b>입국 버퍼 55분.</b> 주부공항은 한산한 편이라 보통 충분하지만, 여유가 두껍진 않아. 밀려도 뒤가 유연해서 피해는 작아.<br><span style="color:var(--ok)">→ 밀리면 호텔에 짐 맡기는 걸 건너뛰고 야바톤부터. 캐리어는 야바초역 코인로커에.</span></td>
        </tr>
      </table>
      <div class="callout" style="margin-top:16px">
        <span aria-hidden="true">📌</span>
        <span><b>지금 당장 할 일</b> — 위험 1위·2위는 대부분 <b>예약 2건</b>으로 사라져. ① 시라카와고 버스(9월 하순 오픈 즉시 8:20편) ② 마에사와규샤 19:30. 이 둘이 안 되면 Day 2·Day 3 저녁이 통째로 흔들려.</span>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>🎫 티켓</h3>
    <div class="body">
      <table class="tt stack">
        <thead><tr><th>티켓</th><th>가격</th><th>언제</th></tr></thead>
        <tr><td><b>뮤스카이</b><br><span style="color:var(--muted)">공항 ⇄ 카나야마</span></td><td class="mono">¥1,390<br>+ 보라선 ¥210</td><td>Day 1 · Day 5</td></tr>
        <tr><td><b>이누야마 성하마을 킷푸</b><br><span style="color:var(--muted)">왕복 + 성 입장권</span></td><td class="mono">¥1,630</td><td>Day 2<br>메이테츠 나고야역</td></tr>
        <tr><td><b>시라카와고 고속버스</b><br><span style="color:var(--muted)">예약 필수</span></td><td class="mono">편도 ¥3,600<br>~4,700</td><td>Day 3<br>9월 하순 오픈</td></tr>
        <tr><td><b>도니치에코킷푸</b><br><span style="color:var(--muted)">주말 지하철 무제한</span></td><td class="mono">¥620 / 일</td><td>Day 4 · Day 5</td></tr>
      </table>
    </div>
  </div>

  <div class="card">
    <h3>⏰ 이것만 지키면 성공</h3>
    <div class="body">
      <table class="tt">
        <tr><td style="width:128px"><b>시라카와고 버스</b></td><td>9월 하순 예약 오픈 즉시 8:20편</td></tr>
        <tr><td><b>마에사와규샤</b></td><td>출발 전 19:30으로 예약 (052-204-6077)</td></tr>
        <tr><td><b>야바톤</b></td><td>12시 전 입장 = 웨이팅 0</td></tr>
        <tr><td><b>호라이켄</b></td><td>18:30 정리권 받기 마지노선</td></tr>
        <tr><td><b>나고야성</b></td><td>입장 16:00 마감</td></tr>
        <tr><td><b>에비스야</b></td><td>일요일 휴무 — 반드시 Day 4(토)</td></tr>
        <tr><td><b>덴무스 센주</b></td><td>14시 전 · 품절 조기마감</td></tr>
        <tr><td><b>BAPE</b></td><td>19:00 마감 — 넷 중 제일 빨라</td></tr>
        <tr><td><b>만다라케</b></td><td>12:00 오픈 — 오전엔 헛걸음</td></tr>
        <tr><td><b>가챠 전문점</b></td><td>대부분 20시 · 가샤폰 백화점만 23시</td></tr>
      </table>
    </div>
  </div>

  <div class="card wide">
    <h3>✅ 출발 전 체크리스트</h3>
    <div class="body">
      <div style="display:grid; gap:12px 32px; grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))">
        <ul class="check">
          <li class="done"><span class="bx">✓</span><span>항공권 확정 — 진에어 왕복 · 예약번호 JP283U</span></li>
          <li class="done"><span class="bx">✓</span><span>호텔 확정 — 마이스테이스 나고야-사카에 4박</span></li>
          <li><span class="bx"></span><span><b>시라카와고 버스 왕복 예약</b> — highwaybus.com, 9월 하순 오픈, 8:20편</span></li>
          <li><span class="bx"></span><span><b>마에사와규샤 후시미야 예약</b> — 19:30 (052-204-6077)</span></li>
          <li><span class="bx"></span><span>🐾 정야웅 맡기기 + 돌봄 가이드 공유</span></li>
          <li><span class="bx"></span><span>환전 / 트래블카드 — 지하철은 모바일 스이카 터치로 해결</span></li>
        </ul>
        <ul class="check">
          <li><span class="bx"></span><span>유심 / 로밍</span></li>
          <li><span class="bx"></span><span>겉옷·목도리 — 시라카와고 아침 5도 안팎</span></li>
          <li><span class="bx"></span><span>카메라·보조배터리 (Day 4 매직아워 17:05 알람)</span></li>
          <li><span class="bx"></span><span>온천 가는 밤 속옷 여벌 (수건은 현지 대여 ¥200)</span></li>
          <li><span class="bx"></span><span>여권 — 돈키·애니샵 면세용으로 여행 중에도 소지</span></li>
          <li><span class="bx"></span><span>사고 싶은 애니 굿즈 위시리스트 (오스에서 시세 비교)</span></li>
          <li><span class="bx"></span><span>(옵션) Day 4 아침 헤어셋 — 핫페퍼 뷰티 · 밀크플로트</span></li>
        </ul>
      </div>
    </div>
  </div>
</div>`;