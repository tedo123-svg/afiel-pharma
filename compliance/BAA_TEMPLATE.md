# Business Associate Agreement (BAA) Template

**HIPAA Business Associate Agreement**

This Business Associate Agreement ("Agreement") is entered into as of [DATE] between:

**Covered Entity**: MedRx Inc.  
**Business Associate**: [VENDOR NAME]

## 1. Definitions

Terms used but not otherwise defined in this Agreement shall have the same meaning as those terms in the HIPAA Rules.

## 2. Obligations of Business Associate

### 2.1 Permitted Uses and Disclosures
Business Associate may only use or disclose Protected Health Information (PHI) as necessary to perform services specified in the underlying service agreement.

### 2.2 Safeguards
Business Associate shall:
- Implement appropriate safeguards to prevent unauthorized use or disclosure of PHI
- Use encryption (AES-256 minimum) for PHI at rest and in transit
- Implement access controls and audit logging
- Conduct annual risk assessments

### 2.3 Reporting
Business Associate shall report to Covered Entity:
- Any unauthorized use or disclosure of PHI within 24 hours of discovery
- Any security incident within 48 hours
- Quarterly compliance reports

### 2.4 Subcontractors
Business Associate shall ensure that any subcontractors that handle PHI agree to the same restrictions and conditions.

## 3. Obligations of Covered Entity

Covered Entity shall:
- Provide Business Associate with the Notice of Privacy Practices
- Notify Business Associate of any changes to privacy practices
- Not request Business Associate to use or disclose PHI in a manner that would violate HIPAA

## 4. Term and Termination

### 4.1 Term
This Agreement shall be effective as of [DATE] and shall terminate when all PHI is destroyed or returned.

### 4.2 Termination for Breach
Either party may terminate this Agreement if the other party breaches a material term and fails to cure within 30 days.

### 4.3 Effect of Termination
Upon termination, Business Associate shall:
- Return or destroy all PHI within 30 days
- Retain no copies of PHI
- Provide written certification of destruction

## 5. Breach Notification

In the event of a breach of unsecured PHI, Business Associate shall:
- Notify Covered Entity within 24 hours of discovery
- Provide details of the breach including:
  - Date of breach
  - Number of individuals affected
  - Types of PHI involved
  - Mitigation steps taken

## 6. Audit Rights

Covered Entity has the right to audit Business Associate's compliance with this Agreement upon 30 days' notice.

## 7. Indemnification

Business Associate shall indemnify and hold harmless Covered Entity from any claims arising from Business Associate's breach of this Agreement.

---

**Covered Entity**  
Signature: ___________________  
Name: [NAME]  
Title: [TITLE]  
Date: [DATE]

**Business Associate**  
Signature: ___________________  
Name: [NAME]  
Title: [TITLE]  
Date: [DATE]

---

## Required BAAs

- [ ] AWS (Hosting Provider)
- [ ] Stripe (Payment Processor)
- [ ] Twilio (SMS Provider)
- [ ] OCR Service Provider
- [ ] EHR Integration Partners
- [ ] Backup Service Provider
