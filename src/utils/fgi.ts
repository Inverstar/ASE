let cachedData: {
  stock: any;
  crypto: any;
  gold: any;
  expiry: number;
} | null = null;

let cachedToken: string | null = null;

async function authenticate() {
  try {
    const response = await fetch('https://www.feargreedindex.org/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'your-username', password: 'your-password' })
    });
    if (!response.ok) throw new Error(`Authentication failed: ${response.status}`);
    const data = await response.json();
    cachedToken = data.accessToken;
    return cachedToken;
  } catch (error) {
    console.error('FGI API authentication error:', error);
    throw error;
  }
}

export async function fetchFgiData() {
  const now = Date.now();
  if (cachedData && now < cachedData.expiry) {
    return cachedData;
  }

  try {
    if (!cachedToken) {
      await authenticate();
    }

    const fetchEndpoint = async (url: string) => {
      let res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${cachedToken}` }
      });
      if (res.status === 401) {
        await authenticate();
        res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${cachedToken}` }
        });
      }
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
      return res.json();
    };

    const [stock, crypto, gold] = await Promise.all([
      fetchEndpoint('https://www.feargreedindex.org/api/fear-greed-data'),
      fetchEndpoint('https://www.feargreedindex.org/api/crypto-fear-greed-data'),
      fetchEndpoint('https://www.feargreedindex.org/api/gold-fear-greed-data')
    ]);

    // Clean historical data to remove anomalous dates (like year 1970/1974)
    const cleanHist = (list: any[]) => {
      return (list || []).filter(item => {
        const yr = new Date(item.timestamp).getFullYear();
        return yr >= 2010 && yr <= 2030;
      });
    };

    const result = {
      stock: {
        currentValue: Math.round(stock.currentValue),
        historicalData: cleanHist(stock.historicalData).map((item: any) => ({
          timestamp: item.timestamp,
          value: Math.round(item.value)
        }))
      },
      crypto: {
        currentValue: Math.round(crypto.currentValue),
        historicalData: cleanHist(crypto.historicalData).map((item: any) => ({
          timestamp: item.timestamp,
          value: Math.round(item.value)
        }))
      },
      gold: {
        currentValue: Math.round(gold.currentValue),
        historicalData: cleanHist(gold.historicalData).map((item: any) => ({
          timestamp: item.timestamp,
          value: Math.round(item.value)
        }))
      },
      expiry: now + 5 * 60 * 1000 // 5 minutes cache
    };

    cachedData = result;
    return result;
  } catch (err) {
    console.error('Error fetching FGI data from source:', err);
    // Return stale data if available to avoid crashing page
    if (cachedData) {
      console.warn('Returning stale FGI cached data due to fetch error');
      return cachedData;
    }
    throw err;
  }
}
