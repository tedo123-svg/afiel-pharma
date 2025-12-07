# Orders Table Setup

## Issue
The orders table was missing from the database, causing 500 errors when trying to create orders.

## Solution
Created the orders table with the following schema:

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    items JSONB NOT NULL,
    shipping_address JSONB,
    tracking_number VARCHAR(255),
    requires_prescription_verification BOOLEAN DEFAULT FALSE,
    pharmacist_id VARCHAR(255),
    pharmacist_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes Created
- `idx_orders_user_id` - For fast user order lookups
- `idx_orders_status` - For pharmacist dashboard filtering
- `idx_orders_created_at` - For chronological sorting

## Status Values
- `pending` - Initial status for non-prescription orders
- `awaiting_prescription_verification` - Prescription orders waiting for pharmacist
- `prescription_verified` - Pharmacist approved
- `prescription_denied` - Pharmacist denied
- `processing` - Order being prepared
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled

## Verification
✅ Table created successfully
✅ Indexes created
✅ Test order created successfully
✅ API endpoint working (201 status)

## Commands Used
```bash
# Create table
docker exec -i infrastructure-postgres-1 psql -U meduser -d medplatform -c "CREATE TABLE IF NOT EXISTS orders (...);"

# Create indexes
docker exec -i infrastructure-postgres-1 psql -U meduser -d medplatform -c "CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);"

# Verify table
docker exec -i infrastructure-postgres-1 psql -U meduser -d medplatform -c "\d orders"

# Check data
docker exec -i infrastructure-postgres-1 psql -U meduser -d medplatform -c "SELECT * FROM orders;"
```

## Next Steps
The checkout flow should now work properly. Patients can:
1. Add items to cart
2. Upload prescriptions (if needed)
3. Complete checkout
4. Track order status

Pharmacists can:
1. View pending orders
2. Review prescription images
3. Approve or deny orders
