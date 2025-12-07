# 🚀 Deploy Frontend to Vercel - Step by Step

## Step 1: Push Code to GitHub (Using GitHub Desktop)

1. **Open GitHub Desktop**
2. You should see your repository "afiel-pharma" selected at the top
3. Look at the left panel - you might see "2 changed files" or similar
4. **Check all the boxes** next to the files to include them
5. At the bottom left, in the "Summary" field, type: `Update deployment files`
6. **Click the blue "Commit to main" button**
7. **Click "Push origin"** button at the top right (it might say "Publish branch" if first time)
8. Wait for the push to complete (you'll see a success message)

---

## Step 2: Deploy to Vercel

### A. Sign Up / Login to Vercel

1. Go to: **https://vercel.com**
2. Click **"Sign Up"** (or "Login" if you have account)
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### B. Import Your Project

1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **"afiel-pharma"** in the list
5. Click **"Import"** button next to it

### C. Configure Your Project

You'll see a configuration page. Fill in these settings:

**1. Project Name:**
- Change from `afiel-pharma` to `afiel-pharma-web` (or any unique name)

**2. Framework Preset:**
- Click the dropdown that says "Other"
- Select **"Next.js"**

**3. Root Directory:**
- Click the **"Edit"** button
- Type: `frontend`
- Click **"Continue"**

**4. Build and Output Settings:**
- Leave as default (don't change anything)

**5. Environment Variables:**
- Click to expand **"Environment Variables"** section
- Click **"Add"** or the input field
- **Key:** Type `NEXT_PUBLIC_API_URL`
- **Value:** Type `https://afiel-pharma.onrender.com`
- Click **"Add"** to save it

### D. Deploy!

1. Click the big black **"Deploy"** button at the bottom
2. Wait 2-3 minutes while Vercel builds and deploys your site
3. You'll see a progress screen with logs
4. When done, you'll see "Congratulations!" with your live URL

---

## Step 3: Copy Your Frontend URL

1. After deployment succeeds, you'll see your URL (like `https://afiel-pharma-web.vercel.app`)
2. **Copy this URL** - you'll need it for the next step
3. Click on the URL to test your site!

---

## Step 4: Update Backend with Frontend URL

1. Go back to **Render dashboard**: https://dashboard.render.com
2. Click on your **"afiel-pharma"** service
3. Click **"Environment"** in the left sidebar
4. Find the variable **"FRONTEND_URL"**
5. Click the **"Edit"** button (pencil icon)
6. Change the value to your Vercel URL (from Step 3)
7. Click **"Save Changes"**
8. Wait 1-2 minutes for the backend to redeploy

---

## Step 5: Test Your Live Site! 🎉

1. Open your Vercel URL in a browser
2. You should see your AfiEl Pharma homepage!
3. Try these:
   - Click "Products" - should see products from database
   - Click "Sign Up" - create a test account
   - Click "Sign In" - login with your account
   - Add a product to cart

### Test Admin Panel:

1. Login with admin credentials:
   - **Email:** `admin@afielpharma.com`
   - **Password:** `Admin@AfiEl2024!`
2. Go to "Manage Products"
3. Try adding a product
4. Try uploading an image

---

## 🎉 Success!

Your pharmacy platform is now LIVE on the internet!

### Your Live URLs:
- **Frontend (Website):** https://your-app.vercel.app
- **Backend (API):** https://afiel-pharma.onrender.com
- **GitHub:** https://github.com/tedo123-svg/afiel-pharma

### Share Your Site:
- Send the link to friends
- Add to your portfolio
- Share on social media
- Show to potential employers

---

## ⚠️ Important Notes

1. **Backend Sleep:** Free tier backend sleeps after 15 minutes of inactivity. First request takes 30-60 seconds to wake up.

2. **Admin Password:** Change the admin password after first login for security!

3. **Database Limits:** Free Supabase has 500MB storage limit (good for 1000-5000 users)

4. **Cost:** Everything is FREE! $0/month

---

## 🔧 Troubleshooting

### If products don't load:
1. Wait 60 seconds (backend might be waking up)
2. Check browser console for errors (F12)
3. Verify backend URL in Vercel environment variables

### If login doesn't work:
1. Check that FRONTEND_URL in Render matches your Vercel URL
2. Wait 2 minutes after updating environment variables

### If images don't upload:
1. Make sure image is under 5MB
2. Use JPG, PNG, or GIF format only

---

## 📱 Next Steps

1. ✅ Change admin password
2. ✅ Add more products to your store
3. ✅ Customize the design/colors
4. ✅ Add your own logo
5. ✅ Get a custom domain (optional, $10/year)
6. ✅ Share your site!

---

**Congratulations! You've successfully deployed a full-stack pharmacy platform! 🎉**
