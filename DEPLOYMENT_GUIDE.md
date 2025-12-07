# AfiEl Pharma - Deployment Guide

## Overview

This guide covers multiple deployment options for making your pharmacy platform accessible online.

---

## 🚀 Quick Deployment Options

### Option 1: Vercel + Railway (Easiest & Free Tier Available)

**Best for:** Quick deployment, testing, small-scale production

**Cost:** Free tier available, then ~$20-50/month

#### Frontend (Vercel)
1. Push code to GitHub
2. Go to https://vercel.com
3. Sign up and click "Import Project"
4. Select your GitHub repository
5. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `frontend`
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.railway.app
     ```
6. Click "Deploy"

#### Backend + Database (Railway)
1. Go to https://railway.app
2. Sign up and click "New Project"
3. Select "Deploy from GitHub repo"
4. Add PostgreSQL database (click "New" → "Database" → "PostgreSQL")
5. Add Redis (click "New" → "Database" → "Redis")
6. Deploy backend:
   - Click "New" → "GitHub Repo"
   - Select your repo
   - Root Directory: `backend/api`
   - Add environment variables (see below)
7. Railway will auto-deploy on git push

**Backend Environment Variables for Railway:**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this
FRONTEND_URL=https://your-app.vercel.app
ENCRYPTION_KEY=your-64-char-hex-encryption-key
```

**Pros:** Easy setup, auto-scaling, free tier
**Cons:** Limited free tier resources

---

### Option 2: AWS (Professional & Scalable)

**Best for:** Production, HIPAA compliance, enterprise

**Cost:** ~$50-200/month (depending on traffic)

#### Services Needed:
- **EC2** - Backend server
- **RDS PostgreSQL** - Database
- **ElastiCache Redis** - Caching
- **S3** - File storage (prescription images)
- **CloudFront** - CDN for frontend
- **Route 53** - DNS management
- **Certificate Manager** - SSL certificates

#### Deployment Steps:

**1. Setup RDS PostgreSQL:**
```bash
# In AWS Console:
1. Go to RDS → Create Database
2. Choose PostgreSQL 16
3. Template: Production
4. DB instance: db.t3.micro (for testing) or db.t3.small (production)
5. Set master username: meduser
6. Set master password: [secure password]
7. Database name: medplatform
8. Enable automated backups
9. Enable encryption at rest
10. Create database
```

**2. Setup ElastiCache Redis:**
```bash
# In AWS Console:
1. Go to ElastiCache → Create
2. Choose Redis
3. Node type: cache.t3.micro
4. Number of replicas: 1 (for production)
5. Create
```

**3. Setup EC2 for Backend:**
```bash
# Launch EC2 instance (Ubuntu 22.04)
# SSH into instance:
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend/api

# Install dependencies
npm install

# Create .env file with production values
nano .env

# Build the application
npm run build

# Start with PM2
pm2 start dist/main.js --name afiel-pharma-api
pm2 startup
pm2 save

# Setup Nginx as reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/afiel-pharma

# Add this configuration:
server {
    listen 80;
    server_name api.afielpharma.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/afiel-pharma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.afielpharma.com
```

**4. Deploy Frontend to S3 + CloudFront:**
```bash
# Build frontend
cd frontend
npm run build

# Install AWS CLI
# Upload to S3
aws s3 sync out/ s3://afielpharma-frontend --delete

# Create CloudFront distribution pointing to S3 bucket
# Enable HTTPS with ACM certificate
```

**5. Setup Domain:**
```bash
# In Route 53:
1. Create hosted zone for your domain
2. Add A record pointing to CloudFront distribution
3. Add A record for api subdomain pointing to EC2
```

---

### Option 3: DigitalOcean (Balanced)

**Best for:** Good balance of ease and control

**Cost:** ~$30-100/month

#### Using DigitalOcean App Platform:

**1. Create Account:**
- Go to https://digitalocean.com
- Sign up and add payment method

**2. Deploy Database:**
```bash
# In DigitalOcean Console:
1. Click "Create" → "Databases"
2. Choose PostgreSQL 16
3. Select plan: Basic ($15/month for testing)
4. Choose datacenter region
5. Create database cluster
6. Add Redis database similarly
```

**3. Deploy Backend:**
```bash
# In DigitalOcean Console:
1. Click "Create" → "Apps"
2. Connect GitHub repository
3. Select backend folder
4. Configure:
   - Type: Web Service
   - Build Command: npm install && npm run build
   - Run Command: node dist/main.js
   - Port: 3001
5. Add environment variables
6. Deploy
```

**4. Deploy Frontend:**
```bash
# In same App:
1. Add Component → Static Site
2. Select frontend folder
3. Build Command: npm run build
4. Output Directory: out
5. Deploy
```

**Environment Variables:**
```env
NODE_ENV=production
DATABASE_URL=${db.DATABASE_URL}
REDIS_URL=${redis.REDIS_URL}
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-app.ondigitalocean.app
```

---

### Option 4: Heroku (Simple but Expensive)

**Best for:** Quick deployment, prototypes

**Cost:** ~$25-100/month

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create apps
heroku create afiel-pharma-api
heroku create afiel-pharma-frontend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini -a afiel-pharma-api

# Add Redis
heroku addons:create heroku-redis:mini -a afiel-pharma-api

# Deploy backend
cd backend/api
git init
heroku git:remote -a afiel-pharma-api
git add .
git commit -m "Deploy backend"
git push heroku main

