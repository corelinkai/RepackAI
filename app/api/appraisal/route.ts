import { NextRequest, NextResponse } from 'next/server';
import { analyzeItemImage } from '@/lib/ai-vision';
import { supabase } from '@/lib/supabase';
import { fetchRealMarketData, calculateMarketStats } from '@/lib/market-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      brand,
      category,
      model,
      condition,
      images,
      userId,
    } = body;

    let aiAnalysis = null;

    // If images provided, analyze with AI Vision
    if (images && images.length > 0) {
      console.log('🔍 Analyzing images with AI Vision...');
      console.log('📸 Number of images:', images.length);
      console.log('📸 First image length:', images[0]?.substring(0, 50));
      try {
        aiAnalysis = await analyzeItemImage(images[0]); // Analyze first image
        console.log('✅ AI Analysis result:', JSON.stringify(aiAnalysis, null, 2));
      } catch (error) {
        console.error('❌ AI Vision error:', error);
        // Continue without AI analysis if it fails
      }
    } else {
      console.log('⚠️ No images provided for AI analysis');
    }

    // Use AI-detected values if available, otherwise use user input
    const finalBrand = aiAnalysis?.brand || brand;
    const finalModel = aiAnalysis?.model || model;
    const finalCategory = aiAnalysis?.category || category;
    const finalCondition = aiAnalysis?.condition || condition;

    console.log('🏷️ Final values - Brand:', finalBrand, 'Category:', finalCategory, 'Model:', finalModel);

    // Fetch market data
    const marketListings = await fetchRealMarketData(finalBrand, finalCategory, finalModel);
    const marketStats = calculateMarketStats(marketListings);

    // Calculate estimated price based on market data and condition
    let estimatedPrice = marketStats?.averagePrice || calculateBasePrice(finalBrand, finalCategory);

    // Adjust price based on condition
    const conditionMultipliers = {
      'new': 1.0,
      'excellent': 0.85,
      'good': 0.7,
      'fair': 0.55,
      'poor': 0.4,
    };
    const multiplier = conditionMultipliers[finalCondition as keyof typeof conditionMultipliers] || 0.7;
    estimatedPrice = Math.round(estimatedPrice * multiplier);

    // Calculate confidence score
    const confidence = calculateConfidence(aiAnalysis, marketStats);

    // Prepare appraisal result
    const appraisalResult: any = {
      brand: finalBrand,
      model: finalModel,
      category: finalCategory,
      condition: finalCondition,
      estimatedPrice,
      confidence,
      aiAnalysis,
      marketStats,
      marketListings: marketListings.slice(0, 10), // Limit to 10 listings
      createdAt: new Date().toISOString(),
    };

    // Save to database if user is logged in
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('appraisals')
          .insert({
            user_id: userId,
            brand: finalBrand,
            category: finalCategory,
            model: finalModel,
            condition: finalCondition,
            estimated_price: estimatedPrice,
            confidence_score: confidence,
            ai_brand_detection: aiAnalysis?.brand,
            ai_model_detection: aiAnalysis?.model,
            ai_condition_score: aiAnalysis?.conditionScore,
            market_listings: marketListings,
            images: images,
          })
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
        } else {
          appraisalResult.id = data.id;
        }
      } catch (dbError) {
        console.error('Failed to save appraisal:', dbError);
        // Continue even if database save fails
      }
    }

    return NextResponse.json({
      success: true,
      appraisal: appraisalResult,
    });
  } catch (error) {
    console.error('Appraisal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process appraisal' },
      { status: 500 }
    );
  }
}

function calculateBasePrice(brand: string, category: string): number {
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

  // Return middle of the range
  return Math.round((priceRange.min + priceRange.max) / 2);
}

function calculateConfidence(aiAnalysis: any, marketStats: any): number {
  let confidence = 70; // Base confidence

  // Increase confidence if AI detected the brand
  if (aiAnalysis?.brand) {
    confidence += 10;
  }

  // Increase confidence if AI has high confidence
  if (aiAnalysis?.confidence > 80) {
    confidence += 10;
  }

  // Increase confidence if we have good market data
  if (marketStats && marketStats.totalListings > 5) {
    confidence += 10;
  }

  return Math.min(95, confidence);
}
