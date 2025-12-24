export interface User {
  id: string;
  name: string;
  email: string;
  role: 'consumer' | 'business';
  company?: string;
  avatar?: string;
}

export type ItemCondition = 'new' | 'excellent' | 'good' | 'fair' | 'poor';
export type DesignTrend = 'trending' | 'classic' | 'dated';
export type DemandLevel = 'high' | 'medium' | 'low';

export interface LuxuryItem {
  id?: string;
  brand: string;
  category: string;
  model?: string;
  originalPrice: number;
  condition: ItemCondition;
  hasTags: boolean;
  hasBox: boolean;
  designTrend: DesignTrend;
  demandLevel: DemandLevel;
  images: string[];
  description?: string;
  createdAt?: Date;
}

export interface AppraisalResult {
  id: string;
  item: LuxuryItem;
  estimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  factors: AppraisalFactor[];
  confidence: number;
  createdAt: Date;
  userId?: string;
}

export interface AppraisalFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  adjustment: number; // percentage
}

export interface AppraisalStats {
  totalAppraisals: number;
  averageValue: number;
  topBrands: { brand: string; count: number }[];
  recentAppraisals: AppraisalResult[];
}
