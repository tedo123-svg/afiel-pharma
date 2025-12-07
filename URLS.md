# Application URLs

## 🌐 Frontend (Running)

### Main Pages
- **Home**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **Prescriptions**: http://localhost:3000/prescriptions
- **Cart**: http://localhost:3000/cart
- **About**: http://localhost:3000/about

### User Pages (UI Ready)
- **Account**: http://localhost:3000/account
- **Privacy Policy**: http://localhost:3000/privacy
- **Terms of Service**: http://localhost:3000/terms
- **HIPAA Notice**: http://localhost:3000/hipaa

## 🔧 Backend APIs (Requires Database)

### NestJS API (Port 3001)
- **Health Check**: http://localhost:3001/health
- **Auth - Register**: POST http://localhost:3001/auth/register
- **Auth - Login**: POST http://localhost:3001/auth/login
- **Products - List**: GET http://localhost:3001/products
- **Products - Detail**: GET http://localhost:3001/products/:id
- **Orders - Create**: POST http://localhost:3001/orders
- **Orders - List**: GET http://localhost:3001/orders

### Prescription Service (Port 8000)
- **Health Check**: http://localhost:8000/
- **Upload Prescription**: POST http://localhost:8000/api/prescriptions/upload
- **Get Prescription**: GET http://localhost:8000/api/prescriptions/:id
- **Verify Prescription**: PUT http://localhost:8000/api/prescriptions/:id/verify
- **Drug Interactions**: GET http://localhost:8000/api/drugs/interactions?drug_ids=1,2
- **OCR Processing**: POST http://localhost:8000/api/prescriptions/ocr
- **FHIR Prescriptions**: GET http://localhost:8000/api/fhir/prescriptions?patient_id=123

### Compliance Monitor (Port 8001)
- **Health Check**: http://localhost:8001/
- **Audit Trail**: GET http://localhost:8001/api/compliance/audit-trail?resource_id=123
- **Violations**: GET http://localhost:8001/api/compliance/violations?days=7
- **Compliance Report**: GET http://localhost:8001/api/compliance/report?month=1&year=2024
- **Run Scan**: POST http://localhost:8001/api/compliance/scan

## 📊 Database Connections

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: medplatform
- **User**: meduser
- **Connection String**: postgresql://meduser:password@localhost:5432/medplatform

### Redis
- **Host**: localhost
- **Port**: 6379
- **Use**: Session management, caching

## 🔐 Authentication Endpoints

### Register New User
```bash
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "SecurePassword123!"
}
```

## 📤 Prescription Upload

```bash
POST http://localhost:8000/api/prescriptions/upload
Content-Type: multipart/form-data

prescription: [file]
```

## 🔍 Drug Interaction Check

```bash
GET http://localhost:8000/api/drugs/interactions?drug_ids=123,456
```

## 📋 API Documentation

Once backend is running:
- **Swagger UI (NestJS)**: http://localhost:3001/api
- **OpenAPI Docs (FastAPI)**: http://localhost:8000/docs
- **ReDoc (FastAPI)**: http://localhost:8000/redoc

## 🐳 Docker Services

When using Docker Compose:
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Frontend**: localhost:3000
- **Backend API**: localhost:3001
- **Prescription Service**: localhost:8000
- **Compliance Monitor**: localhost:8001

## 🌍 External Services (Production)

### AWS Services
- **S3 Bucket**: s3://medrx-prescriptions-production
- **RDS Database**: medrx-db.xxxxx.us-east-1.rds.amazonaws.com
- **CloudWatch Logs**: /medrx/audit-logs

### Third-Party APIs
- **NIH RxNorm**: https://rxnav.nlm.nih.gov/REST
- **Stripe API**: https://api.stripe.com
- **Twilio API**: https://api.twilio.com
- **DEA Verification**: (Configure in production)

## 📱 Mobile Access

The frontend is responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android tablets)
- Mobile phones (iOS, Android)

Access the same URL from any device on your local network:
- Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Access from mobile: http://[YOUR-IP]:3000

## 🔒 Security Notes

### Development URLs
- All services run on localhost
- No SSL/TLS in development
- Use for testing only

### Production URLs
- Must use HTTPS
- Configure SSL certificates
- Use domain names (e.g., https://medrx.com)
- Enable WAF and DDoS protection

## 📝 Testing Endpoints

### Health Checks
```bash
# Frontend
curl http://localhost:3000

# Backend API
curl http://localhost:3001/health

# Prescription Service
curl http://localhost:8000/

# Compliance Monitor
curl http://localhost:8001/
```

### Quick Test Script
```bash
# Test all services
curl -s http://localhost:3000 > /dev/null && echo "Frontend: OK" || echo "Frontend: DOWN"
curl -s http://localhost:3001/health > /dev/null && echo "API: OK" || echo "API: DOWN"
curl -s http://localhost:8000/ > /dev/null && echo "Prescription: OK" || echo "Prescription: DOWN"
curl -s http://localhost:8001/ > /dev/null && echo "Compliance: OK" || echo "Compliance: DOWN"
```

## 🎯 Current Status

✅ **Frontend**: http://localhost:3000 - RUNNING  
⏳ **Backend API**: Awaiting database setup  
⏳ **Prescription Service**: Awaiting database setup  
⏳ **Compliance Monitor**: Awaiting database setup  

---

**Next Step**: Set up PostgreSQL database to enable all backend services

See `QUICKSTART.md` for database setup instructions.
