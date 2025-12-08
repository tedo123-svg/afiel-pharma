Error: Failed to run sql query: ERROR: 42703: column "is_active" of relation "users" does not exist LINE 8: is_active, ^# 🚀 Quick Start - Deploy in 30 Minutes

Follow these steps to deploy your AfiEl Pharma platform for FREE!

---

## Before You Start

Make sure you have:
- ✅ A GitHub account
- ✅ Your code working locally
- ✅ 30 minutes of time

---

## Step 1: Push to GitHub (5 min)

### If you don't have a GitHub repository yet:

1. Go to https://github.com/new
2. Create a new repository:
   - Name: `afiel-pharma` (or any name)
   - Description: "Online Pharmacy Platform"
   - Public or Private: Your choice
   - Don't initialize with README (we already have code)
3. Click "Create repository"

### Push your code:

```bash
# In your project folder, run:
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/afiel-pharma.git
git push -u origin main
```

**✅ Done!** Your code is on GitHub

---

## Step 2: Setup Supabase (5 min)

### Create Database:

1. Go to: **https://supabase.com**
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New project"
5. Fill in:
   - Name: `afiel-pharma`
   - Database Password: **Create strong password** (SAVE THIS!)
   - Region: Choose closest to you
6. Click "Create new project"
7. Wait 2 minutes...

### Get Connection String:

1. Click "Settings" (gear icon) → "Database"
2. Scroll to "Connection string"
3. Click "URI" tab
4. Copy the string
5. Replace `[YOUR-PASSWORD]` with your password
6. **SAVE THIS** - you'll need it soon!

Example:
```
postgresql://postgres:MyPassword123@db.abc123xyz.supabase.co:5432/postgres
```

### Create Tables:

1. Click "SQL Editor" in sidebar
2. Click "New query"
3. Copy this entire SQL and paste:

```sql
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

INSERT INTO products (name, description, price, requires_prescription, generic_name, dosage, stock_quantity)
VALUES
('Lisinopril 10mg', 'ACE inhibitor for high blood pressure', 12.99, true, 'Lisinopril', '10mg', 100),
('Metformin 500mg', 'Diabetes medication', 8.99, true, 'Metformin', '500mg', 150),
('Ibuprofen 200mg', 'Pain reliever', 6.99, false, 'Ibuprofen', '200mg', 200);
```

4. Click "Run" (bottom right)
5. Should see "Success"

**✅ Done!** Database is ready

---

## Step 3: Setup Upstash Redis (3 min)

1. Go to: **https://upstash.com**
2. Sign up (free)
3. Click "Create Database"
4. Fill in:
   - Name: `afiel-pharma-redis`
   - Type: Regional
   - Region: Same as Supabase
5. Click "Create"
6. Click on your database
7. Copy the "UPSTASH_REDIS_REST_URL"
8. **SAVE THIS** - you'll need it soon!

Example:
```
redis://default:AbCdEf123@us1-abc-123.upstash.io:6379
```

**✅ Done!** Redis is ready

---

## Step 4: Deploy Backend (10 min)

1. Go to: **https://render.com**
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Click "Connect account" (authorize GitHub)
5. Select your repository: `afiel-pharma`
6. Click "Connect"

### Configure:

**Basic:**
- Name: `afiel-pharma-api`
- Region: Oregon (or closest)
- Branch: `main`
- Root Directory: `backend/api`
- Runtime: Node
- Build Command: `npm install && npm run build`
- Start Command: `node dist/main.js`

**Instance Type:**
- Select: **Free**

### Add Environment Variables:

Click "Advanced" → "Add Environment Variable"

Add these ONE BY ONE:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | Your Supabase URL from Step 2 |
| `DATABASE_SSL` | `true` |
| `REDIS_URL` | Your Upstash URL from Step 3 |
| `JWT_SECRET` | `your-super-secret-key-min-32-chars-change-this-now` |
| `JWT_EXPIRATION` | `1h` |
| `ENCRYPTION_KEY` | `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` |
| `ADMIN_EMAIL` | `admin@afielpharma.com` |
| `ADMIN_PASSWORD` | `Admin@AfiEl2024!` |
| `FRONTEND_URL` | `https://afiel-pharma.vercel.app` |

