# RepackAI - AI-Powered Luxury Apparel Appraisal Engine

**Visual Condition Intelligence for Resale**

RepackAI is an AI-powered platform that delivers accurate, standardized resale appraisals for luxury fashion items based on images, video, and market data.

## 🎯 Product Overview

### What We Do
RepackAI provides instant, accurate resale valuations for luxury fashion using:
- **AI Visual Analysis** - Condition scoring (1-10) from photos/videos
- **Market Intelligence** - Real-time pricing based on demand, trends, and historical data
- **Confidence Scoring** - "High confidence" vs "Needs human review" classifications
- **Explainability** - Transparent factor breakdowns (e.g., "Value reduced 18% due to missing box")

### Target Customers
1. **Marketplaces** (The RealReal, Vestiaire, Rebag, regional platforms)
2. **Individual Sellers** (via mobile app)
3. **Brands** (buy-back & recommerce programs)
4. **Retailers / Consignment Stores**
5. **Insurers & Lenders** (future expansion)

## 🏗️ Product Architecture

### A. Seller App (B2C) - *This Web MVP*
- Consumer-facing appraisal interface
- Guided image upload
- Instant AI valuations
- Export to PDF/marketplace listings

### B. API/SDK (B2B) - *Next Phase*
- REST API for marketplace integration
- Auto-pricing for listings
- Reduce manual labor & disputes
- Pricing: $0.30-$2 per appraisal or SaaS tiers

### C. Enterprise Tools - *Future*
- Brand buy-back dashboards
- Fraud detection
- Inventory valuation
- White-label solutions

## 🚀 Getting Started

### Option 1: Deploy to StackBlitz (Recommended - No Local Install)

Since Node.js cannot be installed locally, use StackBlitz to run this Next.js app entirely in the browser:

1. **Go to StackBlitz**
   - Visit: https://stackblitz.com/

2. **Create New Project**
   - Click "New Project" → "Next.js"
   - Or use "Import from GitHub" if you've pushed this code

3. **Upload Project Files**
   - If creating manually, upload all files from the `/RepackAI` directory
   - Maintain the folder structure exactly as shown

4. **Install & Run**
   - StackBlitz will automatically detect `package.json`
   - Click "Install Dependencies" if prompted
   - The dev server will start automatically
   - View your app at the provided URL

### Option 2: GitHub + StackBlitz Import

1. **Push to GitHub**
   ```bash
   cd RepackAI
   git init
   git add .
   git commit -m "Initial RepackAI commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to StackBlitz**
   - Go to https://stackblitz.com/
   - Click "Import from GitHub"
   - Enter your repository URL
   - StackBlitz will automatically set up and run the project

### Option 3: Deploy to Vercel (Free Hosting)

1. **Push code to GitHub** (see above)

2. **Deploy to Vercel**
   - Go to https://vercel.com/
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js and deploy
   - Get a live URL instantly (e.g., `repackai.vercel.app`)

## 📁 Project Structure

```
RepackAI/
├── app/
│   ├── page.tsx              # Consumer appraisal interface
│   ├── dashboard/
│   │   └── page.tsx          # B2B business dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── AppraisalForm.tsx     # Item submission form
│   ├── AppraisalResult.tsx   # Results display
│   └── Navigation.tsx        # Site navigation
├── lib/
│   └── appraisal-calculator.ts  # Core pricing algorithm
├── types/
│   └── index.ts              # TypeScript interfaces
├── data/
│   ├── luxury-brands.ts      # Brand & category data
│   └── products.ts           # Mock product data (legacy)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🧠 Core Algorithm

### Appraisal Factors

The pricing calculator considers:

1. **Base Resale Rate**: 65% of original retail price
2. **Condition** (AI-scored 1-10):
   - New: No discount
   - Excellent: -5%
   - Good: -15%
   - Fair: -30%
   - Poor: -50%
