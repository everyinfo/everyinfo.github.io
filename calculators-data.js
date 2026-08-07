// 계산기가 늘어날 때마다 이 배열에 한 줄씩 추가하세요.
// index.html의 홈 화면 카드와, 각 계산기 페이지의 "다른 계산기 검색"에서 공통으로 사용됩니다.
// visits: 최근 3개월 방문수. 실제 애널리틱스 연동 전까지는 예시값(0)입니다.
window.CALCULATORS = [
  {
    emoji: '🎊',
    cat: '일상',
    title: '환갑 고희 계산기',
    desc: '생년월일로 환갑·고희·진갑·팔순 등 전통 나이 이정표와 D-Day를 계산해요.',
    url: '/calculators/hwangap.html',
    active: true,
    visits: 0
  },
  {
    emoji: '💰',
    cat: '금융',
    title: '연봉 실수령액 계산기',
    desc: '세금·4대보험 공제 후 실제로 받는 월급을 계산해요.',
    url: '#',
    active: false,
    visits: 0
  },
  {
    emoji: '🏦',
    cat: '금융',
    title: '대출이자 계산기',
    desc: '원리금균등/원금균등 방식별 월 상환액을 계산해요.',
    url: '#',
    active: false,
    visits: 0
  },
];
