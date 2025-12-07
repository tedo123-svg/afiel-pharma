# Deployment Guide

## Prerequisites

### Legal & Compliance
- [ ] State pharmacy licenses obtained (all states where operating)
- [ ] DEA registration completed
- [ ] Malpractice insurance secured
- [ ] Legal counsel review completed
- [ ] Privacy policy and terms of service finalized

### Technical
- [ ] AWS account with HIPAA BAA signed
- [ ] Domain name registered
- [ ] SSL certificates obtained
- [ ] Twilio account for SMS (with BAA)
- [ ] Stripe account (PCI DSS compliant, with BAA)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/medical-ecommerce.git
cd medical-ecommerce
```

### 2. Install Dependencies

```bash
# Root dependencies
npm install

# Frontend
cd frontend && npm install

# Backend API
cd ../backend/api && npm install

# Python services
cd ../../microservices/prescription-service
pip install -r requirements.txt

cd ../compliance-monitor
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` files and fill in production values:

```bash
# Infrastructure
cp infrastructure/.env.example infrastructure/.env

# Frontend
cp frontend/.env.example frontend/.env.local

# Backend API
cp backend/api/.env.example backend/api/.env

# Prescription Service
cp microservices/prescription-service/.env.example microservices/prescription-service/.env
```

**CRITICAL**: Generate secure keys for production:

```bash
# Generate encryption key (32 bytes = 64 hex chars)
openssl rand -hex 32

# Generate JWT secret
openssl rand -base64 32

# Generate NextAuth secret
openssl rand -base64 32
```

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Using Docker
docker-compose -f infrastructure/docker-compose.yml up -d postgres

# Or AWS RDS
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

### 2. Run Migrations

```bash
cd backend/api
npm run migration:run
```

### 3. Seed Initial Data

```bash
npm run seed
```

## AWS Infrastructure

### 1. Deploy with Terraform

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Review plan
terraform plan

# Apply infrastructure
terraform apply
```

This creates:
- VPC with private subnets
- RDS PostgreSQL (encrypted)
- S3 buckets (encrypted)
- KMS keys
- CloudWatch log groups
- Security groups

### 2. Configure S3 Bucket Policy

Ensure S3 bucket has proper access controls and encryption.

### 3. Set Up CloudWatch Alarms

Configure alarms for:
- Database CPU > 80%
- API error rate > 1%
- Failed login attempts > 10/min
- Unauthorized PHI access attempts

## Application Deployment

### Option 1: Docker Compose (Development/Staging)

```bash
cd infrastructure
docker-compose up -d
```

### Option 2: AWS ECS (Production)

```bash
# Build and push Docker images
docker build -t medrx-frontend:latest ./frontend
docker build -t medrx-api:latest ./backend/api
docker build -t medrx-prescription:latest ./microservices/prescription-service

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker tag medrx-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/medrx-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/medrx-frontend:latest

# Deploy to ECS
aws ecs update-service --cluster medrx-cluster --service medrx-frontend --force-new-deployment
```

## SSL/TLS Configuration

### 1. Obtain SSL Certificate

```bash
# Using AWS Certificate Manager
aws acm request-certificate \
  --domain-name medrx.com \
  --subject-alternative-names www.medrx.com api.medrx.com \
  --validation-method DNS
```

### 2. Configure Load Balancer

- Attach SSL certificate to ALB
- Enforce HTTPS (redirect HTTP to HTTPS)
- Enable TLS 1.3 only

## Security Hardening

### 1. Enable WAF

```bash
# Create WAF rules
aws wafv2 create-web-acl \
  --name medrx-waf \
  --scope REGIONAL \
  --default-action Block={} \
  --rules file://waf-rules.json
```

### 2. Configure Security Groups

- Allow only necessary ports
- Restrict database access to application subnets only
- Enable VPC Flow Logs

### 3. Enable GuardDuty

```bash
aws guardduty create-detector --enable
```

## Monitoring Setup

### 1. CloudWatch Dashboards

Create dashboards for:
- API performance metrics
- Database metrics
- Security events
- Compliance metrics

### 2. Log Aggregation

Configure log shipping to CloudWatch:

```bash
# Install CloudWatch agent on EC2/ECS
aws ssm send-command \
  --document-name "AWS-ConfigureAWSPackage" \
  --parameters '{"action":["Install"],"name":["AmazonCloudWatchAgent"]}'
```

### 3. Set Up Alerts

Configure SNS topics for:
- Critical security events (immediate)
- Compliance violations (immediate)
- System errors (5 min)
- Performance issues (15 min)

## Compliance Verification

### 1. Run Compliance Scan

```bash
cd compliance
npm run compliance:scan
```

### 2. Review HIPAA Checklist

```bash
# Review and complete HIPAA_CHECKLIST.md
cat ../HIPAA_CHECKLIST.md
```

### 3. Generate Compliance Report

```bash
npm run compliance:report
```

## Post-Deployment

### 1. Verify All Services

```bash
# Check frontend
curl https://medrx.com

# Check API
curl https://api.medrx.com/health

# Check prescription service
curl https://api.medrx.com/prescriptions/health
```

### 2. Test Critical Flows

- [ ] User registration with MFA
- [ ] Prescription upload and OCR
- [ ] Pharmacist verification
- [ ] Order placement
- [ ] Payment processing

### 3. Security Testing

- [ ] Run penetration test
- [ ] Verify encryption at rest
- [ ] Verify encryption in transit
- [ ] Test audit logging
- [ ] Test incident response

### 4. Backup Verification

```bash
# Test database restore
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier medrx-test-restore \
  --db-snapshot-identifier medrx-snapshot-latest
```

## Maintenance

### Daily
- Monitor CloudWatch dashboards
- Review security alerts
- Check backup completion

### Weekly
- Review audit logs
- Update dependencies
- Review compliance reports

### Monthly
- Security vulnerability scan
- Compliance audit
- Disaster recovery test

### Quarterly
- Penetration testing
- Full disaster recovery drill
- Review and update policies

### Annually
- SOC 2 audit
- HIPAA risk assessment
- Renew SSL certificates
- Review BAAs with vendors

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous version
aws ecs update-service \
  --cluster medrx-cluster \
  --service medrx-api \
  --task-definition medrx-api:previous

# Restore database from backup
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier medrx-db \
  --target-db-instance-identifier medrx-db-restored \
  --restore-time 2024-01-01T12:00:00Z
```

## Support

- **Technical Issues**: Contact your DevOps team
- **Security Incidents**: Contact your security team (24/7)
- **Compliance Questions**: Contact your compliance officer
