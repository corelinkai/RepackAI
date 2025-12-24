'use client';

import { useState } from 'react';
import AppraisalForm from '@/components/AppraisalForm';
import AppraisalResultComponent from '@/components/AppraisalResult';
import { LuxuryItem, AppraisalResult } from '@/types';
import { calculateAppraisal } from '@/lib/appraisal-calculator';
import { Sparkles, TrendingUp, Shield } from 'lucide-react';

export default function Home() {
  const [appraisalResult, setAppraisalResult] = useState<AppraisalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAppraisal = async (item: LuxuryItem) => {
    setIsLoading(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = calculateAppraisal(item);
    setAppraisalResult(result);
    setIsLoading(false);

    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNewAppraisal = () => {
    setAppraisalResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">AI-Powered Technology</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Luxury Apparel Appraisal Engine
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Get instant, accurate resale valuations for your luxury fashion items using AI image analysis and real-time market data
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Sparkles className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">AI Visual Analysis</h3>
              <p className="text-sm text-primary-100">
                Advanced computer vision scores condition from 1-10 based on your photos
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <TrendingUp className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Real-Time Pricing</h3>
              <p className="text-sm text-primary-100">
                Market data-driven appraisals updated with current demand trends
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Shield className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Standardized Results</h3>
              <p className="text-sm text-primary-100">
                Consistent, trustworthy valuations used by top marketplaces
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Appraisal Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get Your Free Appraisal
              </h2>
              <p className="text-gray-600 mb-6">
                Upload photos of your luxury item and fill in the details below
              </p>
              <AppraisalForm onSubmit={handleAppraisal} isLoading={isLoading} />
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-semibold text-primary-900 mb-2">
                For Businesses & Marketplaces
              </h4>
              <p className="text-sm text-primary-800 mb-3">
                Integrate RepackAI into your platform via API or use our B2B dashboard for batch processing
              </p>
              <a
                href="/dashboard"
                className="inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Explore Business Solutions →
              </a>
            </div>
          </div>

          {/* Results */}
          <div id="results">
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">AI analyzing your item...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Processing images and calculating market value
                </p>
              </div>
            ) : appraisalResult ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <AppraisalResultComponent
                  result={appraisalResult}
                  onNewAppraisal={handleNewAppraisal}
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your Results Will Appear Here
                </h3>
                <p className="text-gray-500">
                  Fill out the form to get your AI-powered appraisal
                </p>
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Upload Photos', desc: 'Take multiple clear photos of your item' },
              { step: 2, title: 'AI Analysis', desc: 'Our AI scores condition and authenticity' },
              { step: 3, title: 'Market Data', desc: 'Real-time pricing from thousands of sales' },
              { step: 4, title: 'Get Appraisal', desc: 'Receive accurate resale valuation' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