7. Click "Create Web Service"
8. Wait 5-10 minutes...
9. Look for "Live" status
10. **COPY YOUR URL** at the top (e.g., `https://afiel-pharma-api.onrender.com`)

**✅ Done!** Backend is live

---

## Step 5: Deploy Frontend (5 min)

1. Go to: **https://vercel.com**
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Find your repository and click "Import"

### Configure:

- Framework: Next.js (auto-detected)
- Root Directory: `frontend`
- Build Command: (leave default)
- Output Directory: (leave default)

### Add Environment Variable:

Click "Environment Variables"
- Key: `NEXT_PUBLIC_API_URL`
- Value: Your Render URL from Step 4 (e.g., `https://afiel-pharma-api.onrender.com`)
- Click "Add"

5. Click "Deploy"
6. Wait 2-3 minutes...
7. **COPY YOUR URL** (e.g., `https://afiel-pharma.vercel.app`)

**✅ Done!** Frontend is live!

---

## Step 6: Connect Frontend & Backend (2 min)

1. Go back to **Render dashboard**
2. Click your backend service
3. Click "Environment" in sidebar
4. Find `FRONTEND_URL`
5. Update with your Vercel URL from Step 5
6. Click "Save Changes"
7. Wait 1-2 minutes for redeploy

**✅ Done!** Everything is connected!

---

## Step 7: Test Your Site! (5 min)

1. Open your Vercel URL in browser
2. You should see your homepage!
3. Try these:
   - Click "Products" - should see 3 products
   - Click "Sign Up" - create account
   - Click "Sign In" - login
   - Add product to cart

### Test Admin:

1. Login with:
   - Email: `admin@afielpharma.com`
   - Password: `Admin@AfiEl2024!`
2. Go to "Manage Products"
3. Try adding a product
4. Try uploading an image

**✅ Done!** Everything works!

---

## 🎉 Congratulations!

Your pharmacy platform is LIVE and FREE!

### Your URLs:
- **Website:** https://your-app.vercel.app
- **API:** https://your-api.onrender.com
- **Database:** Supabase dashboard
- **Redis:** Upstash dashboard

### Admin Login:
- **Email:** admin@afielpharma.com
- **Password:** Admin@AfiEl2024!

---

## ⚠️ Important Notes

### Free Tier Limitations:

1. **Backend sleeps after 15 minutes**
   - First request takes 30-60 seconds
   - Solution: Use UptimeRobot (free) to keep it awake

2. **Database: 500MB storage**
   - Good for 1000-5000 users
   - Upgrade to Pro if needed ($25/month)

3. **Good for:**
   - Testing
   - Portfolio
   - Small projects
   - MVP/Demo

---

## 🔧 Optional: Keep Backend Awake

1. Go to: **https://uptimerobot.com**
2. Sign up (free)
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: `https://your-api.onrender.com/products`
   - Interval: 5 minutes
4. Create Monitor

Now your backend stays awake!

---

## 📱 Share Your Site

Your site is live! Share it:
- With friends
- On social media
- In your portfolio
- With potential employers

---

## 🚀 Next Steps

1. Change admin password
2. Add more products
3. Customize design
4. Add your logo
5. Get custom domain ($10/year)
6. Monitor usage

---

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| Vercel | $0 |
| Render | $0 |
| Supabase | $0 |
| Upstash | $0 |
| **Total** | **$0/month** 🎉 |

---

## Need Help?

Check the full guide: `DEPLOYMENT_CHECKLIST.md`

Or contact support:
- Vercel: https://vercel.com/support
- Render: https://render.com/docs
- Supabase: https://supabase.com/docs

---

**You did it! Your pharmacy platform is live! 🎉**
