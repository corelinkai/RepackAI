import { NextRequest, NextResponse } from 'next/server';
import { fetchRealMarketData, calculateMarketStats } from '@/lib/market-data';

interface MarketListing {
  title: string;
  price: string;
  url: string;
  source: string;
  condition?: string;
  imageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, brand, category, model } = body;

    // Try to fetch real market data first
    let listings: MarketListing[] = await fetchRealMarketData(brand, category, model);

    // If no real data available (API not configured), fall back to simulated data
    if (listings.length === 0) {
      console.log('Using simulated market data - configure Google API for real data');
      listings = await simulateMarketSearch(brand, category, model);
    }

    // Calculate market statistics
    const stats = calculateMarketStats(listings);

    return NextResponse.json({
      success: true,
      listings,
      stats,
      query,
    });
  } catch (error) {
    console.error('Market search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search market' },
      { status: 500 }
    );
  }
}

// Simulated market search - Replace with actual API calls or web scraping
async function simulateMarketSearch(
  brand: string,
  category: string,
  model?: string
): Promise<MarketListing[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const platforms = ['Vestiaire Collective', 'The RealReal', 'Rebag', 'Fashionphile', 'eBay'];
  const conditions = ['Excellent', 'Very Good', 'Good', 'Fair'];

  // Generate realistic pricing based on brand
  const brandPriceRanges: { [key: string]: { min: number; max: number } } = {
    'Louis Vuitton': { min: 800, max: 3500 },
    'Chanel': { min: 2000, max: 6000 },
    'Hermès': { min: 5000, max: 15000 },
    'Gucci': { min: 600, max: 2500 },
    'Prada': { min: 500, max: 2000 },
    'Dior': { min: 1500, max: 4000 },
    'Fendi': { min: 800, max: 3000 },
    'Burberry': { min: 400, max: 1800 },
    'Saint Laurent': { min: 900, max: 3500 },
    'Balenciaga': { min: 700, max: 2500 },
  };

  const priceRange = brandPriceRanges[brand] || { min: 300, max: 1500 };

  // Generate 8-12 realistic listings
  const numListings = Math.floor(Math.random() * 5) + 8;
  const listings: MarketListing[] = [];

  for (let i = 0; i < numListings; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    // Generate realistic price with variation
    const basePrice = priceRange.min + (priceRange.max - priceRange.min) * Math.random();
    const conditionMultiplier = {
      'Excellent': 1.0,
      'Very Good': 0.85,
      'Good': 0.7,
      'Fair': 0.55,
    }[condition] || 0.7;

    const price = Math.round(basePrice * conditionMultiplier / 50) * 50; // Round to nearest $50

    const modelName = model || `${category} Bag`;

    // Generate placeholder image URL based on category
    const imageUrl = generateProductImage(brand, category, i);

    listings.push({
      title: `${brand} ${modelName}`,
      price: `$${price.toLocaleString()}`,
      url: generatePlatformUrl(platform, brand, modelName),
      source: platform,
      condition,
      imageUrl,
    });
  }

  // Sort by price for easier comparison
  listings.sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[$,]/g, ''));
    const priceB = parseInt(b.price.replace(/[$,]/g, ''));
    return priceA - priceB;
  });

  return listings;
}

function generatePlatformUrl(platform: string, brand: string, model: string): string {
  const encodedBrand = encodeURIComponent(brand);
  const encodedModel = encodeURIComponent(model);

  const platformUrls: { [key: string]: string } = {
    'Vestiaire Collective': `https://www.vestiairecollective.com/search/?q=${encodedBrand}+${encodedModel}`,
    'The RealReal': `https://www.therealreal.com/search?q=${encodedBrand}+${encodedModel}`,
    'Rebag': `https://www.rebag.com/search?q=${encodedBrand}+${encodedModel}`,
    'Fashionphile': `https://www.fashionphile.com/search?q=${encodedBrand}+${encodedModel}`,
    'eBay': `https://www.ebay.com/sch/i.html?_nkw=${encodedBrand}+${encodedModel}`,
  };

  return platformUrls[platform] || `https://www.google.com/search?q=${encodedBrand}+${encodedModel}+resale`;
}

function generateProductImage(brand: string, category: string, index: number): string {
  // Using Unsplash for high-quality placeholder images
  // In production, you would fetch real product images from the platforms

  const imageQueries: { [key: string]: string } = {
    'Handbags': 'luxury-handbag',
    'Shoes - Women': 'luxury-heels',
    'Shoes - Men': 'luxury-mens-shoes',
    'Sneakers': 'luxury-sneakers',
    'Boots': 'luxury-boots',
    "Women's Dresses": 'luxury-dress',
    "Women's Coats & Jackets": 'luxury-coat',
    "Women's Blazers": 'luxury-blazer',
    "Men's Suits": 'luxury-suit',
    "Men's Jackets & Coats": 'luxury-jacket',
  };

  const query = imageQueries[category] || 'luxury-fashion';

  // Using Unsplash Source API for random fashion images
  // The seed ensures same images appear for same items
  const seed = `${brand}-${category}-${index}`;
  return `https://source.unsplash.com/600x800/?${query}&sig=${encodeURIComponent(seed)}`;
}

// For production use, here's an example of how to integrate with real web search:
/*
async function fetchRealMarketListings(
  brand: string,
  category: string,
  model?: string
): Promise<MarketListing[]> {
  const searchQuery = `${brand} ${model || category} resale price site:(rebag.com OR therealreal.com OR vestiairecollective.com)`;

  // Option 1: Use a web scraping API service
  const scraperApiKey = process.env.SCRAPER_API_KEY;
  const response = await fetch(
    `https://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(searchQuery)}`
  );

  // Option 2: Use Google Custom Search API
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const googleSearchId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  const googleResponse = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleSearchId}&q=${encodeURIComponent(searchQuery)}`
  );

  // Parse and return results
  const data = await googleResponse.json();
  return parseSearchResults(data);
}
*/
