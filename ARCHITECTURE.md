# System Architecture

## Overview

MedRx is a HIPAA-compliant medical e-commerce platform built as a microservices architecture with end-to-end encryption and comprehensive audit logging.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Frontend (SSR)                                          │
│  - Patient Portal                                                │
│  - Pharmacist Dashboard                                          │
│  - Admin Console                                                 │
└────────────────┬────────────────────────────────────────────────┘
                 │ HTTPS/TLS 1.3
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway / Load Balancer                 │
│                      (AWS ALB + WAF)                             │
└────────────────┬────────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐   ┌──────────────────┐
│  NestJS API  │   │ FastAPI Services │
│              │   │                  │
│ - Auth       │   │ - Prescription   │
│ - Products   │   │   Processing     │
│ - Orders     │   │ - OCR Engine     │
│ - Users      │   │ - FHIR Client    │
└──────┬───────┘   └────────┬─────────┘
       │                    │
       └────────┬───────────┘
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Encrypted)    │  Redis (Sessions)                  │
│  - User data               │  - Session cache                   │
│  - Prescriptions           │  - Rate limiting                   │
│  - Orders                  │  - Drug interaction cache          │
│  - Audit logs              │                                    │
└─────────────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS Services                                │
├─────────────────────────────────────────────────────────────────┤
│  S3 (Encrypted)            │  KMS (Key Management)              │
│  - Prescription images     │  - Encryption keys                 │
│  - Backups                 │  - Key rotation                    │
│                            │                                    │
│  CloudWatch                │  Textract (OCR)                    │
│  - Audit logs              │  - Prescription parsing            │
│  - Monitoring              │                                    │
└─────────────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Integrations                          │
├─────────────────────────────────────────────────────────────────┤
│  NIH RxNorm API            │  EHR Systems (FHIR)                │
│  - Drug interactions       │  - Epic, Cerner                    │
│  - Drug information        │  - E-prescribe                     │
│                            │                                    │
│  DEA Verification          │  Stripe (PCI DSS)                  │
│  - Prescriber validation   │  - Payment processing              │
│                            │  - FSA/HSA support                 │
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Encryption Layers

1. **Transport Layer**: TLS 1.3 for all communications
2. **Application Layer**: AES-256 encryption for PHI
3. **Database Layer**: Transparent Data Encryption (TDE)
4. **Storage Layer**: S3 server-side encryption with KMS

### Authentication Flow

```
User Login
    ↓
Email/Password Validation
    ↓
MFA Challenge (SMS/Email OTP)
    ↓
JWT Token Issued (1h expiration)
    ↓
Session Stored in Redis
    ↓
Audit Log Created
```

### Prescription Verification Workflow

```
Patient Uploads Prescription
    ↓
OCR Processing (AWS Textract)
    ↓
Extract: Prescriber DEA, Drug, Dosage
    ↓
Validate Prescriber DEA Number
    ↓
Check Prescription Expiration
    ↓
Encrypt & Store in S3
    ↓
Create Audit Log
    ↓
Notify Pharmacist Queue
    ↓
Pharmacist Reviews & Verifies
    ↓
Update Status (Verified/Rejected)
    ↓
Notify Patient
    ↓
Enable Checkout (if verified)
```

## Data Flow

### PHI Data Handling

1. **Collection**: Encrypted at point of entry
2. **Processing**: Decrypted only in memory, never logged
3. **Storage**: Encrypted in PostgreSQL + S3
4. **Transmission**: TLS 1.3 only
5. **Access**: Logged in immutable audit trail
6. **Retention**: 7 years, then automatic purging

### Audit Trail

Every PHI access creates an immutable audit log entry:

```json
{
  "id": "uuid",
  "action": "PRESCRIPTION_VIEW",
  "userId": "user-uuid",
  "resourceType": "prescription",
  "resourceId": "rx-uuid",
  "timestamp": "2024-01-01T12:00:00Z",
  "ipAddress": "10.0.1.5",
  "metadata": {
    "userAgent": "...",
    "sessionId": "..."
  }
}
```

## Scalability

### Horizontal Scaling

- **Frontend**: Multiple Next.js instances behind ALB
- **API**: Auto-scaling NestJS containers (ECS/EKS)
- **Prescription Service**: Auto-scaling FastAPI containers
- **Database**: RDS read replicas for read-heavy operations

### Caching Strategy

- **Redis**: Session data, rate limiting, drug interactions
- **CloudFront**: Static assets, CDN
- **Application**: In-memory caching for reference data

## Disaster Recovery

### Backup Strategy

- **Database**: Daily automated backups (35-day retention)
- **Long-term**: Weekly backups to S3 Glacier (7 years)
- **Prescriptions**: Versioned S3 with cross-region replication

### Recovery Objectives

- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour

## Monitoring & Alerting

### Metrics

- API response times
- Error rates
- Database connections
- PHI access patterns
- Failed login attempts

### Alerts

- Security incidents (immediate)
- Compliance violations (immediate)
- System errors (5 minutes)
- Performance degradation (15 minutes)

## Compliance

### HIPAA Requirements Met

✅ Administrative Safeguards  
✅ Physical Safeguards  
✅ Technical Safeguards  
✅ Breach Notification Procedures  
✅ Business Associate Agreements  
✅ Audit Controls  
✅ Integrity Controls  
✅ Transmission Security  

### Regular Audits

- **Internal**: Monthly compliance scans
- **External**: Annual penetration testing
- **Certification**: SOC 2 Type II audit annually
