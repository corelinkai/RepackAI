'use client';

import { useState } from 'react';
import { TrendingUp, Package, DollarSign, Users, Code, FileJson, Activity } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'analytics'>('overview');

  // Mock data
  const stats = {
    totalAppraisals: 12453,
    totalValue: 4256789,
    avgAppraisal: 342,
    activeUsers: 1834,
  };

  const recentAppraisals = [
    { id: '1', brand: 'Louis Vuitton', item: 'Neverfull MM', value: 1250, time: '2 min ago' },
    { id: '2', brand: 'Gucci', item: 'Marmont Bag', value: 980, time: '5 min ago' },
    { id: '3', brand: 'Chanel', item: 'Classic Flap', value: 3200, time: '12 min ago' },
    { id: '4', brand: 'Hermès', item: 'Birkin 30', value: 8500, time: '18 min ago' },
    { id: '5', brand: 'Prada', item: 'Galleria Bag', value: 780, time: '25 min ago' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage appraisals, view analytics, and integrate RepackAI into your platform
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'api', label: 'API Integration', icon: Code },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'Total Appraisals', value: stats.totalAppraisals.toLocaleString(), icon: Package, color: 'blue' },
                { label: 'Total Value', value: formatCurrency(stats.totalValue), icon: DollarSign, color: 'green' },
                { label: 'Avg. Appraisal', value: formatCurrency(stats.avgAppraisal), icon: TrendingUp, color: 'purple' },
                { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: Users, color: 'orange' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Appraisals */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Appraisals</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentAppraisals.map((appraisal) => (
                  <div key={appraisal.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{appraisal.brand}</p>
                      <p className="text-sm text-gray-600">{appraisal.item}</p>
                    </div>
                    <div className="text-right mr-8">
                      <p className="font-semibold text-gray-900">{formatCurrency(appraisal.value)}</p>
                      <p className="text-xs text-gray-500">{appraisal.time}</p>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-lg p-8">
                <h3 className="text-xl font-bold mb-2">Batch Processing</h3>
                <p className="text-primary-100 mb-4">
                  Upload CSV files to appraise multiple items at once
                </p>
                <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                  Upload Batch
                </button>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-8">
                <h3 className="text-xl font-bold mb-2">Export Reports</h3>
                <p className="text-purple-100 mb-4">
                  Download detailed analytics and appraisal reports
                </p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-8">
            {/* API Documentation */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-4">API Integration</h2>
              <p className="text-gray-600 mb-6">
                Integrate RepackAI's appraisal engine directly into your marketplace or application
              </p>

              {/* API Key */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="pk_live_abc123xyz789..."
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                    Copy
                  </button>
                </div>
              </div>

              {/* Code Example */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Example Request</h3>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{`POST https://api.repackai.com/v1/appraisals
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "brand": "Louis Vuitton",
  "category": "Handbags",
  "model": "Neverfull MM",
  "originalPrice": 1500,
  "condition": "excellent",
  "hasTags": true,
  "hasBox": true,
  "designTrend": "classic",
  "demandLevel": "high",
  "images": ["base64_encoded_image_1", "base64_encoded_image_2"]
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Response Example */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Example Response</h3>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{`{
  "id": "apr_abc123",
  "estimatedPrice": 975,
  "priceRange": {
    "min": 878,
    "max": 1073
  },
  "confidence": 95,
  "aiConditionScore": 8.5,
  "factors": [
    {
      "name": "Item Condition",
      "impact": "negative",
      "description": "Condition: Excellent",
      "adjustment": -5
    },
    // ... more factors
  ]
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Documentation Link */}
              <div className="mt-8 flex gap-4">
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                  View Full Documentation
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                  Download SDKs
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Dashboard */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Top Brands</h3>
                <div className="space-y-3">
                  {['Louis Vuitton', 'Chanel', 'Gucci', 'Hermès', 'Prada'].map((brand, index) => (
                    <div key={brand} className="flex items-center justify-between">
                      <span className="text-gray-700">{brand}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${100 - index * 15}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {(100 - index * 15)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                <div className="space-y-3">
                  {[
                    { category: 'Handbags', count: 5234 },
                    { category: 'Shoes', count: 3421 },
                    { category: 'Clothing', count: 2156 },
                    { category: 'Accessories', count: 1642 },
                  ].map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.category}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-lg font-semibold mb-4">Appraisal Volume Trend</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Chart visualization would appear here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
