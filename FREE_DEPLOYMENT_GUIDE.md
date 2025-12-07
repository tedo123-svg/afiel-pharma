# 100% Free Deployment Options

## 🎉 Best Free Option: Vercel + Render + Supabase

This combination is **completely free** and perfect for your pharmacy platform!

---

## Option 1: Vercel + Render + Supabase (RECOMMENDED)

### ✅ What's Free:
- **Vercel** - Frontend hosting (unlimited)
- **Render** - Backend hosting (750 hours/month free)
- **Supabase** - PostgreSQL database (500MB free)
- **Upstash** - Redis (10,000 commands/day free)

### 📊 Free Tier Limits:
- Bandwidth: 100GB/month
- Build time: 6000 minutes/month
- Database: 500MB storage
- Good for: 1000-5000 users/month

---

## Step-by-Step Free Deployment

### Step 1: Setup Supabase (Free PostgreSQL)

1. **Go to https://supabase.com**
2. Sign up with GitHub (free)
3. Click "New Project"
4. Fill in:
   - Name: `afiel-pharma`
   - Database Password: [create strong password]
   - Region: Choose closest to you
5. Wait 2 minutes for setup
6. Go to Settings → Database
7. Copy connection string:
   ```
   postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

### Step 2: Setup Upstash (Free Redis)

1. **Go to https://upstash.com**
2. Sign up (free)
3. Create Database
4. Copy Redis URL:
   ```
   redis://default:[password]@[host].upstash.io:6379
   ```

### Step 3: Deploy Backend to Render

1. **Go to https://render.com**
2. Sign up with GitHub (free)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   ```
   Name: afiel-pharma-api
   Region: Choose closest
   Branch: main
   Root Directory: backend/api
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: node dist/main.js
   Instance Type: Free
   ```

6. **Add Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[your-supabase-connection-string]
   DATABASE_SSL=true
   REDIS_URL=[your-upstash-redis-url]
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this-now
   JWT_EXPIRATION=1h
   ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
   FRONTEND_URL=https://your-app.vercel.app
   ADMIN_EMAIL=admin@afielpharma.com
   ADMIN_PASSWORD=Admin@AfiEl2024!
   ```

7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Copy your backend URL: `https://afiel-pharma-api.onrender.com`

**⚠️ Important:** Free Render services sleep after 15 minutes of inactivity. First request after sleep takes 30-60 seconds.

### Step 4: Deploy Frontend to Vercel

1. **Go to https://vercel.com**
2. Sign up with GitHub (free)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

6. **Add Environment Variable:**
   ```env
   NEXT_PUBLIC_API_URL=https://afiel-pharma-api.onrender.com
   ```

7. Click "Deploy"
8. Wait 2-3 minutes
9. Your site is live! 🎉

### Step 5: Setup Database Tables

1. **Go to Supabase Dashboard**
2. Click "SQL Editor"
3. Run this SQL:

```sql
-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'patient',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    requires_prescription BOOLEAN DEFAULT true,
    generic_name VARCHAR(255),
    brand_name VARCHAR(255),
    dosage VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    items JSONB NOT NULL,
    shipping_address JSONB,
    payment_method VARCHAR(50),
    tracking_number VARCHAR(100),
    verified_by UUID,
    verified_at TIMESTAMP,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- Insert admin user (password: Admin@AfiEl2024!)
INSERT INTO users (email, password, role, first_name, last_name, is_verified)
VALUES (
    'admin@afielpharma.com',
    '$2b$10$YourHashedPasswordHere',
    'admin',
    'Admin',
    'User',
    true
);
```

4. Click "Run"

---

## Option 2: Netlify + Railway (Also Free)

### Netlify (Frontend)
- **Free tier:** 100GB bandwidth/month
- **Deploy:** Connect GitHub, auto-deploy
- **URL:** https://your-app.netlify.app

### Railway (Backend + Database)
- **Free tier:** $5 credit/month (enough for small apps)
- **Includes:** PostgreSQL + Redis
- **Deploy:** Connect GitHub, auto-deploy

**Steps:**
1. Push code to GitHub
2. Connect Netlify to frontend folder
3. Connect Railway to backend folder
4. Railway auto-provisions database
5. Done!

---

## Option 3: Vercel + Koyeb + Neon

### Vercel (Frontend)
- Free unlimited

### Koyeb (Backend)
- **Free tier:** 1 web service
- **Deploy:** https://koyeb.com

