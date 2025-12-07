# Free Deployment Checklist

Follow these steps in order to deploy your AfiEl Pharma platform for FREE!

---

## ✅ Pre-Deployment Checklist

- [ ] Code is working locally
- [ ] All tests pass
- [ ] Environment variables are documented
- [ ] GitHub repository is ready
- [ ] You have a GitHub account

---

## 📝 Step-by-Step Deployment

### Step 1: Push Code to GitHub (5 minutes)

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create repository on GitHub.com
# Then connect and push:
git remote add origin https://github.com/YOUR-USERNAME/afiel-pharma.git
git branch -M main
git push -u origin main
```

**✅ Checkpoint:** Your code is on GitHub

---

### Step 2: Setup Supabase Database (5 minutes)

1. **Go to:** https://supabase.com
2. **Sign up** with GitHub (free)
3. **Click:** "New Project"
4. **Fill in:**
   - Organization: Create new or select existing
   - Name: `afiel-pharma`
   - Database Password: Create a strong password (SAVE THIS!)
   - Region: Choose closest to your users
   - Pricing Plan: Free
5. **Click:** "Create new project"
6. **Wait:** 2-3 minutes for setup

**Get Connection String:**
1. Go to: Settings → Database
2. Find "Connection string" section
3. Select "URI" tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password
6. **Save this:** You'll need it for Render

Example:
```
postgresql://postgres:YourPassword@db.abc123xyz.supabase.co:5432/postgres
```

**Setup Database Tables:**
1. Click "SQL Editor" in left sidebar
2. Click "New query"
3. Copy and paste this SQL:

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
```

4. Click "Run" (bottom right)
5. You should see "Success. No rows returned"

**✅ Checkpoint:** Database is ready with tables created

---

### Step 3: Setup Upstash Redis (3 minutes)

1. **Go to:** https://upstash.com
2. **Sign up** (free)
3. **Click:** "Create Database"
4. **Fill in:**
   - Name: `afiel-pharma-redis`
   - Type: Regional
   - Region: Choose closest to your Supabase region
   - TLS: Enabled
5. **Click:** "Create"

**Get Redis URL:**
1. Click on your database
2. Scroll to "REST API" section
3. Copy the "UPSTASH_REDIS_REST_URL"
4. **Save this:** You'll need it for Render

Example:
```
redis://default:AbCdEf123@us1-abc-123.upstash.io:6379
```

**✅ Checkpoint:** Redis is ready

---

### Step 4: Deploy Backend to Render (10 minutes)

1. **Go to:** https://render.com
2. **Sign up** with GitHub (free)
3. **Click:** "New +" → "Web Service"
4. **Click:** "Connect account" (if needed)
5. **Select:** Your GitHub repository
6. **Configure:**

   **Basic Settings:**
   - Name: `afiel-pharma-api`
   - Region: Oregon (or closest to your database)
   - Branch: `main`
   - Root Directory: `backend/api`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/main.js`

   **Instance Type:**
   - Select: `Free`

7. **Click:** "Advanced" to add environment variables

**Add Environment Variables (one by one):**

Click "Add Environment Variable" for each:

```
NODE_ENV = production
PORT = 10000
DATABASE_URL = [Your Supabase connection string]
DATABASE_SSL = true
REDIS_URL = [Your Upstash Redis URL]
JWT_SECRET = your-super-secret-jwt-key-minimum-32-characters-long-change-this
JWT_EXPIRATION = 1h
ENCRYPTION_KEY = 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
ADMIN_EMAIL = admin@afielpharma.com
ADMIN_PASSWORD = Admin@AfiEl2024!
FRONTEND_URL = https://afiel-pharma.vercel.app
RATE_LIMIT_TTL = 60
RATE_LIMIT_MAX = 100
```

**Important:** 
- Replace `[Your Supabase connection string]` with actual URL from Step 2
- Replace `[Your Upstash Redis URL]` with actual URL from Step 3
- Change `JWT_SECRET` to your own random string (32+ characters)
- Change `ENCRYPTION_KEY` if you want (must be 64 hex characters)

8. **Click:** "Create Web Service"
9. **Wait:** 5-10 minutes for deployment
10. **Check logs:** Should see "🚀 API running on http://localhost:10000"

**Get Backend URL:**
- At the top of the page, you'll see your URL
- Example: `https://afiel-pharma-api.onrender.com`
- **Save this:** You'll need it for Vercel

**Test Backend:**
- Open: `https://your-backend-url.onrender.com/products`
- Should see: `[]` (empty array) or products list

**✅ Checkpoint:** Backend is deployed and running

---

### Step 5: Deploy Frontend to Vercel (5 minutes)

1. **Go to:** https://vercel.com
2. **Sign up** with GitHub (free)
3. **Click:** "Add New..." → "Project"
4. **Click:** "Import" next to your repository
5. **Configure:**

   **Project Settings:**
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
   - Install Command: `npm install` (auto-filled)

6. **Add Environment Variable:**
   - Click "Environment Variables"
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.onrender.com` (from Step 4)
   - Click "Add"

7. **Click:** "Deploy"
8. **Wait:** 2-3 minutes
9. **Success!** 🎉

**Get Frontend URL:**
- You'll see: "Congratulations! Your project has been deployed"
- Example: `https://afiel-pharma.vercel.app`
- **Click:** "Visit" to see your live site

