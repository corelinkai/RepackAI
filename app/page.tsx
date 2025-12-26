'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import AppraisalForm from '@/components/AppraisalForm';
import AppraisalResultComponent from '@/components/AppraisalResult';
import { LuxuryItem, AppraisalResult } from '@/types';
import { calculateAppraisal } from '@/lib/appraisal-calculator';
import { Sparkles, TrendingUp, Shield, CheckCircle } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();
  const [appraisalResult, setAppraisalResult] = useState<AppraisalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAppraisal = async (item: LuxuryItem) => {
    setIsLoading(true);

    try {
      // Get userId if user is logged in
      let userId = null;
      if (session?.user?.email) {
        // Fetch user ID from database
        const userResponse = await fetch(`/api/auth/user?email=${encodeURIComponent(session.user.email)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userId = userData.user?.id;
        }
      }

      // Call the new appraisal API with AI vision and market data
      const response = await fetch('/api/appraisal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: item.brand,
          category: item.category,
          model: item.model,
          condition: item.condition,
          images: item.images,
          userId: userId, // Pass userId to save appraisal
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Use AI-detected values or fall back to user input
        const detectedBrand = data.appraisal.brand || item.brand;
        const detectedCategory = data.appraisal.category || item.category;
        const detectedModel = data.appraisal.model || item.model;
        const detectedCondition = data.appraisal.condition || item.condition;

        // Create updated item with AI-detected values
        const updatedItem = {
          ...item,
          brand: detectedBrand,
          category: detectedCategory,
          model: detectedModel,
          condition: detectedCondition,
        };

        // Transform API response to match AppraisalResult type
        const result: AppraisalResult = {
          item: updatedItem,
          estimatedPrice: data.appraisal.estimatedPrice,
          confidence: data.appraisal.confidence,
          priceFactors: [
            { factor: 'Brand Value', impact: 'positive', description: `${detectedBrand} maintains strong resale value` },
            { factor: 'Condition', impact: detectedCondition === 'excellent' || detectedCondition === 'new' ? 'positive' : 'neutral', description: `Item is in ${detectedCondition} condition` },
            { factor: 'Market Demand', impact: data.appraisal.marketStats ? 'positive' : 'neutral', description: `Based on ${data.appraisal.marketStats?.totalListings || 0} similar listings` },
          ],
          marketComparison: data.appraisal.marketListings || [],
          aiAnalysis: data.appraisal.aiAnalysis,
        };

        console.log('✅ Final result with AI-detected values:', result);
        setAppraisalResult(result);
      } else {
        // Fallback to local calculation if API fails
        const result = calculateAppraisal(item);
        setAppraisalResult(result);
      }
    } catch (error) {
      console.error('Appraisal error:', error);
      // Fallback to local calculation if API fails
      const result = calculateAppraisal(item);
      setAppraisalResult(result);
    } finally {
      setIsLoading(false);

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleNewAppraisal = () => {
    setAppraisalResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-warm-50">
      {/* Hero Section - Redesigned */}
      <div className="gradient-luxury text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 opacity-10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gold-400/20 border border-gold-400/30 rounded-full px-5 py-2 mb-8 animate-fade-in">
              <Sparkles className="w-5 h-5 text-gold-300" />
              <span className="text-sm font-medium text-gold-100">AI-Powered Luxury Authentication</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-slide-up">
              Know Your Luxury Item's Worth
              <span className="block text-gold-300 mt-2">in 30 Seconds</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed">
              Instant, AI-powered appraisals for luxury ready-to-wear, handbags, shoes, and accessories with real-time market pricing
            </p>

            {/* CTA - Scroll to form */}
            <button
              onClick={() => document.getElementById('appraisal-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="gradient-gold text-white px-10 py-4 rounded-full font-semibold text-lg shadow-gold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              Get Free Appraisal
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center glass rounded-xl p-6">
              <div className="w-14 h-14 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-gold-300" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Visual Analysis</h3>
              <p className="text-sm text-gray-300">
                Advanced computer vision scores condition with 90%+ accuracy
              </p>
            </div>

            <div className="text-center glass rounded-xl p-6">
              <div className="w-14 h-14 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-gold-300" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Market Data</h3>
              <p className="text-sm text-gray-300">
                Real-time pricing from thousands of luxury resale platforms
              </p>
            </div>

            <div className="text-center glass rounded-xl p-6">
              <div className="w-14 h-14 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-gold-300" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trusted Results</h3>
              <p className="text-sm text-gray-300">
                Industry-standard valuations backed by 6+ years of data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Appraisal Form */}
          <div id="appraisal-form">
            <div className="bg-white rounded-2xl shadow-luxury-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-bold text-gray-900">
                    Get Your Free Appraisal
                  </h2>
                  <p className="text-sm text-gray-500">Takes less than 60 seconds</p>
                </div>
              </div>
              <p className="text-gray-600 mb-8">
                Upload photos of your luxury item and fill in the details below
              </p>
              <AppraisalForm onSubmit={handleAppraisal} isLoading={isLoading} />
            </div>

            {/* Info Box */}
            <div className="mt-6 gradient-gold text-white rounded-xl p-6 shadow-gold">
              <h4 className="font-bold text-lg mb-2">
                For Businesses & Marketplaces
              </h4>
              <p className="text-sm opacity-90 mb-4">
                Integrate RepackAI into your platform via API or use our B2B dashboard for batch processing
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-gold-600 px-4 py-2 rounded-lg font-medium hover:bg-gold-50 transition-colors text-sm"
              >
                Explore Business Solutions →
              </a>
            </div>
          </div>

          {/* Results */}
          <div id="results">
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-luxury-lg p-12 text-center border border-gray-100">
                <div className="relative inline-flex">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-gold-200 border-t-gold-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gold-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-gray-900 font-semibold text-lg mt-6">AI analyzing your item...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Processing images and calculating market value
                </p>
              </div>
            ) : appraisalResult ? (
              <div className="animate-scale-in">
                <AppraisalResultComponent
                  result={appraisalResult}
                  onNewAppraisal={handleNewAppraisal}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-warm-50 to-white rounded-2xl border-2 border-dashed border-gold-200 p-12 text-center shadow-luxury">
                <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-gold-500" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                  Your Results Will Appear Here
                </h3>
                <p className="text-gray-600 mb-4">
                  Fill out the form to get your AI-powered appraisal
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-success-500" />
                    90% Accuracy
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-success-500" />
                    Real-time Data
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get professional-grade appraisals in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Upload Photos', desc: 'Take multiple clear photos of your item from different angles', icon: '📸' },
              { step: 2, title: 'AI Analysis', desc: 'Our AI scores condition and verifies authenticity', icon: '🤖' },
              { step: 3, title: 'Market Data', desc: 'Real-time pricing from thousands of luxury sales', icon: '📊' },
              { step: 4, title: 'Get Appraisal', desc: 'Receive accurate resale valuation with confidence score', icon: '✨' },
            ].map((item) => (
              <div key={item.step} className="text-center hover-lift bg-white rounded-xl p-6 shadow-luxury">
                <div className="w-16 h-16 gradient-gold text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-gold">
                  {item.step}
                </div>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
