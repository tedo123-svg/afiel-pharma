# Prescription Upload & Verification Feature

## Overview
Complete prescription upload and verification workflow where patients upload prescription images during checkout, and pharmacists review them before approving orders.

## Patient Flow

### 1. Shopping & Checkout
1. Patient adds prescription medication to cart
2. Proceeds to checkout
3. Enters shipping information (Step 1)

### 2. Prescription Upload (Step 2 - NEW)
- **Automatic Detection**: System detects prescription items in cart
- **Upload Interface**: Shows each prescription item requiring upload
- **File Upload**: Patient uploads prescription image/PDF for each item
- **Validation**: Cannot proceed without uploading all required prescriptions
- **Visual Feedback**: Green checkmark appears when prescription is uploaded

### 3. Payment & Confirmation
- Complete payment information (Step 3)
- Review and place order (Step 4)
- See confirmation with clear message about pending verification

### 4. Order Tracking
- Navigate to "My Orders" page
- See order status: "Awaiting Pharmacist Verification"
- Orange badge with clock icon indicates pending status
- Clear message explaining what happens next

## Pharmacist Flow

### 1. Access Dashboard
- Login with pharmacist credentials
- Navigate to `/pharmacist/orders`

### 2. Review Prescriptions
- See all orders awaiting verification
- View prescription items with uploaded images
- Click prescription image to view full size
- Review patient information

### 3. Make Decision
- Click "Review Prescription" button
- Add optional notes
- Choose:
  - **Approve**: Order proceeds to processing
  - **Deny**: Order is rejected with notes sent to patient

### 4. Patient Notification
- Patient sees updated status in "My Orders"
- Approved: Green badge "Prescription Verified"
- Denied: Red badge "Prescription Denied" with pharmacist notes

## Technical Implementation

### Frontend Changes

#### Checkout Page (`frontend/src/app/checkout/page.tsx`)
- Added prescription file upload state
- New Step 2: Prescription Upload (only shown if prescription items exist)
- Dynamic progress indicator (3 steps for non-Rx, 4 steps for Rx orders)
- File upload for each prescription item
- Validation to ensure all prescriptions uploaded
- Convert images to base64 for storage
- Enhanced success message with verification workflow explanation

#### Pharmacist Dashboard (`frontend/src/app/pharmacist/orders/page.tsx`)
- Display prescription images inline
- Click to view full-size image in new tab
- Enhanced item cards with prescription preview
- Approve/Deny workflow with notes

#### Patient Orders Page (`frontend/src/app/orders/page.tsx`)
- Status badges with icons
- Detailed status messages
- Display pharmacist notes if denied
- Visual indicators for prescription items

### Backend Changes

#### Order Entity (`backend/api/src/orders/entities/order.entity.ts`)
- Added prescription verification statuses
- Fields for pharmacist ID and notes
- `requiresPrescriptionVerification` flag

#### Orders Service (`backend/api/src/orders/orders.service.ts`)
- Auto-detect prescription items
- Set appropriate initial status
- Verification method for pharmacists

#### Orders Controller (`backend/api/src/orders/orders.controller.ts`)
- Endpoints for order management
- Prescription verification endpoint

## Data Flow

### Order Creation
```javascript
{
  items: [
    {
      id: "product-id",
      name: "Lisinopril 10mg",
      price: 29.99,
      quantity: 1,
      requiresPrescription: true,
      prescriptionImage: "data:image/jpeg;base64,..." // Base64 encoded
    }
  ],
  totalAmount: 34.98,
  shippingAddress: { ... },
  status: "awaiting_prescription_verification"
}
```

### Verification Request
```javascript
POST /orders/:id/verify
{
  approved: true,
  pharmacistId: "pharmacist-user-id",
  notes: "Prescription verified. Valid for 30 days."
}
```

## User Interface

### Prescription Upload Step
- Clean, card-based layout
- Each prescription item in separate card
- File input with accept="image/*,.pdf"
- Visual confirmation when uploaded
- Disabled "Continue" button until all uploaded
- Blue info banner explaining the process

### Order Status Indicators
- 🕐 Orange: Awaiting Verification
- ✅ Green: Verified
- ❌ Red: Denied
- 📦 Blue: Processing
- 🚚 Purple: Shipped

## Security & Compliance

### Data Handling
- Prescription images stored as base64 in database
- HIPAA-compliant data handling
- Encrypted transmission
- Audit logging for all verification actions

### Access Control
- Only pharmacists can access verification dashboard
- Only patients can see their own orders
- Role-based routing protection

## Testing Checklist

### Patient Flow
- [ ] Add prescription item to cart
- [ ] Proceed to checkout
- [ ] See prescription upload step
- [ ] Upload prescription image
- [ ] Cannot proceed without upload
- [ ] Complete order
- [ ] See pending verification message
- [ ] Check order status page

### Pharmacist Flow
- [ ] Login as pharmacist
- [ ] See pending orders
- [ ] View prescription images
- [ ] Approve prescription
- [ ] Deny prescription with notes
- [ ] Verify patient sees updated status

### Edge Cases
- [ ] Mix of Rx and non-Rx items
- [ ] Only non-Rx items (skip upload step)
- [ ] Multiple prescription items
- [ ] Large image files
- [ ] PDF prescriptions

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create new order with prescriptions |
| GET | `/orders` | Get all orders (pharmacist) |
| GET | `/orders/user/:userId` | Get user's orders |
| POST | `/orders/:id/verify` | Verify/deny prescription |

## File Structure

```
frontend/src/app/
├── checkout/page.tsx          # Enhanced with prescription upload
├── pharmacist/orders/page.tsx # Pharmacist verification dashboard
└── orders/page.tsx            # Patient order tracking

backend/api/src/orders/
├── entities/order.entity.ts   # Order model with Rx fields
├── orders.service.ts          # Business logic
└── orders.controller.ts       # API endpoints
```

## Future Enhancements

1. **Email Notifications**: Send emails when prescription is verified/denied
2. **Real-time Updates**: WebSocket for instant status updates
3. **Prescription History**: Track all prescriptions for a patient
4. **OCR Integration**: Auto-extract prescription details from images
5. **Video Consultation**: Allow pharmacist to request video call with patient
6. **Prescription Expiry**: Track and alert on expiring prescriptions
7. **Multi-language Support**: Translate prescription verification messages
8. **Mobile App**: Native mobile app for easier prescription upload
