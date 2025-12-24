'use client';

import { AppraisalResult } from '@/types';
import { TrendingUp, TrendingDown, Minus, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface AppraisalResultProps {
  result: AppraisalResult;
  onNewAppraisal?: () => void;
}

export default function AppraisalResultComponent({ result, onNewAppraisal }: AppraisalResultProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getImpactIcon = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getImpactColor = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Calculate AI condition score (1-10) based on condition
  const conditionScores = {
    new: 10,
    excellent: 8.5,
    good: 7,
    fair: 5,
    poor: 2,
  };
  const aiConditionScore = conditionScores[result.item.condition];

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">AI-Powered Appraisal</p>
            <h2 className="text-3xl font-bold mt-1">
              {formatCurrency(result.estimatedPrice)}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Confidence Score</p>
            <p className="text-2xl font-bold">{result.confidence}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="opacity-90">Price Range:</span>
          <span className="font-semibold">
            {formatCurrency(result.priceRange.min)} - {formatCurrency(result.priceRange.max)}
          </span>
        </div>
      </div>

      {/* AI Condition Score */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold">AI Visual Analysis</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Condition Score</span>
            <span className="text-2xl font-bold text-primary-600">{aiConditionScore}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${aiConditionScore * 10}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Based on AI analysis of {result.item.images.length} image(s)
          </p>
        </div>
      </div>

      {/* Item Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Item Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Brand</p>
            <p className="font-medium">{result.item.brand}</p>
          </div>
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-medium">{result.item.category}</p>
          </div>
          {result.item.model && (
            <div className="col-span-2">
              <p className="text-gray-500">Model</p>
              <p className="font-medium">{result.item.model}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500">Original Price</p>
            <p className="font-medium">{formatCurrency(result.item.originalPrice)}</p>
          </div>
          <div>
            <p className="text-gray-500">Condition</p>
            <p className="font-medium capitalize">{result.item.condition}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          {result.item.hasTags && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              <CheckCircle className="w-3 h-3" />
              Original Tags
            </span>
          )}
          {result.item.hasBox && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              <CheckCircle className="w-3 h-3" />
              Original Box
            </span>
          )}
        </div>
      </div>

      {/* Price Factors */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Price Factors</h3>
        <div className="space-y-3">
          {result.factors.map((factor, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${getImpactColor(factor.impact)}`}
            >
              <div className="flex items-center gap-3">
                {getImpactIcon(factor.impact)}
                <div>
                  <p className="font-medium text-sm">{factor.name}</p>
                  <p className="text-xs opacity-75">{factor.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold">
                  {factor.adjustment > 0 ? '+' : ''}
                  {factor.adjustment.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Images Preview */}
      {result.item.images.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Analyzed Images</h3>
          <div className="grid grid-cols-4 gap-3">
            {result.item.images.slice(0, 8).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Item ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {onNewAppraisal && (
        <div className="flex gap-3">
          <button
            onClick={onNewAppraisal}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            New Appraisal
          </button>
          <button className="flex-1 border-2 border-primary-600 text-primary-600 py-3 px-6 rounded-lg font-medium hover:bg-primary-50 transition-colors">
            Save & Share
          </button>
        </div>
      )}

      {/* Note about Virtual Try-On */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Coming Soon:</strong> Virtual Try-On powered by Google AI - Let buyers visualize how items look before purchasing
        </p>
      </div>
    </div>
  );
}
