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
