import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, category, model, timeRange } = body;

    // Try to fetch from database first
    let priceHistory = await fetchFromDatabase(brand, category, model, timeRange);

    // If no data in database, generate sample data (for demonstration)
    if (priceHistory.length === 0) {
      console.log('No historical data found, using sample data');
      priceHistory = generateSampleHistory(brand, category, timeRange);
    }

    return NextResponse.json({
      success: true,
      history: priceHistory,
    });
  } catch (error) {
    console.error('Price history error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price history' },
      { status: 500 }
    );
  }
}

async function fetchFromDatabase(
  brand: string,
  category: string,
  model: string | undefined,
  timeRange: string
): Promise<any[]> {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '1M':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'ALL':
        startDate.setFullYear(startDate.getFullYear() - 5);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 3);
    }

    // Query price history from database
    let query = supabase
      .from('price_history')
      .select('*')
      .eq('brand', brand)
      .eq('category', category)
      .gte('recorded_at', startDate.toISOString())
      .lte('recorded_at', endDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (model) {
      query = query.eq('model', model);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching from database:', error);
    return [];
  }
}

function generateSampleHistory(brand: string, category: string, timeRange: string): any[] {
  const dataPoints = timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : timeRange === '6M' ? 180 : 365;
  const basePrice = getBasePrice(brand);
  const history = [];

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (dataPoints - i));

    // Add some realistic price fluctuation
    const trend = Math.sin(i / 30) * 100; // Cyclical trend
    const noise = (Math.random() - 0.5) * 200; // Random variation
    const price = basePrice + trend + noise;

    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price),
      min: Math.round(price * 0.9),
      max: Math.round(price * 1.1),
      volume: Math.floor(Math.random() * 50) + 10,
    });
  }

  return history;
}

function getBasePrice(brand: string): number {
  const brandPrices: { [key: string]: number } = {
    'Louis Vuitton': 2000,
    'Chanel': 4000,
    'Hermès': 10000,
    'Gucci': 1500,
    'Prada': 1200,
    'Dior': 2500,
    'Fendi': 2000,
    'Burberry': 1000,
    'Saint Laurent': 2000,
    'Balenciaga': 1500,
  };

  return brandPrices[brand] || 1000;
}
