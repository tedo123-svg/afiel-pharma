# Quick Start Guide

## ✅ What's Running

Your medical e-commerce platform is now set up! Here's the current status:

### Frontend (Running ✓)
- **URL**: http://localhost:3000
- **Status**: Ready
- **Pages Available**:
  - Home: http://localhost:3000
  - Products: http://localhost:3000/products
  - Prescriptions: http://localhost:3000/prescriptions
  - Cart: http://localhost:3000/cart
  - About: http://localhost:3000/about

### Backend Services (Need Database)
The NestJS API and Python microservices require PostgreSQL to run. You have two options:

## Option 1: Use Docker (Recommended)

Install Docker Desktop for Windows, then run:

```bash
cd infrastructure
docker-compose up -d postgres redis
```

Then start the backend services:

```bash
# Terminal 1 - NestJS API
cd backend/api
npm run dev

# Terminal 2 - Prescription Service
cd microservices/prescription-service
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 3 - Compliance Monitor
cd microservices/compliance-monitor
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Option 2: Install PostgreSQL Locally

1. Download PostgreSQL: https://www.postgresql.org/download/windows/
2. Install and create database:
   ```sql
   CREATE DATABASE medplatform;
   CREATE USER meduser WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE medplatform TO meduser;
   ```
3. Update `.env` files with your database credentials
4. Start services as shown in Option 1

## Current Features You Can Test

### ✅ Working Now (Frontend Only)
- Browse the homepage with hero section
- View product listings (mock data)
- Add items to cart (stored in browser)
- View prescription upload interface
- Explore about page with compliance info
- Responsive design and dark mode

### 🔄 Requires Backend
- User authentication and registration
- Actual prescription upload and OCR
- Pharmacist verification workflow
- Real product data from database
- Order placement and tracking
- Drug interaction checking

## Environment Configuration

All `.env` files have been created from examples. For production, you MUST update:

### Critical Security Keys (Generate New Ones!)

```bash
# Generate encryption key (32 bytes)
openssl rand -hex 32

# Generate JWT secret
openssl rand -base64 32

# Generate NextAuth secret
openssl rand -base64 32
```

Update these in:
- `backend/api/.env` → JWT_SECRET, ENCRYPTION_KEY
- `frontend/.env.local` → NEXTAUTH_SECRET
- `infrastructure/.env` → All secrets

## Next Steps

### 1. Set Up Database (Choose Option 1 or 2 above)

### 2. Configure AWS (For Production Features)
- Create AWS account
- Sign HIPAA BAA with AWS
- Set up S3 bucket for prescriptions
- Configure KMS for encryption
- Update AWS credentials in `.env` files

### 3. External Integrations
- **Stripe**: For payment processing (requires BAA)
- **Twilio**: For SMS OTP (requires BAA)
- **NIH API**: For drug interactions (free, no auth)
- **EHR Systems**: For FHIR integration (requires agreements)

### 4. Review Compliance
```bash
# Check HIPAA compliance checklist
cat HIPAA_CHECKLIST.md

# Review security policy
cat compliance/SECURITY_POLICY.md

# Review architecture
cat ARCHITECTURE.md
```

### 5. Legal Requirements (CRITICAL!)

Before deploying to production, you MUST:
- [ ] Obtain state pharmacy licenses (all states where operating)
- [ ] Complete DEA registration
- [ ] Secure malpractice insurance
- [ ] Hire licensed pharmacists (24/7 coverage)
- [ ] Legal counsel review
- [ ] Sign BAAs with all vendors
- [ ] Create privacy policy and terms of service
- [ ] Implement age verification system

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

### Backend Development
```bash
cd backend/api
npm run dev
# API runs on http://localhost:3001
```

### Testing
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend/api
npm test
```

### Build for Production
```bash
# Build all services
npm run build

# Or individually
cd frontend && npm run build
cd backend/api && npm run build
```

## Troubleshooting

### Frontend won't start
- Check if port 3000 is available
- Delete `.next` folder and restart
- Run `npm install` again

### Backend database errors
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

### Python services won't install
- Install PostgreSQL (includes pg_config)
- Or use Docker for Python services
- Check Python version (requires 3.11+)

### Port conflicts
- Frontend: 3000
- Backend API: 3001
- Prescription Service: 8000
- Compliance Monitor: 8001
- PostgreSQL: 5432
- Redis: 6379

## Project Structure

```
medical-ecommerce/
├── frontend/              # Next.js app (RUNNING ✓)
├── backend/api/          # NestJS API (needs DB)
├── microservices/
│   ├── prescription-service/  # FastAPI (needs DB)
│   └── compliance-monitor/    # FastAPI (needs DB)
├── compliance/           # HIPAA docs & scanning
├── infrastructure/       # Docker & Terraform
└── docs/                # Additional documentation
```

## Support & Resources

- **Architecture**: See `ARCHITECTURE.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Security**: See `compliance/SECURITY_POLICY.md`
- **HIPAA**: See `HIPAA_CHECKLIST.md`

## Important Warnings

⚠️ **This is a development setup**
- Default credentials are insecure
- No SSL/TLS configured
- Audit logging not enabled
- No rate limiting active

⚠️ **Legal Compliance Required**
- DO NOT deploy without proper licenses
- DO NOT handle real PHI without HIPAA compliance
- DO NOT process payments without PCI DSS compliance
- DO NOT prescribe medications without licensed physicians

⚠️ **Security First**
- Change all default passwords
- Generate new encryption keys
- Enable MFA for all accounts
- Review security policy before deployment

---

**Current Status**: Frontend running at http://localhost:3000 ✓

**Next Action**: Set up PostgreSQL database to enable backend services