# Deploy frontend
cd ../../frontend
git init
heroku git:remote -a afiel-pharma-frontend
git add .
git commit -m "Deploy frontend"
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production -a afiel-pharma-api
heroku config:set JWT_SECRET=your-secret -a afiel-pharma-api
```

---

### Option 5: VPS (Full Control)

**Best for:** Maximum control, custom requirements

**Providers:** Linode, Vultr, Hetzner
**Cost:** ~$10-50/month

#### Setup on Ubuntu VPS:

```bash
# SSH into VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PostgreSQL
apt install postgresql postgresql-contrib -y
sudo -u postgres psql
CREATE DATABASE medplatform;
CREATE USER meduser WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE medplatform TO meduser;
\q

# Install Redis
apt install redis-server -y
systemctl enable redis-server

# Install Nginx
apt install nginx -y

# Clone and setup application
git clone https://github.com/your-repo.git /var/www/afiel-pharma
cd /var/www/afiel-pharma

# Setup backend
cd backend/api
npm install
npm run build
npm install -g pm2
pm2 start dist/main.js --name api
pm2 startup
pm2 save

# Setup frontend
cd ../../frontend
npm install
npm run build

# Configure Nginx
nano /etc/nginx/sites-available/afiel-pharma

# Add configuration:
server {
    listen 80;
    server_name afielpharma.com www.afielpharma.com;

    location / {
        root /var/www/afiel-pharma/frontend/out;
        try_files $uri $uri.html $uri/ =404;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
ln -s /etc/nginx/sites-available/afiel-pharma /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup SSL
apt install certbot python3-certbot-nginx -y
certbot --nginx -d afielpharma.com -d www.afielpharma.com
```

---

## 📋 Pre-Deployment Checklist

### Security:
- [ ] Change all default passwords
- [ ] Generate strong JWT secret (32+ characters)
- [ ] Generate encryption key (64 hex characters)
- [ ] Enable HTTPS/SSL
- [ ] Setup CORS properly
- [ ] Enable rate limiting
- [ ] Setup firewall rules
- [ ] Enable database encryption
- [ ] Setup backup strategy

### Environment Variables:
```env
# Production .env template
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_SSL=true

# Redis
REDIS_URL=redis://host:6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRATION=1h

# Encryption
ENCRYPTION_KEY=your-64-character-hex-encryption-key-for-hipaa-data

# Frontend
FRONTEND_URL=https://afielpharma.com

# Email (if using)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# AWS (if using S3 for images)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=afiel-pharma-prescriptions
```

### Code Changes:
- [ ] Update API URLs in frontend
- [ ] Enable production mode
- [ ] Remove console.logs
- [ ] Setup error tracking (Sentry)
- [ ] Setup analytics
- [ ] Optimize images
- [ ] Enable caching
- [ ] Setup CDN

---

## 🔧 Production Optimizations

### Frontend (Next.js):
```javascript
// next.config.js
module.exports = {
  output: 'standalone', // For Docker
  compress: true,
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable SWC minification
  swcMinify: true,
}
```

### Backend (NestJS):
```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable compression
  app.use(compression());
  
  // Enable helmet for security
  app.use(helmet());
  
  // Setup CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  // Global rate limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }));
  
  await app.listen(process.env.PORT || 3001);
}
```

---

## 📊 Monitoring & Maintenance

### Setup Monitoring:
1. **Uptime Monitoring:** UptimeRobot (free)
2. **Error Tracking:** Sentry
3. **Performance:** New Relic or DataDog
4. **Logs:** CloudWatch (AWS) or Papertrail

### Backup Strategy:
```bash
# Automated daily backups
# Add to crontab:
0 2 * * * pg_dump -U meduser medplatform > /backups/db-$(date +\%Y\%m\%d).sql
0 3 * * * find /backups -name "db-*.sql" -mtime +7 -delete
```

---

## 💰 Cost Comparison

| Option | Monthly Cost | Ease | Scalability | Control |
|--------|-------------|------|-------------|---------|
| Vercel + Railway | $0-50 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| AWS | $50-200 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| DigitalOcean | $30-100 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Heroku | $25-100 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| VPS | $10-50 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 Recommended Approach

### For Testing/MVP:
**Vercel + Railway**
- Fastest to deploy
- Free tier available
- Auto-scaling
- Easy to manage

### For Production:
**AWS or DigitalOcean**
- Better for HIPAA compliance
- More control
- Better performance
- Professional support

---

## 📞 Domain & DNS Setup

### Buy Domain:
- Namecheap: ~$10/year
- GoDaddy: ~$12/year
- Google Domains: ~$12/year

### Configure DNS:
```
A Record: @ → Your server IP
A Record: www → Your server IP
A Record: api → Your API server IP
CNAME: www → afielpharma.com
```

---

## 🔐 HIPAA Compliance Notes

For healthcare data, ensure:
- [ ] SSL/TLS encryption
- [ ] Database encryption at rest
- [ ] Encrypted backups
- [ ] Access logs (audit trail)
- [ ] BAA with hosting provider
- [ ] Regular security audits
- [ ] Incident response plan

**Providers with HIPAA BAA:**
- AWS (with BAA)
- Google Cloud (with BAA)
- Azure (with BAA)
- DigitalOcean (Enterprise plan)

---

## 🚀 Quick Start (Recommended)

**For immediate deployment:**

1. **Push to GitHub**
2. **Deploy to Vercel** (frontend) - 5 minutes
3. **Deploy to Railway** (backend + DB) - 10 minutes
4. **Buy domain** - 5 minutes
5. **Configure DNS** - 5 minutes
6. **Enable SSL** - Automatic

**Total time: ~30 minutes to go live!**

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- AWS Docs: https://docs.aws.amazon.com
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials

---

## Next Steps

1. Choose deployment option
2. Setup accounts
3. Configure environment variables
4. Deploy!
5. Test thoroughly
6. Setup monitoring
7. Configure backups
8. Go live! 🎉
