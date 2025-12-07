# Cart Prescription Upload - Debugging Guide

## Issue
Prescription upload button not appearing in cart for Metformin (prescription medication).

## Quick Fix Steps

### Option 1: Clear Browser Storage (Recommended)
1. Open browser DevTools (F12)
2. Go to "Application" or "Storage" tab
3. Find "Local Storage" → `http://localhost:3000`
4. Delete the `cart` key
5. Refresh the page
6. Add Metformin again from products page

### Option 2: Clear Cart via Console
1. Open browser console (F12)
2. Run this command:
```javascript
localStorage.removeItem('cart')
location.reload()
```

### Option 3: Manual Cart Clear
1. Go to cart page
2. Click "Remove" on Metformin
3. Go back to Products
4. Find Metformin 500mg (should have red 🔴 badge)
5. Click "Add to Cart"
6. Upload prescription when modal appears
7. Go to cart - should see prescription status

## How It Should Work

### When Adding Prescription Medication:
1. Product page shows red pulsing badge 🔴
2. Click "Add to Cart"
3. Modal appears: "Upload Prescription"
4. Select prescription image
5. Click "Add to Cart" in modal
6. Item added with prescription attached

### In Cart View:
**If prescription uploaded:**
```
Metformin 500mg
✓ Prescription Uploaded [green checkmark]
```

**If prescription NOT uploaded:**
```
Metformin 500mg
⚠️ Prescription Required [orange box]
[Upload Prescription Button]
```

## Verification Checklist

- [ ] Product has red badge on products page
- [ ] Modal appears when clicking "Add to Cart"
- [ ] Can upload prescription in modal
- [ ] Cart shows prescription status
- [ ] Orange upload button appears if no prescription
- [ ] Green checkmark appears if prescription uploaded

## Technical Details

### Cart Store Structure:
```typescript
{
  id: string
  name: string
  price: number
  quantity: number
  requiresPrescription: boolean  // Must be true
  prescriptionImage?: string     // Base64 image
}
```

### Key Points:
- `requiresPrescription` must be `true` for upload button to show
- `prescriptionImage` stores the uploaded prescription
- Cart is stored in localStorage
- Old cart items may not have `requiresPrescription` flag

## If Still Not Working

### Check Product Data:
Open console and run:
```javascript
fetch('http://localhost:3001/products')
  .then(r => r.json())
  .then(products => {
    const metformin = products.find(p => p.name.includes('Metformin'))
    console.log('Metformin data:', metformin)
    console.log('Requires prescription:', metformin.requires_prescription)
  })
```

### Check Cart Data:
```javascript
const cart = JSON.parse(localStorage.getItem('cart') || '[]')
console.log('Cart items:', cart)
cart.forEach(item => {
  console.log(`${item.name}: requiresPrescription = ${item.requiresPrescription}`)
})
```

## Solution

The issue is that your cart has old data. Simply:
1. **Clear your cart** (remove all items)
2. **Refresh the page**
3. **Add Metformin again** from products page
4. The prescription upload will work correctly

---

**Note**: This is a common issue when testing - old cart data doesn't have the new prescription fields. Clearing the cart fixes it immediately.
