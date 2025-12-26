'use client';

import { useState } from 'react';
import { LuxuryItem, ItemCondition, DesignTrend, DemandLevel } from '@/types';
import { LUXURY_BRANDS, ITEM_CATEGORIES } from '@/data/luxury-brands';
import { Upload, X, Camera } from 'lucide-react';
import CameraCapture from './CameraCapture';

interface AppraisalFormProps {
  onSubmit: (item: LuxuryItem) => void;
  isLoading?: boolean;
}

export default function AppraisalForm({ onSubmit, isLoading }: AppraisalFormProps) {
  const [formData, setFormData] = useState<Partial<LuxuryItem>>({
    brand: '',
    category: '',
    model: '',
    originalPrice: 0,
    condition: 'good',
    hasTags: false,
    hasBox: false,
    designTrend: 'classic',
    demandLevel: 'medium',
    images: [],
    description: '',
  });

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow submission with just images - AI will detect brand/category
    if (formData.images && formData.images.length > 0) {
      onSubmit(formData as LuxuryItem);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setImagePreview([...imagePreview, ...newImages]);
            setFormData({ ...formData, images: [...(formData.images || []), ...newImages] });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = imagePreview.filter((_, i) => i !== index);
    setImagePreview(newImages);
    setFormData({ ...formData, images: newImages });
  };

  const handleCameraCapture = (imageData: string) => {
    setImagePreview([...imagePreview, imageData]);
    setFormData({ ...formData, images: [...(formData.images || []), imageData] });
  };

  return (
    <>
      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Images *
          </label>

          {/* Upload options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Camera button */}
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gold-400 hover:bg-gold-50 transition-all group"
            >
              <Camera className="w-10 h-10 text-gray-400 group-hover:text-gold-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gold-600">
                Take Photo
              </span>
            </button>

            {/* File upload button */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gold-400 hover:bg-gold-50 transition-all group">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-10 h-10 text-gray-400 group-hover:text-gold-500 mb-2" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gold-600">
                  Upload Files
                </span>
              </label>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreview.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
            {imagePreview.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            </div>
          )}

          {/* AI Tip */}
          {imagePreview.length > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Our AI will automatically detect the brand, category, and condition from your photo. You can skip those fields or override them if needed.
              </p>
            </div>
          )}
        </div>

      {/* Brand */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
          Brand <span className="text-xs text-gray-500">(optional - AI will detect)</span>
        </label>
        <select
          id="brand"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Let AI detect from image</option>
          {LUXURY_BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-xs text-gray-500">(optional - AI will detect)</span>
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Let AI detect from image</option>
          {ITEM_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Model/Style */}
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
          Model/Style Name
        </label>
        <input
          type="text"
          id="model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          placeholder="e.g., Neverfull MM, Classic Flap"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Original Price */}
      <div>
        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
          Original Retail Price <span className="text-xs text-gray-500">(optional - if known)</span>
        </label>
        <input
          type="number"
          id="originalPrice"
          min="0"
          step="0.01"
          value={formData.originalPrice || ''}
          onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
          placeholder="2500 (leave empty if unknown)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Condition */}
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
          Condition *
        </label>
        <select
          id="condition"
          required
          value={formData.condition}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="new">New - Brand new with tags</option>
          <option value="excellent">Excellent - Like new, minimal wear</option>
          <option value="good">Good - Gently used</option>
          <option value="fair">Fair - Visible wear</option>
          <option value="poor">Poor - Significant damage</option>
        </select>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasTags"
            checked={formData.hasTags}
            onChange={(e) => setFormData({ ...formData, hasTags: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="hasTags" className="ml-2 text-sm text-gray-700">
            Has original tags
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasBox"
            checked={formData.hasBox}
            onChange={(e) => setFormData({ ...formData, hasBox: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="hasBox" className="ml-2 text-sm text-gray-700">
            Has original box/packaging
          </label>
        </div>
      </div>

      {/* Design Trend */}
      <div>
        <label htmlFor="designTrend" className="block text-sm font-medium text-gray-700 mb-2">
          Design Trend *
        </label>
        <select
          id="designTrend"
          required
          value={formData.designTrend}
          onChange={(e) => setFormData({ ...formData, designTrend: e.target.value as DesignTrend })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="trending">Trending - Currently in high fashion</option>
          <option value="classic">Classic - Timeless design</option>
          <option value="dated">Dated - Out of fashion</option>
        </select>
      </div>

      {/* Demand Level */}
      <div>
        <label htmlFor="demandLevel" className="block text-sm font-medium text-gray-700 mb-2">
          Market Demand *
        </label>
        <select
          id="demandLevel"
          required
          value={formData.demandLevel}
          onChange={(e) => setFormData({ ...formData, demandLevel: e.target.value as DemandLevel })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="high">High - Very sought after</option>
          <option value="medium">Medium - Moderate interest</option>
          <option value="low">Low - Limited demand</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Any additional details about the item..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Calculating...' : 'Get AI Appraisal'}
      </button>
    </form>
    </>
  );
}
