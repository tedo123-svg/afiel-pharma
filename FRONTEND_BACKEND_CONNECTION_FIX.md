# Frontend-Backend Connection Fix

## Problem Identified
The frontend was unable to connect to the backend because:
1. **Hardcoded localhost URLs** - All API calls were pointing to `http://localhost:3001` instead of using the environment variable
2. **Backend sleeping** - Render free tier puts the backend to sleep after 15 minutes of inactivity
3. **CORS errors** - When testing locally, CORS was blocking requests

## Solution Implemented

### 1. Created Centralized API URL Utility
Created `frontend/src/lib/api.ts`:
```typescript
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
export const apiUrl = (path: string) => `${API_URL}${path}`
```

### 2. Updated All Files to Use apiUrl()
Replaced hardcoded `http://localhost:3001` with `apiUrl()` in:
- ✅ `frontend/src/app/login/page.tsx`
- ✅ `frontend/src/app/register/page.tsx`
- ✅ `frontend/src/app/products/page.tsx`
- ✅ `frontend/src/components/products/ProductGrid.tsx`
- ✅ `frontend/src/components/home/FeaturedProducts.tsx`
- ✅ `frontend/src/app/admin/products/page.tsx`
- ✅ `frontend/src/app/admin/orders/page.tsx`
- ✅ `frontend/src/app/admin/users/page.tsx`
- ✅ `frontend/src/app/orders/page.tsx`
- ✅ `frontend/src/app/checkout/page.tsx`
- ✅ `frontend/src/app/doctor/prescriptions/page.tsx`
- ✅ `frontend/src/app/pharmacist/orders/page.tsx`
- ✅ `frontend/src/app/prescriptions/page.tsx`

### 3. Pushed to GitHub
All changes committed and pushed to GitHub. Vercel will automatically redeploy.

## Current Status

### ✅ Fixed
- All hardcoded localhost URLs replaced with environment variable
- Code pushed to GitHub (commit: fc0cfb7)
- Vercel will auto-deploy the fix

### ⏳ Pending
- **Backend is sleeping** - First request will take 30-60 seconds to wake up
- Once awake, the site should work normally

## Testing Instructions

1. **Wait for Vercel deployment** (2-3 minutes)
   - Check: https://vercel.com/your-dashboard
   - Or visit: https://afiel-pharma-frontend.vercel.app

2. **Test the products page**
   - Visit: https://afiel-pharma-frontend.vercel.app/products
   - **First load will be slow** (30-60 seconds) - backend is waking up
   - Refresh after 1 minute if you see "No products available"

3. **Test login**
   - Email: `admin@afielpharma.com`
   - Password: `Admin@AfiEl2024!`

## Backend Wake-Up Issue

### Problem
Render free tier sleeps after 15 minutes of inactivity. First request takes 30-60 seconds.

### Solutions

#### Option 1: Keep Backend Awake (Free)
Use UptimeRobot to ping your backend every 5 minutes:
1. Sign up at https://uptimerobot.com (free)
2. Add monitor: https://afiel-pharma.onrender.com/products
3. Set interval: 5 minutes
4. Backend will stay awake 24/7

#### Option 2: Upgrade Render (Paid)
- Upgrade to Render's paid plan ($7/month)
- Backend stays awake 24/7
- Faster response times

#### Option 3: Accept the Delay
- Keep free tier
- First visitor each day waits 30-60 seconds
- Subsequent visitors get instant response

## Environment Variables

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://afiel-pharma.onrender.com
```

### Render (Backend)
```
FRONTEND_URL=https://afiel-pharma-frontend.vercel.app
DATABASE_URL=<your-supabase-url>
REDIS_URL=<your-upstash-url>
JWT_SECRET=<your-secret>
ENCRYPTION_KEY=<your-key>
ADMIN_EMAIL=admin@afielpharma.com
ADMIN_PASSWORD=Admin@AfiEl2024!
```

## Next Steps

1. ✅ Code is pushed to GitHub
2. ⏳ Wait for Vercel to deploy (auto-deploys from GitHub)
3. ⏳ Test the site after deployment completes
4. 🔄 If backend is sleeping, wait 60 seconds and refresh
5. ✅ Site should work normally after backend wakes up

## Verification

Once Vercel finishes deploying:
- Open browser console (F12)
- Visit https://afiel-pharma-frontend.vercel.app/products
- Check Network tab - should see requests to `https://afiel-pharma.onrender.com`
- No more CORS errors
- Products should load (after backend wakes up)