**✅ Checkpoint:** Frontend is deployed and live!

---

### Step 6: Update Backend with Frontend URL (2 minutes)

1. **Go back to:** Render dashboard
2. **Click:** Your backend service
3. **Click:** "Environment" in left sidebar
4. **Find:** `FRONTEND_URL` variable
5. **Update:** With your Vercel URL (e.g., `https://afiel-pharma.vercel.app`)
6. **Click:** "Save Changes"
7. **Wait:** Service will auto-redeploy (1-2 minutes)

**✅ Checkpoint:** Backend and frontend are connected

---

### Step 7: Seed Initial Data (5 minutes)

**Option A: Using Supabase SQL Editor**

1. Go to Supabase → SQL Editor
2. Run this to add sample products:

```sql
-- Insert sample products
INSERT INTO products (name, description, price, requires_prescription, generic_name, brand_name, dosage, stock_quantity, is_active)
VALUES
('Lisinopril 10mg', 'ACE inhibitor for high blood pressure', 12.99, true, 'Lisinopril', 'Prinivil', '10mg', 100, true),
('Metformin 500mg', 'Diabetes medication', 8.99, true, 'Metformin', 'Glucophage', '500mg', 150, true),
('Ibuprofen 200mg', 'Pain reliever and anti-inflammatory', 6.99, false, 'Ibuprofen', 'Advil', '200mg', 200, true),
('Vitamin D3 1000IU', 'Vitamin D supplement', 9.99, false, 'Cholecalciferol', 'Nature Made', '1000IU', 180, true);
```

**Option B: Using Backend API**

You can also add products through the admin panel once you log in.

**✅ Checkpoint:** Sample data is loaded

---

### Step 8: Test Your Live Application (5 minutes)

1. **Open your Vercel URL** in browser
2. **Test these features:**
   - [ ] Homepage loads
   - [ ] Products page shows products
   - [ ] Register new account
   - [ ] Login works
   - [ ] Add product to cart
   - [ ] View cart

3. **Test Admin Panel:**
   - Login with: `admin@afielpharma.com` / `Admin@AfiEl2024!`
   - Go to: Manage Products
   - Try adding a product
   - Try uploading an image

**✅ Checkpoint:** Everything works!

---

### Step 9: Setup Uptime Monitoring (Optional, 3 minutes)

Keep your backend awake (Render free tier sleeps after 15 min):

1. **Go to:** https://uptimerobot.com
2. **Sign up** (free)
3. **Click:** "Add New Monitor"
4. **Configure:**
   - Monitor Type: HTTP(s)
   - Friendly Name: AfiEl Pharma API
   - URL: `https://your-backend-url.onrender.com/products`
   - Monitoring Interval: 5 minutes
5. **Click:** "Create Monitor"

**✅ Checkpoint:** Backend stays awake during business hours

---

## 🎉 Deployment Complete!

Your AfiEl Pharma platform is now LIVE and FREE!

### Your URLs:
- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://your-backend-url.onrender.com
- **Database:** Supabase dashboard
- **Redis:** Upstash dashboard

### Admin Access:
- **Email:** admin@afielpharma.com
- **Password:** Admin@AfiEl2024!

---

## 📊 What You're Using (All FREE):

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Vercel | Frontend | Unlimited |
| Render | Backend | 750 hours/month |
| Supabase | PostgreSQL | 500MB |
| Upstash | Redis | 10K commands/day |
| UptimeRobot | Monitoring | 50 monitors |

**Total Cost:** $0/month 🎉

---

## 🔧 Post-Deployment Tasks

### Update Branding:
- [ ] Change admin password
- [ ] Update email in footer
- [ ] Add your logo
- [ ] Customize colors

### Add Content:
- [ ] Add real products
- [ ] Add product images
- [ ] Create user accounts
- [ ] Test order flow

### Optional Upgrades:
- [ ] Custom domain ($10/year)
- [ ] Render Starter ($7/month - no sleep)
- [ ] More database storage

---

## 🐛 Troubleshooting

### Backend not responding:
- **Cause:** Render free tier sleeps after 15 min
- **Solution:** First request takes 30-60s, or setup UptimeRobot

### Database connection error:
- **Check:** DATABASE_URL is correct in Render
- **Check:** DATABASE_SSL is set to `true`
- **Check:** Supabase database is running

### Frontend can't reach backend:
- **Check:** NEXT_PUBLIC_API_URL in Vercel
- **Check:** FRONTEND_URL in Render
- **Check:** CORS is enabled in backend

### Images not uploading:
- **Check:** Backend payload limit (should be 50MB)
- **Check:** Image compression is working
- **Try:** Smaller image first

---

## 📞 Need Help?

- **Vercel Support:** https://vercel.com/support
- **Render Support:** https://render.com/docs
- **Supabase Support:** https://supabase.com/docs
- **Community:** Stack Overflow

---

## 🚀 Next Steps

1. Share your live URL with friends
2. Test all features thoroughly
3. Add more products
4. Customize the design
5. Consider custom domain
6. Monitor usage and performance

**Congratulations! Your pharmacy platform is live! 🎉**
