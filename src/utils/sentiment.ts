// Seedable random number generator for stable charts per day
function createRng(seed: number) {
  let s = seed;
  return function () {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface AaiiPoint {
  timestamp: string;
  bullish: number;
  bearish: number;
  neutral: number;
}

export function generateIndicatorData() {
  // Use current day as seed base so history is stable within the same day
  const msInDay = 24 * 60 * 60 * 1000;
  const todayStart = Math.floor(Date.now() / msInDay) * msInDay;
  const daySeed = Math.floor(todayStart / msInDay);

  const pointsCount = 365;

  const generateRandomWalk = (
    seedOffset: number,
    startVal: number,
    minVal: number,
    maxVal: number,
    step: number
  ): MetricPoint[] => {
    const rand = createRng(daySeed + seedOffset);
    const result: MetricPoint[] = [];
    let current = startVal;

    for (let i = pointsCount - 1; i >= 0; i--) {
      const ts = todayStart - i * msInDay;
      const change = (rand() - 0.5) * step;
      current = Math.max(minVal, Math.min(maxVal, current + change));
      
      // Introduce periodic minor shocks
      if (rand() > 0.97) {
        const shock = (rand() - 0.5) * step * 3;
        current = Math.max(minVal, Math.min(maxVal, current + shock));
      }

      result.push({
        timestamp: new Date(ts).toISOString().split('T')[0],
        value: current
      });
    }
    return result;
  };

  // 1. VIX: Ranges 12-45
  const vixHistory = generateRandomWalk(100, 18, 10, 50, 1.8);
  const currentVix = vixHistory[vixHistory.length - 1].value;

  // 2. Put/Call Ratio (PCR): Ranges 0.55-1.25
  const pcrHistory = generateRandomWalk(200, 0.78, 0.45, 1.4, 0.05);
  const currentPcr = pcrHistory[pcrHistory.length - 1].value;

  // 3. Dollar Index (DXY): Ranges 98-107
  const dxyHistory = generateRandomWalk(300, 103.5, 96, 110, 0.3);
  const currentDxy = dxyHistory[dxyHistory.length - 1].value;

  // 4. NAAIM Exposure Index: Ranges 35-105
  const naaimHistory = generateRandomWalk(400, 75, 15, 120, 4.5);
  const currentNaaim = naaimHistory[naaimHistory.length - 1].value;

  // 5. US 10-Year Treasury Yield: Ranges 3.2% - 5.0%
  const us10yHistory = generateRandomWalk(500, 4.25, 2.8, 5.2, 0.06);
  const currentUs10y = us10yHistory[us10yHistory.length - 1].value;

  // 6. AAII Investor Sentiment (Bullish/Bearish/Neutral)
  const aaiiHistory: AaiiPoint[] = [];
  const randAaii = createRng(daySeed + 600);
  let bullish = 38;
  let bearish = 32;

  for (let i = pointsCount - 1; i >= 0; i--) {
    const ts = todayStart - i * msInDay;
    bullish = Math.max(15, Math.min(65, bullish + (randAaii() - 0.5) * 3));
    bearish = Math.max(12, Math.min(60, bearish + (randAaii() - 0.5) * 3));
    const total = bullish + bearish;
    
    // Normalize to keep some neutral room
    let finalBull = bullish;
    let finalBear = bearish;
    if (total > 85) {
      const scale = 85 / total;
      finalBull = bullish * scale;
      finalBear = bearish * scale;
    }
    const neutral = 100 - finalBull - finalBear;

    aaiiHistory.push({
      timestamp: new Date(ts).toISOString().split('T')[0],
      bullish: Math.round(finalBull),
      bearish: Math.round(finalBear),
      neutral: Math.round(neutral)
    });
  }
  const currentAaii = aaiiHistory[aaiiHistory.length - 1];

  return {
    vix: {
      currentValue: currentVix,
      historicalData: vixHistory
    },
    pcr: {
      currentValue: currentPcr,
      historicalData: pcrHistory
    },
    dxy: {
      currentValue: currentDxy,
      historicalData: dxyHistory
    },
    naaim: {
      currentValue: currentNaaim,
      historicalData: naaimHistory
    },
    us10y: {
      currentValue: currentUs10y,
      historicalData: us10yHistory
    },
    aaii: {
      currentValue: currentAaii,
      historicalData: aaiiHistory
    }
  };
}

export function generateChinaIndicatorData() {
  const msInDay = 24 * 60 * 60 * 1000;
  const todayStart = Math.floor(Date.now() / msInDay) * msInDay;
  const daySeed = Math.floor(todayStart / msInDay);

  const pointsCount = 365;

  const generateRandomWalk = (
    seedOffset: number,
    startVal: number,
    minVal: number,
    maxVal: number,
    step: number
  ): MetricPoint[] => {
    const rand = createRng(daySeed + seedOffset);
    const result: MetricPoint[] = [];
    let current = startVal;

    for (let i = pointsCount - 1; i >= 0; i--) {
      const ts = todayStart - i * msInDay;
      const change = (rand() - 0.5) * step;
      current = Math.max(minVal, Math.min(maxVal, current + change));
      
      // Introduce periodic minor shocks
      if (rand() > 0.97) {
        const shock = (rand() - 0.5) * step * 3;
        current = Math.max(minVal, Math.min(maxVal, current + shock));
      }

      result.push({
        timestamp: new Date(ts).toISOString().split('T')[0],
        value: Number(current.toFixed(2))
      });
    }
    return result;
  };

  // Generate historical walks:
  // 1. A-share PE valuation temperature: range 10-98
  const aShareTempHistory = generateRandomWalk(1000, 75.0, 10, 98, 1.2);
  aShareTempHistory[aShareTempHistory.length - 1].value = 82.3;
  const currentAShareTemp = aShareTempHistory[aShareTempHistory.length - 1].value;

  // 2. HK PE valuation temperature: range 8-95
  const hkTempHistory = generateRandomWalk(2000, 45.0, 8, 95, 1.5);
  hkTempHistory[hkTempHistory.length - 1].value = 49.7;
  const currentHkTemp = hkTempHistory[hkTempHistory.length - 1].value;

  // 3. China Overseas Internet PE temperature: range 5-95
  const chinaInternetTempHistory = generateRandomWalk(3000, 30.0, 5, 95, 1.8);
  chinaInternetTempHistory[chinaInternetTempHistory.length - 1].value = 35.5;
  const currentChinaInternetTemp = chinaInternetTempHistory[chinaInternetTempHistory.length - 1].value;

  // 4. Overall Sentiment temperature: range 5-95
  const sentimentTempHistory = generateRandomWalk(4000, 20.0, 5, 95, 1.5);
  sentimentTempHistory[sentimentTempHistory.length - 1].value = 23.4;
  const currentSentimentTemp = sentimentTempHistory[sentimentTempHistory.length - 1].value;

  // 5. China FGI Index: range 5-95
  const chinaFgiHistory = generateRandomWalk(5000, 25.0, 5, 95, 2.0);
  chinaFgiHistory[chinaFgiHistory.length - 1].value = 29.40;
  const currentChinaFgi = chinaFgiHistory[chinaFgiHistory.length - 1].value;

  // 6. Volume: range 4500-38000 100M CNY
  const volumeHistory = generateRandomWalk(6000, 20000.00, 4500, 38000, 600);
  volumeHistory[volumeHistory.length - 1].value = 26192.43;
  const currentVolume = volumeHistory[volumeHistory.length - 1].value;

  // 7. Breadth: range 5-95 (%)
  const breadthHistory = generateRandomWalk(7000, 25.0, 5, 95, 1.8);
  breadthHistory[breadthHistory.length - 1].value = 29.0;
  const currentBreadth = breadthHistory[breadthHistory.length - 1].value;

  // 8. Limit Up/Down ratio: range 0.1-10.0
  const limitRatioHistory = generateRandomWalk(8000, 1.0, 0.1, 10.0, 0.15);
  limitRatioHistory[limitRatioHistory.length - 1].value = 1.13;
  const currentLimitRatio = limitRatioHistory[limitRatioHistory.length - 1].value;

  // 9. RSI: range 10-90
  const rsiHistory = generateRandomWalk(9000, 30.0, 10, 90, 1.8);
  rsiHistory[rsiHistory.length - 1].value = 36.3;
  const currentRsi = rsiHistory[rsiHistory.length - 1].value;

  // 10. HS300 PE, PB, PS:
  const hs300PeHistory = generateRandomWalk(10100, 11.2, 8.0, 20.0, 0.08);
  hs300PeHistory[hs300PeHistory.length - 1].value = 14.30;
  const currentHs300Pe = hs300PeHistory[hs300PeHistory.length - 1].value;

  const hs300PbHistory = generateRandomWalk(10200, 1.35, 1.0, 2.5, 0.01);
  hs300PbHistory[hs300PbHistory.length - 1].value = 1.43;
  const currentHs300Pb = hs300PbHistory[hs300PbHistory.length - 1].value;

  const hs300PsHistory = generateRandomWalk(10300, 1.25, 0.8, 2.8, 0.01);
  hs300PsHistory[hs300PsHistory.length - 1].value = 1.55;
  const currentHs300Ps = hs300PsHistory[hs300PsHistory.length - 1].value;

  // 11. A-share FGI from feargreedindex.world: range 5-95, starts around 42.0
  // Live value pinned to 39 (中性) — source: feargreedindex.world (updated 2026-06-11)
  const aShareFgiHistory = generateRandomWalk(11000, 42.0, 5, 95, 2.0);
  aShareFgiHistory[aShareFgiHistory.length - 1].value = 39.0;
  const currentAShareFgi = aShareFgiHistory[aShareFgiHistory.length - 1].value;

  // 12. HK FGI from feargreedindex.world: range 5-95, starts around 28.0
  // Live value pinned to 22 (恐惧) — source: feargreedindex.world (updated 2026-06-11)
  const hkFgiHistory = generateRandomWalk(12000, 28.0, 5, 95, 2.2);
  hkFgiHistory[hkFgiHistory.length - 1].value = 22.0;
  const currentHkFgi = hkFgiHistory[hkFgiHistory.length - 1].value;

  // 13. sectorAi: range 10-95, starts around 82.5
  const sectorAiHistory = generateRandomWalk(13000, 82.5, 10, 95, 1.8);
  const currentSectorAi = sectorAiHistory[sectorAiHistory.length - 1].value;

  // 14. sectorSemiconductor: range 5-95, starts around 18.2
  const sectorSemiconductorHistory = generateRandomWalk(14000, 18.2, 5, 95, 1.5);
  const currentSectorSemiconductor = sectorSemiconductorHistory[sectorSemiconductorHistory.length - 1].value;

  // 15. sector3rdSemi: range 5-95, starts around 22.4
  const sector3rdSemiHistory = generateRandomWalk(15000, 22.4, 5, 95, 1.6);
  const currentSector3rdSemi = sector3rdSemiHistory[sector3rdSemiHistory.length - 1].value;

  return {
    aShareTemp: { currentValue: currentAShareTemp, historicalData: aShareTempHistory },
    hkTemp: { currentValue: currentHkTemp, historicalData: hkTempHistory },
    chinaInternetTemp: { currentValue: currentChinaInternetTemp, historicalData: chinaInternetTempHistory },
    sentimentTemp: { currentValue: currentSentimentTemp, historicalData: sentimentTempHistory },
    chinaFgi: { currentValue: currentChinaFgi, historicalData: chinaFgiHistory },
    volume: { currentValue: currentVolume, historicalData: volumeHistory },
    breadth: { currentValue: currentBreadth, historicalData: breadthHistory },
    limitRatio: { currentValue: currentLimitRatio, historicalData: limitRatioHistory },
    rsi: { currentValue: currentRsi, historicalData: rsiHistory },
    hs300Pe: { currentValue: currentHs300Pe, historicalData: hs300PeHistory, percentile: 85.2 },
    hs300Pb: { currentValue: currentHs300Pb, historicalData: hs300PbHistory, percentile: 42.0 },
    hs300Ps: { currentValue: currentHs300Ps, historicalData: hs300PsHistory, percentile: 91.3 },
    aShareFgi: { currentValue: currentAShareFgi, historicalData: aShareFgiHistory },
    hkFgi: { currentValue: currentHkFgi, historicalData: hkFgiHistory },
    sectorAi: {
      currentValue: currentSectorAi,
      historicalData: sectorAiHistory,
      subSectors: [
        { name: 'AIGC大模型', value: 86.0, state: '极度贪婪' },
        { name: 'AI算力服务器', value: 81.0, state: '极度贪婪' },
        { name: '智能机器人', value: 64.0, state: '贪婪' },
        { name: 'AI应用端', value: 48.0, state: '中性' }
      ]
    },
    sectorSemiconductor: {
      currentValue: currentSectorSemiconductor,
      historicalData: sectorSemiconductorHistory,
      subSectors: [
        { name: '光刻机设备', value: 15.0, state: '极度恐惧' },
        { name: '芯片设计', value: 19.0, state: '极度恐惧' },
        { name: '集成电路封测', value: 38.0, state: '恐惧' },
        { name: 'EDA软件', value: 43.0, state: '恐惧' }
      ]
    },
    sector3rdSemi: {
      currentValue: currentSector3rdSemi,
      historicalData: sector3rdSemiHistory,
      subSectors: [
        { name: '碳化硅衬底', value: 12.0, state: '极度恐惧' },
        { name: '氮化镓器件', value: 21.0, state: '极度恐惧' },
        { name: '功率半导体', value: 35.0, state: '恐惧' }
      ]
    }
  };
}

