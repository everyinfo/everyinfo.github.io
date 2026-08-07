// 단위변환 계산기 20종 데이터. 모든 단위변환 페이지가 공통으로 불러다 씁니다.
// type: 'linear'(배율 변환) | 'temperature' | 'fuel' | 'currency' | 'table'(조견표)
window.UNIT_CATEGORIES = {

  currency: {
    name: '환율', emoji: '💱', type: 'currency', order: 5,
    note: '시장 기준환율(참고용)이며, 은행 고시환율(현찰 사매도)과는 스프레드만큼 차이가 있을 수 있어요.',
    units: {
      krw:{label:'원 (KRW)'}, usd:{label:'달러 (USD)'}, jpy:{label:'엔 (JPY)'},
      eur:{label:'유로 (EUR)'}, cny:{label:'위안 (CNY)'}, gbp:{label:'파운드 (GBP)'}
    }
  },

  length: {
    name: '길이', emoji: '📏', type: 'linear', order: 1, base: 'm',
    units: {
      mm:{label:'밀리미터(mm)',factor:0.001}, cm:{label:'센티미터(cm)',factor:0.01},
      m:{label:'미터(m)',factor:1}, km:{label:'킬로미터(km)',factor:1000},
      inch:{label:'인치(in)',factor:0.0254}, ft:{label:'피트(ft)',factor:0.3048},
      yd:{label:'야드(yd)',factor:0.9144}, mile:{label:'마일(mi)',factor:1609.344}
    }
  },

  weight: {
    name: '무게', emoji: '⚖️', type: 'linear', order: 2, base: 'g',
    units: {
      mg:{label:'밀리그램(mg)',factor:0.001}, g:{label:'그램(g)',factor:1},
      kg:{label:'킬로그램(kg)',factor:1000}, t:{label:'톤(t)',factor:1000000},
      oz:{label:'온스(oz)',factor:28.3495}, lb:{label:'파운드(lb)',factor:453.592},
      geun:{label:'근',factor:600}, don:{label:'돈',factor:3.75}
    }
  },

  volume: {
    name: '부피', emoji: '🧴', type: 'linear', order: 4, base: 'mL',
    units: {
      mL:{label:'밀리리터(mL)',factor:1}, L:{label:'리터(L)',factor:1000},
      gal:{label:'갤런(US gal)',factor:3785.41}, pint:{label:'파인트(pt)',factor:473.176},
      flozUs:{label:'액량온스(fl oz)',factor:29.5735}, cupUs:{label:'미국 컵(cup)',factor:236.588}
    }
  },

  cooking: {
    name: '요리계량', emoji: '🥄', type: 'linear', order: 18, base: 'mL',
    note: '한국 계량컵/종이컵 기준입니다. 브랜드나 제품에 따라 실제 용량은 조금씩 다를 수 있어요.',
    units: {
      tsp:{label:'작은술(티스푼, 5mL)',factor:5}, tbsp:{label:'큰술(테이블스푼, 15mL)',factor:15},
      paperCup:{label:'종이컵(180mL)',factor:180}, cupKr:{label:'계량컵(200mL)',factor:200},
      mL:{label:'밀리리터(mL)',factor:1}, L:{label:'리터(L)',factor:1000}
    }
  },

  temperature: {
    name: '온도', emoji: '🌡️', type: 'temperature', order: 6,
    units: { C:{label:'섭씨(°C)'}, F:{label:'화씨(°F)'}, K:{label:'켈빈(K)'} }
  },

  speed: {
    name: '속도', emoji: '🚗', type: 'linear', order: 8, base: 'mps',
    units: {
      mps:{label:'미터/초(m/s)',factor:1}, kmh:{label:'킬로미터/시(km/h)',factor:0.277778},
      mph:{label:'마일/시(mph)',factor:0.44704}, knot:{label:'노트(kn)',factor:0.514444}
    }
  },

  pressure: {
    name: '압력', emoji: '🌪️', type: 'linear', order: 7, base: 'Pa',
    units: {
      Pa:{label:'파스칼(Pa)',factor:1}, kPa:{label:'킬로파스칼(kPa)',factor:1000},
      bar:{label:'바(bar)',factor:100000}, atm:{label:'기압(atm)',factor:101325},
      psi:{label:'psi',factor:6894.76}, mmHg:{label:'수은주밀리미터(mmHg)',factor:133.322}
    }
  },

  area: {
    name: '넓이·평수', emoji: '📐', type: 'linear', order: 3, base: 'm2',
    units: {
      m2:{label:'제곱미터(㎡)',factor:1}, cm2:{label:'제곱센티미터(㎠)',factor:0.0001},
      km2:{label:'제곱킬로미터(㎢)',factor:1000000}, py:{label:'평',factor:3.3058},
      ha:{label:'헥타르(ha)',factor:10000}, acre:{label:'에이커',factor:4046.86},
      ft2:{label:'제곱피트(ft²)',factor:0.092903}
    }
  },

  data: {
    name: '데이터 용량', emoji: '💾', type: 'linear', order: 14, base: 'byte',
    units: {
      bit:{label:'비트(bit)',factor:0.125}, byte:{label:'바이트(B)',factor:1},
      KB:{label:'킬로바이트(KB)',factor:1024}, MB:{label:'메가바이트(MB)',factor:1048576},
      GB:{label:'기가바이트(GB)',factor:1073741824}, TB:{label:'테라바이트(TB)',factor:1099511627776}
    }
  },

  time: {
    name: '시간', emoji: '⏱️', type: 'linear', order: 15, base: 'sec',
    units: {
      sec:{label:'초',factor:1}, min:{label:'분',factor:60}, hour:{label:'시간',factor:3600},
      day:{label:'일',factor:86400}, week:{label:'주',factor:604800},
      month:{label:'개월(30일 기준)',factor:2592000}, year:{label:'년(365일 기준)',factor:31536000}
    }
  },

  fuel: {
    name: '연비', emoji: '⛽', type: 'fuel', order: 16,
    note: '갤런은 미국(US)·영국(UK) 갤런 크기가 달라 mpg 값이 차이 나요.',
    units: {
      kml:{label:'km/L'}, l100km:{label:'L/100km'}, mpgUs:{label:'mpg(US)'}, mpgUk:{label:'mpg(UK)'}
    }
  },

  ev: {
    name: '전기차 전비', emoji: '🔌', type: 'ev', order: 17,
    note: 'km/kWh는 숫자가 클수록, Wh/km는 작을수록 효율이 좋아요. 국내 표기는 주로 km/kWh를 씁니다.',
    units: {
      kmkwh:{label:'km/kWh (국내 표기)'}, whkm:{label:'Wh/km'},
      kwh100km:{label:'kWh/100km (유럽 표기)'}, mikwh:{label:'mi/kWh (미국 표기)'},
      mpge:{label:'MPGe (미국 환산연비)'}
    }
  },

  energy: {
    name: '에너지', emoji: '🔋', type: 'linear', order: 10, base: 'J',
    units: {
      J:{label:'줄(J)',factor:1}, kJ:{label:'킬로줄(kJ)',factor:1000},
      cal:{label:'칼로리(cal)',factor:4.184}, kcal:{label:'킬로칼로리(kcal)',factor:4184},
      Wh:{label:'와트시(Wh)',factor:3600}, kWh:{label:'킬로와트시(kWh)',factor:3600000},
      BTU:{label:'BTU',factor:1055.06}
    }
  },

  angle: {
    name: '각도', emoji: '🧭', type: 'linear', order: 13, base: 'deg',
    units: {
      deg:{label:'도(°)',factor:1}, rad:{label:'라디안(rad)',factor:57.29578},
      grad:{label:'그라디안(gon)',factor:0.9}
    }
  },

  force: {
    name: '힘', emoji: '💪', type: 'linear', order: 11, base: 'N',
    units: {
      N:{label:'뉴턴(N)',factor:1}, kgf:{label:'킬로그램힘(kgf)',factor:9.80665},
      lbf:{label:'파운드힘(lbf)',factor:4.44822}, dyne:{label:'다인(dyn)',factor:0.00001}
    }
  },

  power: {
    name: '일률(마력)', emoji: '🏎️', type: 'linear', order: 9, base: 'W',
    units: {
      W:{label:'와트(W)',factor:1}, kW:{label:'킬로와트(kW)',factor:1000},
      hp:{label:'마력(HP, 영마력)',factor:745.7}, ps:{label:'PS(불마력)',factor:735.499}
    }
  },

  density: {
    name: '밀도', emoji: '🧪', type: 'linear', order: 12, base: 'kgm3',
    units: {
      kgm3:{label:'kg/㎥',factor:1}, gcm3:{label:'g/㎤',factor:1000},
      gml:{label:'g/mL',factor:1000}, lbft3:{label:'lb/ft³',factor:16.0185}
    }
  },

  shoe: {
    name: '신발 사이즈', emoji: '👟', type: 'table', order: 19,
    note: '브랜드·제품에 따라 실제 사이즈는 차이가 있을 수 있어요. 참고용 조견표입니다.',
    columns: ['mm','usM','usW','uk','eu'],
    labels: {mm:'발길이(mm)', usM:'US(남)', usW:'US(여)', uk:'UK', eu:'EU'},
    table: [
      {mm:220,usM:null,usW:5,uk:3,eu:35}, {mm:225,usM:6,usW:5.5,uk:3.5,eu:36},
      {mm:230,usM:6.5,usW:6,uk:4,eu:36.5}, {mm:235,usM:7,usW:6.5,uk:4.5,eu:37},
      {mm:240,usM:7.5,usW:7,uk:5,eu:38}, {mm:245,usM:8,usW:7.5,uk:5.5,eu:38.5},
      {mm:250,usM:8.5,usW:8,uk:6,eu:39}, {mm:255,usM:9,usW:8.5,uk:6.5,eu:40},
      {mm:260,usM:9.5,usW:9,uk:7,eu:40.5}, {mm:265,usM:10,usW:9.5,uk:7.5,eu:41},
      {mm:270,usM:10.5,usW:10,uk:8,eu:42}, {mm:275,usM:11,usW:10.5,uk:8.5,eu:42.5},
      {mm:280,usM:11.5,usW:11,uk:9,eu:43}, {mm:285,usM:12,usW:null,uk:9.5,eu:44},
      {mm:290,usM:12.5,usW:null,uk:10,eu:44.5}
    ]
  },

  clothing: {
    name: '옷 사이즈', emoji: '👕', type: 'table', order: 20,
    note: '브랜드·성별·의류 종류에 따라 실제 사이즈는 다를 수 있어요. 참고용 조견표입니다.',
    columns: ['kr','us','eu'],
    labels: {kr:'한국', us:'US', eu:'EU'},
    table: [
      {kr:44,us:'0 (XS)',eu:34}, {kr:55,us:'2-4 (S)',eu:36},
      {kr:66,us:'6-8 (M)',eu:38}, {kr:77,us:'10-12 (L)',eu:42},
      {kr:88,us:'14 (XL)',eu:46}, {kr:99,us:'16 (XXL)',eu:48}
    ]
  },

  glucose: {
    name: '혈당 단위', emoji: '🩸', type: 'linear', order: 21, base: 'mgdl',
    units: { mgdl:{label:'mg/dL',factor:1}, mmol:{label:'mmol/L',factor:18.0182} }
  }
};
