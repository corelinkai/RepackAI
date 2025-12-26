'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, Search, Loader2 } from 'lucide-react';
import { LuxuryItem } from '@/types';

interface MarketListing {
  title: string;
  price: string;
  url: string;
  source: string;
  condition?: string;
  imageUrl?: string;
}

interface MarketComparisonProps {
  item: LuxuryItem;
}

export default function MarketComparison({ item }: MarketComparisonProps) {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketListings();
  }, [item]);

  const fetchMarketListings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build search query
      const searchQuery = `${item.brand} ${item.model || item.category} resale price ${new Date().getFullYear()}`;

      // Call our API endpoint that will handle web scraping
      const response = await fetch('/api/market-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          brand: item.brand,
          category: item.category,
          model: item.model,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      const data = await response.json();
      setListings(data.listings || []);
    } catch (err) {
      console.error('Market comparison error:', err);
      setError('Unable to fetch market comparisons. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const extractPrice = (priceString: string): number | null => {
    const match = priceString.match(/[\$£€]?([0-9,]+\.?[0-9]*)/);
    if (match && match[1]) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
    return null;
  };

  const calculateAveragePrice = (): string => {
    const prices = listings
      .map(l => extractPrice(l.price))
      .filter((p): p is number => p !== null);

    if (prices.length === 0) return 'N/A';

    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(avg);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
          <span className="ml-3 text-gray-600">Searching market listings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-sm text-gray-600">No market listings found for comparison.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-luxury-lg">
      {/* Header */}
      <div className="gradient-luxury text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold-400/20 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-gold-300" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold">Market Comparison</h3>
              <p className="text-sm opacity-90">
                Similar {item.brand} {item.category.toLowerCase()} currently listed
              </p>
            </div>
          </div>

          {/* Average Price Badge */}
          <div className="bg-gold-400/20 backdrop-blur rounded-xl p-4 text-center min-w-[140px]">
            <p className="text-xs opacity-75 mb-1">Market Average</p>
            <p className="text-2xl font-bold text-gold-200">{calculateAveragePrice()}</p>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Listings */}
      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gold-400 scrollbar-track-gray-100">
          {listings.map((listing, index) => (
            <a
              key={index}
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 w-72 bg-warm-50 rounded-xl overflow-hidden border border-gray-200 hover:border-gold-400 hover:shadow-gold transition-all snap-start"
            >
              {/* Product Image */}
              <div className="relative h-96 bg-gray-100 overflow-hidden">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Search className="w-16 h-16 text-gray-300" />
                  </div>
                )}

                {/* Price Overlay */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-full font-bold">
                  {listing.price}
                </div>

                {/* Condition Badge */}
                {listing.condition && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-xs font-medium">
                    {listing.condition}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors">
                  {listing.title}
                </h4>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{listing.source}</span>
                  <div className="flex items-center gap-1 text-gold-600 font-medium">
                    View
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Scroll Indicator */}
        {listings.length > 3 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              ← Scroll to see all {listings.length} listings →
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-warm-50 border-t border-gray-200 p-4">
        <p className="text-xs text-gray-600 text-center">
          <strong className="text-gold-600">Note:</strong> Market prices are for reference only and may vary by condition, authenticity, and seller.
          Images and prices updated in real-time from luxury resale platforms.
        </p>
      </div>
    </div>
  );
}
