-- RepackAI Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
  appraisals_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appraisals table
CREATE TABLE public.appraisals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Item details
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  model TEXT,
  original_price DECIMAL(10, 2) NOT NULL,
  condition TEXT NOT NULL,
  has_tags BOOLEAN DEFAULT FALSE,
  has_box BOOLEAN DEFAULT FALSE,
  design_trend TEXT,
  demand_level TEXT,
  description TEXT,

  -- Images
  images JSONB DEFAULT '[]'::jsonb,

  -- AI Analysis Results
  ai_brand_detection TEXT,
  ai_model_detection TEXT,
  ai_condition_score DECIMAL(3, 1),
  ai_confidence INTEGER,

  -- Appraisal Results
  estimated_price DECIMAL(10, 2) NOT NULL,
  price_range_min DECIMAL(10, 2) NOT NULL,
  price_range_max DECIMAL(10, 2) NOT NULL,
  confidence_score INTEGER NOT NULL,
  factors JSONB DEFAULT '[]'::jsonb,

  -- Market comparison
  market_listings JSONB DEFAULT '[]'::jsonb,
  market_average_price DECIMAL(10, 2),

  -- Metadata
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price history table (for tracking market trends)
CREATE TABLE public.price_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  model TEXT,
  condition TEXT NOT NULL,

  -- Price data
  average_price DECIMAL(10, 2) NOT NULL,
  min_price DECIMAL(10, 2) NOT NULL,
  max_price DECIMAL(10, 2) NOT NULL,
  sample_size INTEGER NOT NULL,

  -- Time
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes for fast queries
  CONSTRAINT unique_price_record UNIQUE (brand, category, model, condition, recorded_at)
);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  appraisal_id UUID REFERENCES public.appraisals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_favorite UNIQUE (user_id, appraisal_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_appraisals_user_id ON public.appraisals(user_id);
CREATE INDEX idx_appraisals_created_at ON public.appraisals(created_at DESC);
CREATE INDEX idx_appraisals_brand_category ON public.appraisals(brand, category);
CREATE INDEX idx_price_history_brand_category ON public.price_history(brand, category, recorded_at DESC);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appraisals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Appraisals policies
CREATE POLICY "Users can view their own appraisals"
  ON public.appraisals FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own appraisals"
  ON public.appraisals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appraisals"
  ON public.appraisals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appraisals"
  ON public.appraisals FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appraisals_updated_at
  BEFORE UPDATE ON public.appraisals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment appraisals count
CREATE OR REPLACE FUNCTION increment_appraisals_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET appraisals_count = appraisals_count + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_user_appraisals
  AFTER INSERT ON public.appraisals
  FOR EACH ROW
  EXECUTE FUNCTION increment_appraisals_count();
