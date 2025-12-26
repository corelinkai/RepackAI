import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIVisionResult {
  brand?: string;
  model?: string;
  category?: string;
  condition: string;
  conditionScore: number;
  confidence: number;
  details: string;
  suggestedPrice?: number;
}

export async function analyzeItemImage(imageUrl: string): Promise<AIVisionResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert luxury fashion appraiser with deep knowledge of high-end brands, their products, and resale values.

CRITICAL: If the image shows price tags, labels, or product information text, READ IT CAREFULLY and extract all details including:
- Brand name (exact spelling from tag)
- Product name/model (exact wording from tag)
- Original retail price (if visible on tag)
- Product code/SKU (if visible)

Then analyze the image and identify:
1. Brand name (e.g., Louis Vuitton, Gucci, Chanel, Dolce & Gabbana, Prada)
2. Product type/category (e.g., Women's Shoes, Men's Shoes, handbag, dress, jacket)
3. Specific model/style name if identifiable
4. Condition assessment (new, excellent, good, fair, poor)
5. Condition score (1-10 scale)
6. Any visible wear, damage, or authenticity concerns
7. Estimated resale value based on condition

Return your analysis in JSON format with these exact fields:
{
  "brand": "Brand Name",
  "product_type": "Category",
  "model": "Model/Style Name",
  "condition": "Condition",
  "condition_score": 8.5,
  "wear_damage": "Description",
  "authenticity_concerns": "None or description",
  "estimated_resale_value": "$XXX - $YYY",
  "original_retail_price": "If visible on tag"
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this luxury item and provide detailed information about its brand, model, condition, and estimated resale value."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    console.log('🤖 OpenAI Raw Response:', content);

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the AI response
    // The AI should return structured data, but we'll handle parsing
    const result = parseAIResponse(content);

    console.log('🎯 Parsed AI Result:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('AI Vision Error:', error);

    // Return default values if AI fails
    return {
      condition: 'good',
      conditionScore: 7.0,
      confidence: 50,
      details: 'Unable to analyze image automatically. Please provide details manually.',
    };
  }
}

function parseAIResponse(content: string): AIVisionResult {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      return {
        brand: parsed.brand || undefined,
        model: parsed.model || parsed.style || undefined,
        category: parsed.category || parsed.product_type || undefined,
        condition: mapCondition(parsed.condition),
        conditionScore: parsed.condition_score || parsed.score || 7.0,
        confidence: parsed.confidence || 70,
        details: parsed.details || parsed.notes || content,
        suggestedPrice: parsed.estimated_resale_value || undefined,
      };
    }
  } catch (e) {
    console.error('Failed to parse AI response as JSON:', e);
  }

  // Fallback: Parse text response
  const brandMatch = content.match(/brand[:\s]+([^\n,]+)/i);
  const modelMatch = content.match(/model[:\s]+([^\n,]+)/i);
  const categoryMatch = content.match(/category[:\s]+([^\n,]+)/i);
  const conditionMatch = content.match(/condition[:\s]+([^\n,]+)/i);
  const scoreMatch = content.match(/score[:\s]+(\d+\.?\d*)/i);
  const confidenceMatch = content.match(/confidence[:\s]+(\d+)/i);

  return {
    brand: brandMatch ? brandMatch[1].trim() : undefined,
    model: modelMatch ? modelMatch[1].trim() : undefined,
    category: categoryMatch ? categoryMatch[1].trim() : undefined,
    condition: conditionMatch ? mapCondition(conditionMatch[1].trim()) : 'good',
    conditionScore: scoreMatch ? parseFloat(scoreMatch[1]) : 7.0,
    confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 60,
    details: content,
  };
}

function mapCondition(condition: string): 'new' | 'excellent' | 'good' | 'fair' | 'poor' {
  const normalized = condition.toLowerCase();

  if (normalized.includes('new') || normalized.includes('mint')) return 'new';
  if (normalized.includes('excellent') || normalized.includes('like new')) return 'excellent';
  if (normalized.includes('good') || normalized.includes('very good')) return 'good';
  if (normalized.includes('fair') || normalized.includes('used')) return 'fair';
  if (normalized.includes('poor') || normalized.includes('damaged')) return 'poor';

  return 'good';
}

// Batch analysis for multiple images
export async function analyzeMultipleImages(imageUrls: string[]): Promise<AIVisionResult[]> {
  const results = await Promise.all(
    imageUrls.map(url => analyzeItemImage(url))
  );

  return results;
}

// Combine results from multiple images into a single best estimate
export function combineAnalysisResults(results: AIVisionResult[]): AIVisionResult {
  if (results.length === 0) {
    return {
      condition: 'good',
      conditionScore: 7.0,
      confidence: 50,
      details: 'No images analyzed',
    };
  }

  if (results.length === 1) {
    return results[0];
  }

  // Find the result with highest confidence
  const bestResult = results.reduce((best, current) =>
    current.confidence > best.confidence ? current : best
  );

  // Average the condition scores
  const avgScore = results.reduce((sum, r) => sum + r.conditionScore, 0) / results.length;

  // Combine details
  const combinedDetails = results
    .map((r, i) => `Image ${i + 1}: ${r.details}`)
    .join('\n\n');

  return {
    brand: bestResult.brand,
    model: bestResult.model,
    category: bestResult.category,
    condition: bestResult.condition,
    conditionScore: avgScore,
    confidence: Math.min(95, bestResult.confidence + (results.length - 1) * 5), // Boost confidence with more images
    details: combinedDetails,
    suggestedPrice: bestResult.suggestedPrice,
  };
}
