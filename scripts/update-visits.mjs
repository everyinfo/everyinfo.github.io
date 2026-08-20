// GA4 Data API에서 지난 28일 페이지뷰를 가져와서
// calculators-data.js / en/calculators-data-en.js 의 visits 값을 자동으로 갱신하는 스크립트
//
// 필요한 환경변수:
//   GA4_PROPERTY_ID          - GA4 속성 ID (숫자만, 예: 123456789)
//   GA4_SERVICE_ACCOUNT_KEY  - 서비스 계정 JSON 키 전체 내용 (문자열)
//
// GitHub Actions에서 매일 자동 실행되도록 설계됨 (.github/workflows/update-visits.yml 참고)

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import fs from 'fs';

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const SA_KEY_RAW = process.env.GA4_SERVICE_ACCOUNT_KEY;

if (!PROPERTY_ID || !SA_KEY_RAW) {
  console.error('GA4_PROPERTY_ID 또는 GA4_SERVICE_ACCOUNT_KEY 환경변수가 없습니다. 워크플로 secrets 설정을 확인하세요.');
  process.exit(1);
}

let credentials;
try {
  credentials = JSON.parse(SA_KEY_RAW);
} catch (e) {
  console.error('GA4_SERVICE_ACCOUNT_KEY가 올바른 JSON 형식이 아닙니다.');
  process.exit(1);
}

const client = new BetaAnalyticsDataClient({ credentials });

// GA4에서 pagePath별 조회수를 가져옴 (지난 28일)
async function fetchPageViews() {
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    limit: 5000,
  });

  const map = {};
  (response.rows || []).forEach(row => {
    let path = row.dimensionValues[0].value || '';
    // 쿼리스트링(공유링크 파라미터) 제거하고 순수 경로만 사용
    path = path.split('?')[0];
    const views = parseInt(row.metricValues[0].value, 10) || 0;
    map[path] = (map[path] || 0) + views;
  });
  return map;
}

// calculators-data.js 파일 하나를 읽어서, 각 계산기 항목의 url로 GA4 조회수를 찾아 visits 값을 교체
function updateFile(filePath, viewsMap) {
  let src = fs.readFileSync(filePath, 'utf-8');
  let updatedCount = 0;

  // 계산기 객체 하나하나({...})를 찾아서 그 안의 url과 visits를 매칭
  src = src.replace(/\{[^{}]*?url:\s*'([^']+)'[^{}]*?\}/g, (block, url) => {
    const views = viewsMap[url] || 0;
    const newBlock = block.replace(/visits:\s*\d+/, `visits: ${views}`);
    if (newBlock !== block) updatedCount++;
    return newBlock;
  });

  fs.writeFileSync(filePath, src, 'utf-8');
  console.log(`${filePath}: ${updatedCount}개 항목 갱신`);
}

async function main() {
  console.log('GA4에서 페이지뷰 데이터를 가져오는 중...');
  const viewsMap = await fetchPageViews();
  console.log(`총 ${Object.keys(viewsMap).length}개 경로의 데이터를 받았습니다.`);

  updateFile('calculators-data.js', viewsMap);
  updateFile('en/calculators-data-en.js', viewsMap);

  console.log('완료.');
}

main().catch(err => {
  console.error('실패:', err.message);
  process.exit(1);
});