### Neon (PostgreSQL)
- **Free tier:** 3GB storage
- **Deploy:** https://neon.tech

---

## Option 4: 100% Free with Limitations

### Frontend: GitHub Pages
- **Free:** Unlimited
- **Limitation:** Static sites only (can work with Next.js export)

### Backend: Glitch
- **Free:** https://glitch.com
- **Limitation:** Sleeps after 5 minutes

### Database: ElephantSQL
- **Free:** 20MB PostgreSQL
- **Limitation:** Small storage

---

## 🎯 RECOMMENDED: Vercel + Render + Supabase

**Why this is best:**

✅ **Completely Free**
✅ **Easy to setup** (30 minutes)
✅ **Auto-deploy** from GitHub
✅ **SSL included**
✅ **Good performance**
✅ **Scales automatically**

**Limitations:**
- Backend sleeps after 15 min inactivity (Render free tier)
- 500MB database storage (Supabase free tier)
- Good for 1000-5000 users/month

---

## Free Tier Comparison

| Service | Frontend | Backend | Database | Redis |
|---------|----------|---------|----------|-------|
| **Vercel + Render + Supabase** | ✅ Free | ✅ Free | ✅ 500MB | ✅ 10K/day |
| **Netlify + Railway** | ✅ Free | ✅ $5 credit | ✅ Included | ✅ Included |
| **Vercel + Koyeb + Neon** | ✅ Free | ✅ Free | ✅ 3GB | ❌ Need separate |

---

## Upgrade Path (When You Need More)

When your app grows, upgrade to:

1. **Render Starter** - $7/month (no sleep)
2. **Supabase Pro** - $25/month (8GB database)
3. **Upstash Pro** - $10/month (more Redis)

**Total:** ~$42/month for production-ready

---

## Quick Start Commands

### 1. Prepare Your Code

```bash
# Make sure your code is on GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Update Frontend API URL

Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### 3. Update Backend for Production

Update `backend/api/src/main.ts`:
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Vercel
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  // Trust proxy (for Render)
  app.set('trust proxy', 1);
  
  await app.listen(process.env.PORT || 10000, '0.0.0.0');
}
```

### 4. Create render.yaml (Optional)

Create `backend/api/render.yaml`:
```yaml
services:
  - type: web
    name: afiel-pharma-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: node dist/main.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_SSL
        value: true
```

---

## Troubleshooting Free Tier

### Backend Sleeps (Render Free)
**Solution:** Use a free uptime monitor:
- **UptimeRobot** - https://uptimerobot.com (free)
- Pings your backend every 5 minutes
- Keeps it awake during business hours

### Database Full (Supabase 500MB)
**Solutions:**
1. Delete old audit logs regularly
2. Compress images more
3. Upgrade to Pro ($25/month for 8GB)

### Slow First Load
**Cause:** Render free tier sleeps
**Solution:** 
- Upgrade to Render Starter ($7/month)
- Or accept 30-60s first load

---

## Free Domain Options

### Free Subdomains:
- Vercel: `your-app.vercel.app`
- Render: `your-app.onrender.com`
- Netlify: `your-app.netlify.app`

### Free Custom Domain:
- **Freenom** - Free .tk, .ml, .ga domains (1 year)
- **InfinityFree** - Free subdomain with hosting

### Cheap Domain:
- **Namecheap** - $0.99 first year .com
- **Porkbun** - $3.99/year .com

---

## Complete Free Stack Summary

```
Frontend:  Vercel (Free Forever)
Backend:   Render (Free with sleep)
Database:  Supabase (500MB Free)
Redis:     Upstash (10K commands/day Free)
Domain:    Vercel subdomain (Free)
SSL:       Automatic (Free)
Monitoring: UptimeRobot (Free)
```

**Total Cost: $0/month** 🎉

---

## Next Steps

1. ✅ Sign up for Supabase
2. ✅ Sign up for Upstash  
3. ✅ Sign up for Render
4. ✅ Sign up for Vercel
5. ✅ Push code to GitHub
6. ✅ Deploy backend to Render
7. ✅ Deploy frontend to Vercel
8. ✅ Setup database tables
9. ✅ Test your live app!

**Time needed:** 30-45 minutes

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Upstash Docs:** https://docs.upstash.com

---

## When to Upgrade

Upgrade when you have:
- 5000+ monthly users
- Need faster response times
- Need more database storage
- Want 24/7 uptime

**Cost after upgrade:** ~$40-50/month
