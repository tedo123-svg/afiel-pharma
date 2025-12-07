# Admin Pages Translation Guide

## Translation Keys Added ✅

All translation keys have been added to `en.json` and `am.json` under the `admin` section.

## Pages That Need Translation Implementation

### 1. **Manage Users Page** (`frontend/src/app/admin/users/page.tsx`)

**Add at top:**
```typescript
import { useLanguage } from '@/contexts/LanguageContext'
const { t } = useLanguage()
```

**Replace these texts:**
- "Manage Users" → `{t.admin.users.title}`
- "Add User" → `{t.admin.users.addUser}`
- "Email" → `{t.admin.users.email}`
- "Name" → `{t.admin.users.name}`
- "Role" → `{t.admin.users.role}`
- "Status" → `{t.admin.users.status}`
- "Actions" → `{t.admin.users.actions}`
- "Active" → `{t.admin.users.active}`
- "Inactive" → `{t.admin.users.inactive}`
- "Activate" → `{t.admin.users.activate}`
- "Deactivate" → `{t.admin.users.deactivate}`
- "Patient" → `{t.admin.users.patient}`
- "Doctor" → `{t.admin.users.doctor}`
- "Pharmacist" → `{t.admin.users.pharmacist}`
- "Loading users..." → `{t.admin.users.loading}`
- "No users found" → `{t.admin.users.noUsers}`

### 2. **Manage Orders Page** (`frontend/src/app/admin/orders/page.tsx`)

**Add at top:**
```typescript
import { useLanguage } from '@/contexts/LanguageContext'
const { t } = useLanguage()
```

**Replace these texts:**
- "Manage Orders" → `{t.admin.orders.title}`
- "Order #" → `{t.admin.orders.orderNumber}`
- "Customer" → `{t.admin.orders.customer}`
- "Date" → `{t.admin.orders.date}`
- "Status" → `{t.admin.orders.status}`
- "Total" → `{t.admin.orders.total}`
- "Actions" → `{t.admin.orders.actions}`
- "View Details" → `{t.admin.orders.viewDetails}`
- "Export CSV" → `{t.admin.orders.exportCSV}`
- "Export Excel" → `{t.admin.orders.exportExcel}`
- "Export PDF" → `{t.admin.orders.exportPDF}`
- "All Orders" → `{t.admin.orders.allOrders}`
- "Pending" → `{t.admin.orders.pending}`
- "Verified" → `{t.admin.orders.verified}`
- "Shipped" → `{t.admin.orders.shipped}`

### 3. **Orders Page** (`frontend/src/app/orders/page.tsx`)

This page uses similar translations from `prescriptions` and `admin.orders` sections.

## Quick Implementation

Since these are admin-only pages with lots of hardcoded text, the translation implementation would require:

1. Import `useLanguage` hook
2. Get `t` function
3. Replace ~50+ hardcoded strings per page

## Current Status

✅ Translation keys added to JSON files
⏳ Pages need hook integration and string replacement

## Note

These admin pages are only accessible to admin users, so they have lower priority than customer-facing pages. All customer-facing pages (Home, Products, Cart, Checkout, Login, Register, About, Account, Prescriptions) are **fully translated** ✅
