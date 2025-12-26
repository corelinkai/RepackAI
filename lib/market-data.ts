// Real market data integration using Google Custom Search API

export interface RealMarketListing {
  title: string;
  price: string;
  url: string;
  source: string;
  condition?: string;
  imageUrl?: string;
  snippet?: string;
}

export async function fetchRealMarketData(
  brand: string,
  category: string,
  model?: string
): Promise<RealMarketListing[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.warn('Google API credentials not configured, using simulated data');
    return [];
  }

  try {
    // Build search query targeting luxury resale platforms
    const searchQuery = buildMarketSearchQuery(brand, category, model);

    // Call Google Custom Search API
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}&num=10`
    );

    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse and format results
    const listings = parseSearchResults(data.items || []);

    return listings;
  } catch (error) {
    console.error('Market data fetch error:', error);
    return [];
  }
}

function buildMarketSearchQuery(brand: string, category: string, model?: string): string {
  const parts = [brand];

  if (model) {
    parts.push(model);
  } else {
    parts.push(category);
  }

  // Target specific resale platforms
  const platforms = [
    'site:vestiairecollective.com',
    'OR site:therealreal.com',
    'OR site:rebag.com',
    'OR site:fashionphile.com',
    'OR site:grailed.com',
  ].join(' ');

  return `${parts.join(' ')} ${platforms} resale price`;
}

function parseSearchResults(items: any[]): RealMarketListing[] {
  return items.map(item => {
    // Extract price from snippet or title
    const price = extractPrice(item.snippet || item.title);

    // Determine source from URL
    const source = extractSource(item.link);

    // Get image if available
    const imageUrl = item.pagemap?.cse_image?.[0]?.src ||
                     item.pagemap?.metatags?.[0]?.['og:image'];

    return {
      title: cleanTitle(item.title),
      price: price || 'Price on request',
      url: item.link,
      source,
      snippet: item.snippet,
      imageUrl,
    };
  }).filter(listing => listing.price !== 'Price on request'); // Filter out items without prices
}

function extractPrice(text: string): string | null {
  // Look for price patterns: $1,234 or $1234 or 1,234 USD
  const patterns = [
    /\$[\d,]+(?:\.\d{2})?/,
    /USD\s*[\d,]+(?:\.\d{2})?/,
    /[\d,]+(?:\.\d{2})?\s*USD/,
    /€[\d,]+(?:\.\d{2})?/,
    /£[\d,]+(?:\.\d{2})?/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

function extractSource(url: string): string {
  const domain = new URL(url).hostname;

  const sources: { [key: string]: string } = {
    'vestiairecollective.com': 'Vestiaire Collective',
    'therealreal.com': 'The RealReal',
    'rebag.com': 'Rebag',
    'fashionphile.com': 'Fashionphile',
    'grailed.com': 'Grailed',
    'ebay.com': 'eBay',
    'poshmark.com': 'Poshmark',
  };

  for (const [key, value] of Object.entries(sources)) {
    if (domain.includes(key)) {
      return value;
    }
  }

  return domain;
}

function cleanTitle(title: string): string {
  // Remove common suffixes like " | Vestiaire Collective"
  return title.split('|')[0].split('-')[0].trim();
}

// Alternative: Web scraping API integration
export async function fetchWithScraperAPI(
  brand: string,
  category: string,
  model?: string
): Promise<RealMarketListing[]> {
  const scraperApiKey = process.env.SCRAPER_API_KEY;

  if (!scraperApiKey) {
    return [];
  }

  try {
    // Example: Scrape Vestiaire Collective
    const searchUrl = `https://www.vestiairecollective.com/search/?q=${encodeURIComponent(`${brand} ${model || category}`)}`;

    const response = await fetch(
      `https://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(searchUrl)}`
    );

    const html = await response.text();

    // Parse HTML to extract product listings
    // This would require a proper HTML parser like cheerio
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Scraper API error:', error);
    return [];
  }
}

// Calculate market statistics
export interface MarketStatistics {
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  totalListings: number;
  priceDistribution: {
    low: number; // 25th percentile
    mid: number; // 50th percentile (median)
    high: number; // 75th percentile
  };
}

export function calculateMarketStats(listings: RealMarketListing[]): MarketStatistics | null {
  if (listings.length === 0) {
    return null;
  }

  // Extract numeric prices
  const prices = listings
    .map(l => extractNumericPrice(l.price))
    .filter((p): p is number => p !== null)
    .sort((a, b) => a - b);

  if (prices.length === 0) {
    return null;
  }

  const sum = prices.reduce((a, b) => a + b, 0);
  const average = sum / prices.length;

  return {
    averagePrice: Math.round(average),
    minPrice: prices[0],
    maxPrice: prices[prices.length - 1],
    totalListings: prices.length,
    priceDistribution: {
      low: prices[Math.floor(prices.length * 0.25)],
      mid: prices[Math.floor(prices.length * 0.5)],
      high: prices[Math.floor(prices.length * 0.75)],
    },
  };
}

function extractNumericPrice(priceString: string): number | null {
  const match = priceString.match(/[\d,]+(?:\.\d{2})?/);
  if (match) {
    return parseFloat(match[0].replace(/,/g, ''));
  }
  return null;
}
