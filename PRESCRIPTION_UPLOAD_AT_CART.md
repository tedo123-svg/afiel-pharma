# Prescription Upload at Add-to-Cart

## Overview
Prescription upload now happens immediately when adding prescription medications to cart, not during checkout. This provides a better user experience by handling prescriptions upfront.

## User Flow

### Adding Prescription Medication
1. **Browse Products**: Patient views product catalog
2. **Click "Add to Cart"** on prescription medication
3. **Modal Appears**: Prescription upload modal shows immediately
4. **Upload Required**: Patient must upload prescription image/PDF
5. **Add to Cart**: Item added to cart with prescription attached
6. **Continue Shopping**: Patient can continue shopping

### Adding Non-Prescription Medication
1. **Click "Add to Cart"** on OTC medication
2. **Instant Add**: Item added directly to cart (no modal)
3. **Continue Shopping**: No interruption

### Checkout Process
1. **Review Cart**: All items with prescriptions already attached
2. **Shipping Info**: Enter delivery details
3. **Payment**: Select payment method
4. **Place Order**: Order submitted with prescriptions
5. **Confirmation**: See pending verification message

## Technical Implementation

### Cart Store Updates (`frontend/src/store/cartStore.ts`)
- Added `prescriptionImage` field to CartItem interface
- Added `updatePrescription()` method to update prescription for cart items
- Prescription stored as base64 string in cart

### Product Grid Updates (`frontend/src/components/products/ProductGrid.tsx`)
- Added prescription upload modal
- Modal shows when adding prescription items
- File upload with preview
- Converts image to base64 before adding to cart
- Non-prescription items bypass modal

### Checkout Simplification (`frontend/src/app/checkout/page.tsx`)
- Removed prescription upload step
- Back to 3-step checkout (Shipping → Payment → Review)
- Uses prescriptions already in cart items
- Cleaner, faster checkout experience

## Modal Features

### Prescription Upload Modal
- **Trigger**: Automatically shows when adding Rx medication
- **Required Field**: Must upload prescription to proceed
- **File Types**: Accepts images (JPG, PNG) and PDFs
- **Visual Feedback**: Green checkmark when file selected
- **Actions**:
  - Cancel: Close modal without adding to cart
  - Add to Cart: Upload prescription and add item

### Modal Content
- Product name and details
- Price display
- Warning message about prescription requirement
- File upload input
- File name confirmation
- Action buttons

## Benefits

### For Patients
✅ **Immediate Feedback**: Know prescription is required before checkout
✅ **No Surprises**: Handle prescriptions upfront
✅ **Faster Checkout**: No prescription step during checkout
✅ **Clear Process**: Upload once per medication
✅ **Better UX**: Modal is focused and non-intrusive

### For Pharmacists
✅ **Complete Data**: All prescriptions attached to orders
✅ **Better Review**: Can see prescription with each item
✅ **Organized**: One prescription per medication

## Data Flow

```javascript
// When adding prescription item to cart
{
  id: "product-id",
  name: "Lisinopril 10mg",
  price: 29.99,
  quantity: 1,
  requiresPrescription: true,
  prescriptionImage: "data:image/jpeg;base64,/9j/4AAQ..." // Base64 encoded
}

// At checkout, prescription already attached
orderData.items = [
  {
    id: "product-id",
    name: "Lisinopril 10mg",
    price: 29.99,
    quantity: 1,
    requiresPrescription: true,
    prescriptionImage: "data:image/jpeg;base64,/9j/4AAQ..."
  }
]
```

## UI Components

### Modal Structure
```
┌─────────────────────────────────┐
│ Upload Prescription         [X] │
├─────────────────────────────────┤
│ ⚠️ Prescription Required        │
│ This medication requires...     │
├─────────────────────────────────┤
│ Lisinopril 10mg                 │
│ Prinivil, Zestril               │
│ $29.99                          │
├─────────────────────────────────┤
│ Upload Prescription Image *     │
│ [Choose File]                   │
│ ✓ prescription.jpg              │
├─────────────────────────────────┤
│ [Cancel]  [📤 Add to Cart]     │
└─────────────────────────────────┘
```

### Product Card with Rx Badge
```
┌─────────────────────────┐
│      [10mg]             │
│                         │
│ 🔒 Prescription Required│
│                         │
│ Lisinopril 10mg         │
│ Prinivil, Zestril       │
│ ACE inhibitor for...    │
│                         │
│ $29.99    [🛒 Add]     │
└─────────────────────────┘
```

## Error Handling

### Validation
- File must be selected before adding to cart
- "Add to Cart" button disabled until file selected
- Modal can be cancelled without adding item

### File Types
- Accepts: `image/*` and `.pdf`
- Browser validates file type
- Base64 conversion handles all image formats

## Testing Checklist

- [ ] Add prescription medication shows modal
- [ ] Add OTC medication bypasses modal
- [ ] Cannot add to cart without uploading prescription
- [ ] File upload shows file name
- [ ] Cancel button closes modal without adding
- [ ] Add to Cart button adds item with prescription
- [ ] Cart shows items with prescriptions
- [ ] Checkout uses prescriptions from cart
- [ ] Order includes prescription images
- [ ] Pharmacist can view prescription images

## Future Enhancements

1. **Prescription Preview**: Show thumbnail in cart
2. **Edit Prescription**: Allow updating prescription in cart
3. **Multiple Prescriptions**: Support multiple files per item
4. **OCR Validation**: Auto-validate prescription details
5. **Expiry Check**: Warn if prescription is expired
6. **Doctor Verification**: Link to prescribing doctor
7. **Prescription Library**: Save prescriptions for reuse
8. **Camera Capture**: Take photo directly in browser
