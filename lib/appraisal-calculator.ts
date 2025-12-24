import { LuxuryItem, AppraisalResult, AppraisalFactor, ItemCondition, DesignTrend, DemandLevel } from '@/types';

// Base resale percentage of original price
const BASE_RESALE_PERCENTAGE = 0.65; // 65% of original price as starting point

// Condition multipliers
const CONDITION_MULTIPLIERS: Record<ItemCondition, number> = {
  'new': 0,      // No discount
  'excellent': -0.05,  // 5% discount
  'good': -0.15,       // 15% discount
  'fair': -0.30,       // 30% discount
  'poor': -0.50,       // 50% discount
};

// Design trend multipliers
const DESIGN_MULTIPLIERS: Record<DesignTrend, number> = {
  'trending': 0.15,    // 15% premium
  'classic': 0,        // No change
  'dated': -0.20,      // 20% discount
};

// Demand multipliers
const DEMAND_MULTIPLIERS: Record<DemandLevel, number> = {
  'high': 0.10,    // 10% premium
  'medium': 0,     // No change
  'low': -0.15,    // 15% discount
};

export function calculateAppraisal(item: LuxuryItem): AppraisalResult {
  const factors: AppraisalFactor[] = [];
  let totalAdjustment = 0;

  // Base calculation
  let estimatedPrice = item.originalPrice * BASE_RESALE_PERCENTAGE;

  // Factor 1: Condition
  const conditionAdjustment = CONDITION_MULTIPLIERS[item.condition];
  totalAdjustment += conditionAdjustment;
  factors.push({
    name: 'Item Condition',
    impact: conditionAdjustment === 0 ? 'neutral' : 'negative',
    description: `Condition: ${item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}`,
    adjustment: conditionAdjustment * 100,
  });

  // Factor 2: Original Tags
  if (!item.hasTags) {
    const tagsAdjustment = -0.10; // 10% discount
    totalAdjustment += tagsAdjustment;
    factors.push({
      name: 'Original Tags',
      impact: 'negative',
      description: 'Missing original tags',
      adjustment: tagsAdjustment * 100,
    });
  } else {
    factors.push({
      name: 'Original Tags',
      impact: 'positive',
      description: 'Has original tags',
      adjustment: 0,
    });
  }

  // Factor 3: Original Box/Packaging
  if (!item.hasBox) {
    const boxAdjustment = -0.08; // 8% discount
    totalAdjustment += boxAdjustment;
    factors.push({
      name: 'Original Packaging',
      impact: 'negative',
      description: 'Missing original box/packaging',
      adjustment: boxAdjustment * 100,
    });
  } else {
    factors.push({
      name: 'Original Packaging',
      impact: 'positive',
      description: 'Has original box and packaging',
      adjustment: 0,
    });
  }

  // Factor 4: Design Trend
  const designAdjustment = DESIGN_MULTIPLIERS[item.designTrend];
  totalAdjustment += designAdjustment;
  factors.push({
    name: 'Design Trend',
    impact: designAdjustment > 0 ? 'positive' : designAdjustment < 0 ? 'negative' : 'neutral',
    description: `Design is ${item.designTrend}`,
    adjustment: designAdjustment * 100,
  });

  // Factor 5: Market Demand
  const demandAdjustment = DEMAND_MULTIPLIERS[item.demandLevel];
  totalAdjustment += demandAdjustment;
  factors.push({
    name: 'Market Demand',
    impact: demandAdjustment > 0 ? 'positive' : demandAdjustment < 0 ? 'negative' : 'neutral',
    description: `${item.demandLevel.charAt(0).toUpperCase() + item.demandLevel.slice(1)} demand`,
    adjustment: demandAdjustment * 100,
  });

  // Apply total adjustment
  estimatedPrice = estimatedPrice * (1 + totalAdjustment);

  // Calculate price range (±10%)
  const priceRange = {
    min: Math.round(estimatedPrice * 0.9),
    max: Math.round(estimatedPrice * 1.1),
  };

  // Calculate confidence score (0-100)
  // Higher confidence if item has tags, box, and is in good condition
  let confidence = 70; // Base confidence
  if (item.hasTags) confidence += 10;
  if (item.hasBox) confidence += 10;
  if (item.condition === 'new' || item.condition === 'excellent') confidence += 10;

  const result: AppraisalResult = {
    id: Date.now().toString(),
    item,
    estimatedPrice: Math.round(estimatedPrice),
    priceRange,
    factors,
    confidence: Math.min(confidence, 100),
    createdAt: new Date(),
  };

  return result;
}

// Helper function to get condition description
export function getConditionDescription(condition: ItemCondition): string {
  const descriptions: Record<ItemCondition, string> = {
    new: 'Brand new with tags, never worn or used',
    excellent: 'Like new, minimal signs of wear',
    good: 'Gently used, minor imperfections',
    fair: 'Visible wear and tear, functional',
    poor: 'Significant damage or heavy wear',
  };
  return descriptions[condition];
}
