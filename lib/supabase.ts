import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'premium' | 'enterprise';
  appraisals_count: number;
  created_at: string;
  updated_at: string;
}

export interface AppraisalRecord {
  id: string;
  user_id?: string;
  brand: string;
  category: string;
  model?: string;
  original_price: number;
  condition: string;
  has_tags: boolean;
  has_box: boolean;
  design_trend?: string;
  demand_level?: string;
  description?: string;
  images: string[];
  ai_brand_detection?: string;
  ai_model_detection?: string;
  ai_condition_score?: number;
  ai_confidence?: number;
  estimated_price: number;
  price_range_min: number;
  price_range_max: number;
  confidence_score: number;
  factors: any[];
  market_listings?: any[];
  market_average_price?: number;
  is_favorite: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  brand: string;
  category: string;
  model?: string;
  condition: string;
  average_price: number;
  min_price: number;
  max_price: number;
  sample_size: number;
  recorded_at: string;
}
