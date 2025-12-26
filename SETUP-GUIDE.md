# RepackAI - Complete Setup Guide

This guide will walk you through setting up all advanced features including AI image recognition, real market data, user authentication, and PWA capabilities.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (Supabase)](#database-setup)
3. [API Keys Configuration](#api-keys)
4. [Authentication Setup](#authentication)
5. [AI Vision Setup](#ai-vision)
6. [Market Data Integration](#market-data)
7. [PWA Configuration](#pwa)
8. [Deployment](#deployment)

---

## 🎯 Prerequisites

- Node.js 18+ installed
- Git installed
- A GitHub account (for deployment)
- Credit card for API services (most have free tiers)

---

## 💾 Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Fill in:
   - **Name**: RepackAI
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### Step 2: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy contents of `supabase/schema.sql`
4. Paste and click "Run"
5. Verify tables were created in **Table Editor**

### Step 3: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## 🔑 API Keys Configuration

### Create `.env.local` file

In your project root, create `.env.local`:

```bash
# Copy from .env.example
cp .env.example .env.local
```

### Required API Keys

#### 1. OpenAI API (for AI Vision)

**Cost**: ~$0.01 per image analysis
**Free Tier**: $5 credit for first 3 months

1. Go to https://platform.openai.com/api-keys
2. Sign up / Sign in
3. Click "Create new secret key"
4. Copy key and add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

#### 2. Google Custom Search API (for Market Data)

**Cost**: Free for first 100 searches/day
**Paid**: $5 per 1000 searches after

1. Go to https://console.cloud.google.com/
2. Create new project "RepackAI"
3. Enable **Custom Search API**:
   - Go to **APIs & Services** → **Library**
   - Search "Custom Search API"
   - Click Enable
4. Create API Key:
   - Go to **Credentials**
   - Click "Create Credentials" → "API Key"
   - Copy key:
     ```
     GOOGLE_API_KEY=your-key-here
     ```

5. Create Custom Search Engine:
   - Go to https://programmablesearchengine.google.com/
   - Click "Add"
   - Add these sites to search:
     ```
     www.vestiairecollective.com
     www.therealreal.com
     www.rebag.com
     www.fashionphile.com
     www.grailed.com
     ```
   - Copy "Search engine ID":
     ```
     GOOGLE_SEARCH_ENGINE_ID=your-id-here
     ```

#### 3. Optional: ScraperAPI (Alternative to Google)

**Cost**: 1000 free API calls/month
**Use case**: Backup for market data

1. Go to https://www.scraperapi.com/
2. Sign up for free plan
3. Copy API key:
   ```
   SCRAPER_API_KEY=your-key-here
   ```

#### 4. Optional: Unsplash API (Better Product Images)

**Cost**: Free
**Limit**: 50 requests/hour

1. Go to https://unsplash.com/developers
2. Create new app
3. Copy Access Key:
   ```
   UNSPLASH_ACCESS_KEY=your-key-here
   ```

---

## 🔐 Authentication Setup

### NextAuth Secret

Generate a random secret:

```bash
openssl rand -base64 32
```

Add to `.env.local`:
```
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3001
```

### Supabase Auth Configuration

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add Redirect URLs:
   ```
   http://localhost:3001/api/auth/callback/credentials
   https://your-domain.com/api/auth/callback/credentials
   ```

3. Enable Email provider:
   - Go to **Authentication** → **Providers**
   - Enable **Email**
   - Configure email templates (optional)

---

## 🤖 AI Vision Setup

### Test AI Vision

Create a test script `test-ai-vision.ts`:

```typescript
import { analyzeItemImage } from './lib/ai-vision';

async function test() {
  const result = await analyzeItemImage(
    'https://example.com/luxury-handbag.jpg'
  );
  console.log('AI Analysis:', result);
}

test();
```

Run:
```bash
npx ts-node test-ai-vision.ts
```

### Expected Costs

- **Per Image**: ~$0.01
- **100 images**: ~$1.00
- **1000 images**: ~$10.00

### Optimization Tips

1. Cache results in database
2. Only analyze first 2-3 images
3. Use lower resolution images
4. Implement rate limiting

---

## 📊 Market Data Integration

### Google Custom Search Setup

Your search engine should target:
- Vestiaire Collective
- The RealReal
- Rebag
- Fashionphile
- Grailed

### Test Market Data

```bash
curl "https://www.googleapis.com/customsearch/v1?key=YOUR_KEY&cx=YOUR_CX&q=Louis+Vuitton+Neverfull"
```

### Rate Limits

- **Free**: 100 queries/day
- **Paid**: Up to 10,000/day

---

## 📱 PWA Configuration

### 1. Add Manifest to Layout

Update `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  manifest: '/manifest.json',
  // ... other metadata
};
```

### 2. Generate Icons

Use https://realfavicongenerator.net/ to generate all icon sizes.

Place icons in `public/icons/` directory:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### 3. Test PWA

1. Build production: `npm run build`
2. Start: `npm start`
3. Open in Chrome
4. DevTools → Application → Manifest
5. Check "Installability" section

### 4. Install on Mobile

1. Open site in mobile browser
2. Look for "Add to Home Screen" prompt
3. Install
4. App opens in standalone mode!

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add advanced features"
   git push
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Import GitHub repository
   - Add environment variables (all from `.env.local`)
   - Click Deploy

3. **Add Custom Domain** (optional):
   - Go to project settings
   - Add domain: `repackai.com`
   - Follow DNS instructions

### Option 2: Manual Deployment

1. **Build**:
   ```bash
   npm run build
   ```

2. **Start**:
   ```bash
   npm start
   ```

3. **Use PM2** for production:
   ```bash
   npm install -g pm2
   pm2 start npm --name "repackai" -- start
   pm2 save
   ```

---

## 🧪 Testing All Features

### 1. Test AI Vision

1. Go to homepage
2. Click "Take Photo" or upload image
3. Submit appraisal
4. Check if brand/model detected automatically
5. Verify AI confidence score appears

### 2. Test Market Data

1. Submit appraisal
2. Scroll to "Market Comparison"
3. Verify real listings appear (not placeholders)
4. Check that prices are realistic
5. Click links to verify they go to real platforms

### 3. Test User Accounts

1. Click "Sign Up"
2. Create account with email
3. Log in
4. Create appraisal while logged in
5. Go to dashboard
6. Verify appraisal is saved
7. Test favorite/bookmark feature

### 4. Test Price History

1. Submit multiple appraisals for same item
2. View price history chart
3. Verify trends display correctly

### 5. Test PWA

1. Install app on mobile device
2. Verify offline functionality
3. Test camera feature
4. Check push notifications (if enabled)

---

## 💰 Cost Estimation

### Monthly Costs (1000 users)

| Service | Free Tier | Est. Cost |
|---------|-----------|-----------|
| **Supabase** | 500MB DB, 50K users | Free |
| **OpenAI Vision** | $5 credit | ~$20-50 |
| **Google Search** | 100/day free | ~$0-20 |
| **Vercel** | 100GB bandwidth | Free |
| **Total** | - | **$20-70/month** |

### Scaling (10K users)

- **Supabase**: ~$25/month
- **OpenAI**: ~$200-500/month
- **Google**: ~$50-100/month
- **Vercel**: Free (Pro: $20/month)
- **Total**: **$275-645/month**

---

## 🔧 Troubleshooting

### Common Issues

**1. "OpenAI API key not found"**
- Check `.env.local` file exists
- Verify key starts with `sk-`
- Restart dev server

**2. "Supabase connection failed"**
- Check project URL is correct
- Verify anon key matches
- Check database is active in Supabase dashboard

**3. "No market results found"**
- Check Google API key is valid
- Verify Custom Search Engine ID
- Check you haven't exceeded free tier (100/day)

**4. "Camera not working"**
- Must use HTTPS in production
- Check browser permissions
- Test on localhost first

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [OpenAI Vision Guide](https://platform.openai.com/docs/guides/vision)
- [Google Custom Search](https://developers.google.com/custom-search)
- [Next.js PWA](https://ducanh-next-pwa.vercel.app/)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🆘 Support

If you encounter issues:

1. Check error logs in browser console
2. Review API key configuration
3. Verify environment variables
4. Check service status pages
5. Create GitHub issue with error details

---

**Ready to go live!** 🎉

Follow these steps in order, and you'll have a fully-functional, production-ready luxury appraisal platform with AI vision, real market data, user accounts, and mobile app capabilities!
