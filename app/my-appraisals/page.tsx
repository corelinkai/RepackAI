'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, DollarSign, TrendingUp, Trash2, Eye, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Appraisal {
  id: string;
  brand: string;
  category: string;
  model: string;
  condition: string;
  estimated_price: number;
  confidence_score: number;
  created_at: string;
  images?: string[];
  ai_brand_detection?: string;
  ai_condition_score?: number;
}

export default function MyAppraisals() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchAppraisals();
    }
  }, [status, router]);

  const fetchAppraisals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/appraisals');
      const data = await response.json();

      if (data.success) {
        setAppraisals(data.appraisals);
      } else {
        console.error('Failed to fetch appraisals:', data.error);
      }
    } catch (error) {
      console.error('Error fetching appraisals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAppraisal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appraisal?')) {
      return;
    }

    try {
      const response = await fetch(`/api/appraisals?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setAppraisals(appraisals.filter(a => a.id !== id));
        setSelectedAppraisal(null);
      } else {
        alert('Failed to delete appraisal');
      }
    } catch (error) {
      console.error('Error deleting appraisal:', error);
      alert('Failed to delete appraisal');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate stats
  const stats = {
    totalAppraisals: appraisals.length,
    totalValue: appraisals.reduce((sum, a) => sum + a.estimated_price, 0),
    avgValue: appraisals.length > 0
      ? appraisals.reduce((sum, a) => sum + a.estimated_price, 0) / appraisals.length
      : 0,
    avgConfidence: appraisals.length > 0
      ? appraisals.reduce((sum, a) => sum + a.confidence_score, 0) / appraisals.length
      : 0,
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-200 border-t-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your appraisals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="gradient-luxury text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-2">My Appraisals</h1>
              <p className="text-gray-200">
                Welcome back, {session?.user?.name || session?.user?.email}
              </p>
            </div>
            <Link
              href="/"
              className="bg-white/20 hover:bg-white/30 backdrop-blur px-6 py-3 rounded-lg font-medium transition-colors"
            >
              New Appraisal
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            {[
              { label: 'Total Appraisals', value: stats.totalAppraisals, icon: Package },
              { label: 'Total Value', value: formatCurrency(stats.totalValue), icon: DollarSign },
              { label: 'Avg. Value', value: formatCurrency(stats.avgValue), icon: TrendingUp },
              { label: 'Avg. Confidence', value: `${Math.round(stats.avgConfidence)}%`, icon: Sparkles },
            ].map((stat, index) => (
              <div key={index} className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gold-400/20 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-gold-300" />
                  </div>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {appraisals.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
              No Appraisals Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by appraising your first luxury item
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 gradient-gold text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              <Sparkles className="w-5 h-5" />
              Create First Appraisal
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Appraisals List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Your Appraisals ({appraisals.length})
              </h2>

              {appraisals.map((appraisal) => (
                <div
                  key={appraisal.id}
                  className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
                    selectedAppraisal?.id === appraisal.id
                      ? 'border-gold-400 shadow-gold'
                      : 'border-gray-200 hover:border-gold-200 hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedAppraisal(appraisal)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {appraisal.images && appraisal.images.length > 0 && (
                          <img
                            src={appraisal.images[0]}
                            alt={appraisal.brand}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {appraisal.brand || 'Unknown Brand'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appraisal.category} {appraisal.model && `• ${appraisal.model}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Estimated Value</p>
                          <p className="text-2xl font-bold text-gold-600">
                            {formatCurrency(appraisal.estimated_price)}
                          </p>
                        </div>
                        <div className="border-l border-gray-200 pl-4">
                          <p className="text-sm text-gray-500">Condition</p>
                          <p className="font-semibold text-gray-900 capitalize">
                            {appraisal.condition}
                          </p>
                        </div>
                        <div className="border-l border-gray-200 pl-4">
                          <p className="text-sm text-gray-500">Confidence</p>
                          <p className="font-semibold text-gray-900">
                            {appraisal.confidence_score}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(appraisal.created_at)}
                        {appraisal.ai_brand_detection && (
                          <>
                            <span className="mx-2">•</span>
                            <Sparkles className="w-4 h-4 text-gold-500" />
                            <span className="text-gold-600">AI Detected</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppraisal(appraisal);
                        }}
                        className="p-2 text-gray-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAppraisal(appraisal.id);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-1">
              {selectedAppraisal ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                  <h3 className="font-bold text-lg mb-4">Appraisal Details</h3>

                  {selectedAppraisal.images && selectedAppraisal.images.length > 0 && (
                    <div className="mb-6">
                      <img
                        src={selectedAppraisal.images[0]}
                        alt={selectedAppraisal.brand}
                        className="w-full h-48 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Brand</p>
                      <p className="font-semibold text-gray-900">{selectedAppraisal.brand || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="font-semibold text-gray-900">{selectedAppraisal.category || 'N/A'}</p>
                    </div>

                    {selectedAppraisal.model && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Model</p>
                        <p className="font-semibold text-gray-900">{selectedAppraisal.model}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Condition</p>
                      <p className="font-semibold text-gray-900 capitalize">{selectedAppraisal.condition}</p>
                      {selectedAppraisal.ai_condition_score && (
                        <p className="text-sm text-gold-600 mt-1">
                          AI Score: {selectedAppraisal.ai_condition_score}/10
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
                      <p className="text-3xl font-bold text-gold-600">
                        {formatCurrency(selectedAppraisal.estimated_price)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gold-500 h-2 rounded-full"
                            style={{ width: `${selectedAppraisal.confidence_score}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {selectedAppraisal.confidence_score}%
                        </span>
                      </div>
                    </div>

                    {selectedAppraisal.ai_brand_detection && (
                      <div className="bg-gold-50 border border-gold-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-gold-600" />
                          <p className="text-sm font-semibold text-gold-900">AI Detection</p>
                        </div>
                        <p className="text-sm text-gold-700">
                          Brand detected: {selectedAppraisal.ai_brand_detection}
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Created: {formatDate(selectedAppraisal.created_at)}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteAppraisal(selectedAppraisal.id)}
                      className="w-full mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Appraisal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    Select an appraisal to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
