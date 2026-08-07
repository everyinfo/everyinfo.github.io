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
  {
    emoji: '💱',
    cat: '단위변환',
    title: '환율 계산기',
    desc: '원화 기준 달러, 엔, 유로 등 실시간에 가까운 환율로 변환해요.',
    url: '/calculators/unit-currency.html',
    active: true,
    visits: 0
  },
  {
    emoji: '📏',
    cat: '단위변환',
    title: '길이 단위 변환',
    desc: 'mm, cm, m부터 인치, 피트, 마일까지 길이 단위를 변환해요.',
    url: '/calculators/unit-length.html',
    active: true,
    visits: 0
  },
  {
    emoji: '⚖️',
    cat: '단위변환',
    title: '무게 단위 변환',
    desc: 'g, kg부터 근, 돈, 파운드까지 무게 단위를 변환해요.',
    url: '/calculators/unit-weight.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🧴',
    cat: '단위변환',
    title: '부피 단위 변환',
    desc: 'mL, L부터 갤런, 컵까지 부피 단위를 변환해요.',
    url: '/calculators/unit-volume.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🥄',
    cat: '단위변환',
    title: '요리계량 변환',
    desc: '큰술, 작은술, 종이컵, 계량컵을 mL·L로 변환해요.',
    url: '/calculators/unit-cooking.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🌡️',
    cat: '단위변환',
    title: '온도 단위 변환',
    desc: '섭씨, 화씨, 켈빈 온도를 서로 변환해요.',
    url: '/calculators/unit-temperature.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🚗',
    cat: '단위변환',
    title: '속도 단위 변환',
    desc: 'm/s, km/h, mph, 노트 속도를 변환해요.',
    url: '/calculators/unit-speed.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🌪️',
    cat: '단위변환',
    title: '압력 단위 변환',
    desc: 'Pa, bar, atm, psi, mmHg 압력을 변환해요.',
    url: '/calculators/unit-pressure.html',
    active: true,
    visits: 0
  },
  {
    emoji: '📐',
    cat: '단위변환',
    title: '넓이·평수 변환',
    desc: '제곱미터, 평, 헥타르, 에이커 넓이를 변환해요.',
    url: '/calculators/unit-area.html',
    active: true,
    visits: 0
  },
  {
    emoji: '💾',
    cat: '단위변환',
    title: '데이터 용량 변환',
    desc: 'bit, byte, KB, MB, GB, TB 용량을 변환해요.',
    url: '/calculators/unit-data.html',
    active: true,
    visits: 0
  },
  {
    emoji: '⏱️',
    cat: '단위변환',
    title: '시간 단위 변환',
    desc: '초, 분, 시간, 일, 주, 년 등을 변환해요.',
    url: '/calculators/unit-time.html',
    active: true,
    visits: 0
  },
  {
    emoji: '⛽',
    cat: '단위변환',
    title: '연비 단위 변환',
    desc: 'km/L, L/100km, mpg 연비를 서로 변환해요.',
    url: '/calculators/unit-fuel.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🔌',
    cat: '단위변환',
    title: '전기차 전비 계산기',
    desc: 'km/kWh, Wh/km, kWh/100km, MPGe 전비 단위를 변환해요.',
    url: '/calculators/unit-ev.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🔋',
    cat: '단위변환',
    title: '에너지 단위 변환',
    desc: 'J, cal, kcal, Wh, kWh, BTU 에너지를 변환해요.',
    url: '/calculators/unit-energy.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🧭',
    cat: '단위변환',
    title: '각도 단위 변환',
    desc: '도, 라디안, 그라디안 각도를 변환해요.',
    url: '/calculators/unit-angle.html',
    active: true,
    visits: 0
  },
  {
    emoji: '💪',
    cat: '단위변환',
    title: '힘 단위 변환',
    desc: 'N, kgf, lbf, dyne 힘의 단위를 변환해요.',
    url: '/calculators/unit-force.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🏎️',
    cat: '단위변환',
    title: '일률·마력 변환',
    desc: 'W, kW, 마력(HP), PS 일률을 변환해요.',
    url: '/calculators/unit-power.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🧪',
    cat: '단위변환',
    title: '밀도 단위 변환',
    desc: 'kg/㎥, g/㎤, g/mL, lb/ft³ 밀도를 변환해요.',
    url: '/calculators/unit-density.html',
    active: true,
    visits: 0
  },
  {
    emoji: '👟',
    cat: '단위변환',
    title: '신발 사이즈 변환',
    desc: 'mm 발길이를 US, UK, EU 사이즈로 변환해요.',
    url: '/calculators/unit-shoe.html',
    active: true,
    visits: 0
  },
  {
    emoji: '👕',
    cat: '단위변환',
    title: '옷 사이즈 변환',
    desc: '한국 옷 사이즈를 US, EU 사이즈로 변환해요.',
    url: '/calculators/unit-clothing.html',
    active: true,
    visits: 0
  },
  {
    emoji: '🩸',
    cat: '단위변환',
    title: '혈당 단위 변환',
    desc: '혈당 수치를 mg/dL과 mmol/L로 변환해요.',
    url: '/calculators/unit-glucose.html',
    active: true,
    visits: 0
  },
];
