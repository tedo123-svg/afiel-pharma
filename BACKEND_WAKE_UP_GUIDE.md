# Backend Wake-Up Guide

## Current Status

Your backend on Render is experiencing issues. Here's what we know:

### Error Details
- **Status**: 502 Bad Gateway
- **Cause**: Backend is either:
  1. Still sleeping (takes 50+ seconds on free tier)
  2. Failed to start due to build error
  3. Database connection issue

### What I Fixed
1. ✅ Removed `app.set('trust proxy', 1)` line that was causing TypeScript error
2. ✅ Pushed fix to GitHub (commit 75a6509)
3. ⏳ Render is now redeploying automatically

## How to Check Backend Status

### Option 1: Check Render Dashboard
1. Go to https://dashboard.render.com
2. Click on your `afiel-pharma` service
3. Check the **Logs** tab
4. Look for:
   - ✅ "🚀 API running on http://localhost:3001"
   - ❌ Any error messages

### Option 2: Wait and Test
The backend redeploy takes 3-5 minutes. After that:

1. Open a new browser tab
2. Visit: https://afiel-pharma.onrender.com/products
3. Wait 60 seconds (first request wakes up the service)
4. You should see JSON data with products

### Option 3: Use Browser DevTools
1. Visit: https://afiel-pharma-frontend.vercel.app/products
2. Open DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Look for the request to `afiel-pharma.onrender.com/products`
6. Check the response:
   - **502**: Backend is still starting or has an error
   - **200**: Backend is working! (you should see products)

## Common Issues & Solutions

### Issue 1: Backend Won't Start
**Symptoms**: 502 error persists after 5 minutes

**Solution**:
1. Check Render logs for errors
2. Verify environment variables are set:
   - DATABASE_URL
   - REDIS_URL
   - JWT_SECRET
   - ENCRYPTION_KEY
   - ADMIN_EMAIL
   - ADMIN_PASSWORD
   - FRONTEND_URL

### Issue 2: Database Connection Failed
**Symptoms**: Logs show "connection refused" or "authentication failed"

**Solution**:
1. Go to Supabase dashboard
2. Check if database is paused (free tier pauses after 7 days inactivity)
3. Copy the connection string again
4. Update DATABASE_URL in Render

### Issue 3: Redis Connection Failed
**Symptoms**: Logs show Redis errors

**Solution**:
1. Go to Upstash dashboard
2. Check if Redis is active
3. Copy the connection string again
4. Update REDIS_URL in Render

## Manual Wake-Up Methods

### Method 1: Ping from Browser
Open these URLs in new tabs (wait 60 seconds each):
- https://afiel-pharma.onrender.com/products
- https://afiel-pharma.onrender.com/auth/users

### Method 2: Use UptimeRobot (Recommended)
1. Sign up at https://uptimerobot.com (free)
2. Add New Monitor:
   - Monitor Type: HTTP(s)
   - Friendly Name: AfiEl Pharma Backend
   - URL: https://afiel-pharma.onrender.com/products
   - Monitoring Interval: 5 minutes
3. Save
4. Backend will stay awake 24/7!

### Method 3: Use Cron-Job.org
1. Go to https://cron-job.org
2. Create free account
3. Create new cron job:
   - URL: https://afiel-pharma.onrender.com/products
   - Interval: Every 5 minutes
4. Backend stays awake!

## Expected Timeline

- **Now**: Backend is redeploying on Render
- **+3 minutes**: Build should complete
- **+5 minutes**: Backend should be accessible
- **+6 minutes**: First request will wake it up (60 seconds)
- **+7 minutes**: Site should work normally

## Testing Checklist

After 7 minutes from now, test these:

1. ✅ Backend responds: https://afiel-pharma.onrender.com/products
2. ✅ Products page loads: https://afiel-pharma-frontend.vercel.app/products
3. ✅ Login works: https://afiel-pharma-frontend.vercel.app/login
   - Email: admin@afielpharma.com
   - Password: Admin@AfiEl2024!
4. ✅ Admin dashboard: https://afiel-pharma-frontend.vercel.app/admin/products

## If Still Not Working

If after 10 minutes the backend still shows 502:

1. **Check Render Logs** - This is the most important step
2. Look for specific error messages
3. Share the error with me and I'll help fix it

## Environment Variables to Verify

Make sure these are set in Render:

```
DATABASE_URL=postgresql://postgres.[project]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
REDIS_URL=rediss://default:[password]@holy-herring-33608.upstash.io:33608
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ENCRYPTION_KEY=your-32-character-encryption-key-change-this
ADMIN_EMAIL=admin@afielpharma.com
ADMIN_PASSWORD=Admin@AfiEl2024!
FRONTEND_URL=https://afiel-pharma-frontend.vercel.app
NODE_ENV=production
PORT=3001
```

## Next Steps

1. Wait 5 minutes for Render to finish deploying
2. Test the backend URL directly
3. If it works, test the frontend
4. Set up UptimeRobot to keep it awake
5. Enjoy your deployed pharmacy app! 🎉