3. **Original Tags**: Missing = -10%
4. **Original Box**: Missing = -8%
5. **Design Trend**:
   - Trending: +15%
   - Classic: 0%
   - Dated: -20%
6. **Market Demand**:
   - High: +10%
   - Medium: 0%
   - Low: -15%

### Visual Analysis (Simulated)
Currently uses form inputs. **Next phase** will integrate:
- Computer vision for automatic condition detection
- Stitch wear analysis
- Fabric fading detection
- Creasing assessment
- Odor risk indicators
- Tag/box presence verification

## 🎨 Features

### Consumer Interface
- ✅ Photo upload with preview
- ✅ Comprehensive item details form
- ✅ Instant AI appraisal with price range
- ✅ Confidence score (0-100%)
- ✅ Factor-by-factor price breakdown
- ✅ AI condition scoring visualization

### B2B Dashboard
- ✅ Real-time statistics
- ✅ Recent appraisals feed
- ✅ API integration documentation
- ✅ Analytics by brand & category
- ✅ Batch processing interface (UI ready)
- ✅ Export reports (UI ready)

### Coming Soon
- 🔜 Google AI Virtual Try-On integration
- 🔜 Real computer vision for condition analysis
- 🔜 Video upload support
- 🔜 Historical comps database
- 🔜 Seasonality adjustments
- 🔜 Fraud detection
- 🔜 Mobile app (iOS/Android)

## 🔧 Tech Stack

- **Frontend**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: StackBlitz / Vercel
- **Future AI**: OpenAI Vision API, Google AI

## 📊 Business Model

### Pricing Strategy

**B2C (Seller App)**
- Free: 3 appraisals/month
- $9.99/month: Unlimited appraisals
- $2-5 per certified appraisal

**B2B (API/SDK)**
- Pay-per-use: $0.30-$2 per appraisal
- SaaS Tiers: $2k-$20k/month
- Enterprise: % of GMV uplift

## 🎯 Competitive Moat

### Our Differentiation

1. **Visual Condition Intelligence** - AI that understands luxury item wear patterns
2. **Data Flywheel** - Every appraisal improves the model
3. **Explainability** - Platforms need transparency for trust
4. **Category Expertise** - Start with luxury handbags, become the standard

### Why Competitors Buy This

Marketplaces struggle with:
- ❌ Inconsistent pricing
- ❌ Seller overpricing
- ❌ Manual inspections
- ❌ Returns due to condition disputes

RepackAI solves:
- ✅ Improves sell-through rates
- ✅ Reduces disputes
- ✅ Reduces staffing costs
- ✅ Increases GMV accuracy

## 🗺️ Roadmap

### Phase 1: Narrow & Win (Current)
- ✅ Build web MVP
- 🔄 Focus on luxury handbags only
- 🔄 Perfect appraisal accuracy for 1 category
- 🔄 Collect labeled training data

### Phase 2: Data Flywheel (Next 3-6 months)
- Launch mobile seller app
- Implement real computer vision
- Human review loop for edge cases
- Build proprietary dataset

### Phase 3: B2B Expansion (6-12 months)
- Launch API/SDK
- Partner with 3-5 small marketplaces
- Case studies & testimonials
- Expand to sneakers & watches

## 🤝 Integration Example

```javascript
// Example B2B API Integration
const response = await fetch('https://api.repackai.com/v1/appraisals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    brand: 'Louis Vuitton',
    category: 'Handbags',
    model: 'Neverfull MM',
    originalPrice: 1500,
    condition: 'excellent',
    images: ['base64_image_1', 'base64_image_2'],
    hasTags: true,
    hasBox: true
  })
});

const appraisal = await response.json();
// Returns: { estimatedPrice: 975, confidence: 95, aiConditionScore: 8.5, ... }
```

## 📄 License

Proprietary - RepackAI

## 📞 Contact

For API access, partnerships, or questions:
- Website: repackai.com
- Email: contact@repackai.com

---

**Built with ❤️ for the luxury resale ecosystem**
