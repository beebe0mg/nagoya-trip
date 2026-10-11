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
        <tr><td><span class="chip c-red">뮤스카이</span></td><td>공항↔호텔은 딱 한 패턴 — 뮤스카이 → 카나야마 → 보라선 2정거장 → 사카에 (약 40분 · ¥1,570/인)</td></tr>
        <tr><td><span class="chip">💳 결제</span></td><td><b>전부 실물 마나카 터치.</b> 티머니랑 똑같이 들어갈 때·나올 때 한 번씩. 표를 따로 끊는 건 뮤 티켓·이누야마 킷푸·도니치에코킷푸 셋뿐.</td></tr>
      </table>
      <p style="margin:14px 0 0; font-size:14.5px; color:var(--muted)">외울 게 하나 있다면: 노란선 타고 나고야역 갈 땐 <b>타카바타(高畑) 방면</b> 열차.</p>
    </div>
  </div>


  <div class="card">
    <h3>💳 교통카드 = 실물 마나카 (스이카 대신)</h3>
    <div class="body">
      <p style="margin:0 0 14px; font-size:15px; color:var(--ink-2)"><b>모바일 스이카는 포기.</b> Apple Pay에 등록할 카드가 없고 카카오페이·티머니는 일본 개찰구에서 안 돼. 대신 Day 1 공항 메이테츠역에서 <b>실물 마나카</b>를 사면 똑같이 터치로 다 탈 수 있어.</p>
      <table class="tt">
        <tr><td style="width:104px"><b>어디서</b></td><td>Day 1 10:10 · 메이테츠 센트레아역 발매기 (「manaca 購入」) 또는 창구</td></tr>
        <tr><td><b>얼마</b></td><td><b>발매액 ¥2,000 고정</b>(보증금 ¥500 + 잔액 ¥1,500) → 산 자리에서 <b>¥3,000 충전</b>해 잔액 ¥4,500으로. <b>현금만</b> · 1인 ¥5,000 × 2 = ¥10,000 지폐 준비</td></tr>
        <tr><td><b>어디서 되나</b></td><td>나고야 지하철 전 노선 · 메이테츠 (공항선·이누야마선·산노) · JR · 시내버스 · 편의점 결제까지</td></tr>
        <tr><td><b>안 되는 것</b></td><td>뮤 티켓(뮤스카이 특급권) · 이누야마 성하마을 킷푸 · 도니치에코킷푸 — 셋은 종이표라 따로 사야 해. 기본운임은 마나카에서 빠지고 뮤 티켓만 얹는 구조</td></tr>
        <tr><td><b>충전</b></td><td>아무 역 발매기 「チャージ」→ 현금 ¥1,000 단위. 세븐일레븐·로손 계산대에서도 "차지 오네가이시마스"</td></tr>
        <tr><td><b>환불</b></td><td>Day 5 공항 메이테츠 창구 — 보증금 ¥500 반환, 잔액은 수수료 ¥220 빼고 반환. 잔액 ¥220 이하면 보증금만</td></tr>
      </table>
      <p style="margin:14px 0 6px; font-size:14px; color:var(--ink-2)"><b>1인 마나카 지출 예상 (¥4,500이면 거의 끝)</b></p>
      <table class="tt">
        <tr><td style="width:104px"><b>Day 1</b></td><td class="mono">약 ¥2,300 <span style="color:var(--muted); font-family:var(--f-sans)">공항→카나야마 ¥910 · 지하철 4번 · 산노 온천 메이테츠 왕복</span></td></tr>
        <tr><td><b>Day 2</b></td><td class="mono">¥420 <span style="color:var(--muted); font-family:var(--f-sans)">사카에⇄나고야역 왕복 · 버스는 결제 완료</span></td></tr>
        <tr><td><b>Day 3</b></td><td class="mono">¥630 <span style="color:var(--muted); font-family:var(--f-sans)">지하철 3번 · 이누야마 왕복은 킷푸 ¥1,630 별도</span></td></tr>
        <tr><td><b>Day 4</b></td><td class="mono">¥0 <span style="color:var(--muted); font-family:var(--f-sans)">도니치에코킷푸 ¥620 (현금) · 지하철 3번뿐, 나머지 도보</span></td></tr>
        <tr><td><b>Day 5</b></td><td class="mono">¥910 <span style="color:var(--muted); font-family:var(--f-sans)">카나야마→공항 · 시내는 킷푸 ¥620 또는 마나카 ¥840</span></td></tr>
        <tr><td><b>합계</b></td><td class="mono"><b>약 ¥4,200~4,500</b> <span style="color:var(--muted); font-family:var(--f-sans)">모자라면 Day 4~5에 ¥1,000 한 번 충전</span></td></tr>
      </table>
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
          <td><b>Day 2</b><br><span class="mono">08:50</span></td>
          <td><b>시라카와고 고속버스를 놓치는 것.</b> 예약제라 다음 편으로 못 옮기고, 놓치면 그날 하루가 통째로 날아가. 앞에 부쵸커피(7:15 오픈·오픈런 명소)가 있어서 줄이 길면 그대로 위험해져.<br><span style="color:var(--ok)">→ 8:35엔 무조건 커피를 끊고 나오기. 줄이 길면 미련 없이 버스센터 편의점으로.</span></td>
        </tr>
        <tr>
          <td><b style="color:var(--warn)">2위</b></td>
          <td><b>Day 4</b><br><span class="mono">17:35</span></td>
          <td><b>호라이켄 대기 명부.</b> 앱도 정리권 시각도 없고, 입구 명부에 이름을 쓰면 직원이 예상 시각을 알려주는 방식이야. 토요일 저녁은 1~2시간 대기가 보통이고 접수 마감은 잔여석에 따라 달라. <s style="color:var(--muted)">타워 16:45 → 18:15 도착</s>은 타워가 10월 이벤트로 16:30~17:30 닫혀 있어서 성립이 안 됐어.<br><span style="color:var(--ok)">→ 순서를 타워(낮) → 성(점등) → 호라이켄으로 바꿨고, 17:35에 이름부터 올린 뒤 옆 마루젠에서 기다려. 불안하면 한 명이 16:45에 먼저 가서 올리기.</span></td>
        </tr>
        <tr>
          <td><b>—</b></td>
          <td><b>Day 5</b><br><span class="mono">해소됨</span></td>
          <td><s style="color:var(--muted)">오후 전체에 여유가 0이었음</s> → <b>동물원을 빼면서 2시간 50분이 생겨 해소됐어.</b> 이제 오스가 2시간이고 아침도 늦잠이 가능해. 남은 제약은 만다라케 12시 오픈(그래서 오스가 오후)과 덴무스 14시 전뿐.<br><span style="color:var(--ok)">→ 덴무스만 그날 아침 전화 주문(052-262-0466)해두면 오늘은 편해. 현금만 받으니 지폐 챙기기.</span></td>
        </tr>
        <tr>
          <td><b>4위</b></td>
          <td><b>Day 2</b><br><span class="mono">18:16</span></td>
          <td><b>시라카와고 버스 복귀 지연.</b> 목요일 저녁 고속도로라 늦을 수 있는데, 애니메이트·라신반이 20시 마감이야. 30분만 늦어도 3연타가 무너져.<br><span style="color:var(--ok)">→ 늦으면 라신반 한 곳만. 쿠지 공식샵(21시)이 제일 늦게 닫으니 순서를 바꿔도 돼.</span></td>
        </tr>
        <tr>
          <td><b>5위</b></td>
          <td><b>Day 4</b><br><span class="mono">12:20~13:00</span></td>
          <td><b>수족관 왕복 배차.</b> 名港線만 10분 간격이라 한 대 놓치면 점심이 밀리고, 그러면 나고야성 16시 입장 마감까지 연쇄로 밀려.<br><span style="color:var(--ok)">→ 12:10엔 수족관에서 나오기. 에비스야는 13:20까지 늦어도 성은 지킬 수 있어.</span></td>
        </tr>
        <tr>
          <td><b>6위</b></td>
          <td><b>Day 1</b><br><span class="mono">09:25~12:00</span></td>
          <td><b>입국 45분 + 마나카·뮤 티켓 10분 + 이동 40분 + 호텔 20분.</b> 야바톤을 12:00 목표로 늦춰서 공항 도착부터 2시간 35분 — 뮤스카이 한 편(30분) 놓쳐도 돼. Visit Japan Web QR을 미리 받아두면 입국 줄에서 10~20분 더 벌어. 마나카는 건너뛰면 안 돼 — 5일이 다 꼬여.<br><span style="color:var(--ok)">→ 그래도 밀리면 호텔에 짐 맡기는 걸 건너뛰고 야바톤부터. 캐리어는 야바초역 코인로커에.</span></td>
        </tr>
      </table>
      <div class="callout" style="margin-top:16px">
        <span aria-hidden="true">📌</span>
        <span>🏅 <b>여행 기간이 「아이치·나고야 2026 아시아파라경기대회」(10/18~10/24)와 겹쳐.</b> 개·폐회식장은 파로마 미즈호 스타디움이라 우리 동선엔 교통통제가 안 걸리지만, 시내 지하철·식당은 평소보다 붐빌 수 있어. 특히 <b>폐회식 날인 10/24(토) 저녁</b> — 그날은 이동 시간을 여유 있게.</span>
      </div>
      <div class="callout" style="margin-top:12px">
        <span aria-hidden="true">📌</span>
        <span><b>지금 당장 할 일</b> — 위험 1위·2위는 대부분 <b>예약 2건</b>으로 사라져. ① 시라카와고 버스 <b>187054678</b>(10/22 08:50 왕복 · 승차권 발권까지 완료) ② 마에사와규샤 <b>SE2012284</b>(10/23 금 19:30). <b>예약은 전부 끝났어 ✅</b> 남은 건 짐 싸기랑 정야웅 맡기기뿐!</span>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>🎫 티켓</h3>
    <div class="body">
      <table class="tt stack">
        <thead><tr><th>티켓</th><th>가격</th><th>언제</th></tr></thead>
        <tr><td><b>마나카 (실물 교통카드)</b><br><span style="color:var(--muted)">5일 지하철·메이테츠 전부 이걸로 터치</span></td><td class="mono">¥2,000 + 충전 ¥3,000 / 인<br><span style="color:var(--muted)">보증금 ¥500 포함 · 현금</span></td><td>Day 1 10:10<br>공항 메이테츠역 창구</td></tr>
        <tr><td><b>뮤스카이</b><br><span style="color:var(--muted)">공항 ⇄ 카나야마 · 기본운임은 마나카, 뮤 티켓만 창구</span></td><td class="mono">¥1,360<br><span style="color:var(--muted)">운임 ¥910 + 뮤 티켓 ¥450</span><br>+ 보라선 ¥210</td><td>Day 1 공항 창구<br>Day 5 카나야마역</td></tr>
        <tr><td><b>이누야마 성하마을 킷푸</b><br><span style="color:var(--muted)">왕복 + 성 입장권 + 쿠폰</span></td><td class="mono">¥1,950<br><span style="color:var(--muted)">CentX 앱 ¥1,840</span></td><td>Day 3<br>메이테츠 나고야 서비스센터</td></tr>
        <tr><td><b>시라카와고 고속버스</b><br><span style="color:var(--muted)">예약 필수</span></td><td class="mono">편도 ¥3,600<br>~4,700</td><td>Day 2<br>08:50편 · 왕복</td></tr>
        <tr><td><b>도니치에코킷푸</b><br><span style="color:var(--muted)">주말 지하철 무제한</span></td><td class="mono">¥620 / 일</td><td>Day 4 · Day 5</td></tr>
      </table>
    </div>
  </div>

  <div class="card">
    <h3>⏰ 이것만 지키면 성공</h3>
    <div class="body">
      <table class="tt">
        <tr><td style="width:128px"><b>시라카와고 버스</b></td><td>✅ 예약·발권 완료 — <b>187054678</b> · 08:50 → 15:30 복귀 · 01C·01D</td></tr>
        <tr><td><b>마에사와규샤</b></td><td>✅ 예약 완료 — <b>SE2012284</b> · 10/23(금) 19:30 · 2명 · 반개인실</td></tr>
        <tr><td><b>야바톤</b></td><td>12:00 목표 — 20분 밀려도 뒤에 여유 있음</td></tr>
        <tr><td><b>호라이켄</b></td><td>17:35 대기 명부에 이름 올리기 — 토요일 1~2시간 대기, 마루젠에서 기다리기</td></tr>
        <tr><td><b>미라이타워</b></td><td>10/5~31 이벤트 운영 — <b>주간 16:10 최종입장</b>, 16:30~17:30 폐쇄, 야간 ¥1,800. 그래서 14:30 낮에</td></tr>
        <tr><td><b>나고야성</b></td><td>🌟 10/24은 <b>Be GOLD 야간개원 19:30까지 (공식 확정 · 17:00 점등)</b> — 이날만 시간 자유 · 관람료 <b>¥1,000/인</b> 2026-10-01 인상 · 망루·城宝館은 16:00 마감</td></tr>
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
          <li class="done"><span class="bx">✓</span><span><b>시라카와고 버스 왕복 예약 + 승차권 발권 완료</b> — 187054678 · 10/22 08:50편 + 15:30편 · 좌석 01C·01D</span></li>
          <li class="done"><span class="bx">✓</span><span><b>마에사와규샤 예약 완료</b> — SE2012284 · 10/23(금) 19:30 · 2명 · 반개인실 · 좌석만 예약</span></li>
          <li><span class="bx"></span><span>🐾 정야웅 맡기기 + 돌봄 가이드 공유</span></li>
          <li><span class="bx"></span><span><b>Visit Japan Web 등록</b> — 입국심사·세관 QR 2명 다 미리 발급. Day 1 입국 줄 10~20분 단축</span></li>
          <li><span class="bx"></span><span><b>환전 — 1인 ¥15,000 안팎 지폐</b> (마나카 ¥2,000 + 충전 ¥3,000 + 도니치에코킷푸 + 현금만 받는 덴무스·온천). 공항 도착 전에 끝내기</span></li>
          <li class="done"><span class="bx">✓</span><span><s>모바일 스이카</s> — Apple Pay 카드 없어서 포기 → Day 1 공항에서 실물 마나카로 결정</span></li>
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