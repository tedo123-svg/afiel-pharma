# ⚠️ URGENT: Run This SQL in Supabase NOW

The backend is crashing because the `is_active` column doesn't exist in the database yet.

## Steps:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste this SQL:

```sql
-- Add is_active column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Set all existing users to active
UPDATE users SET is_active = true WHERE is_active IS NULL;
```

6. Click "Run" button
7. Wait for "Success. No rows returned" message
8. Backend will work immediately (no need to redeploy)

## Verify it worked:

Run this query to check:
```sql
SELECT id, email, role, is_active FROM users LIMIT 5;
```

You should see the `is_active` column with `true` values.

## After running the SQL:

- Go to https://afiel-pharma-frontend.vercel.app/admin/users
- You'll see all users (patients, doctors, pharmacists)
- Click "Deactivate" to block any user
- Deactivated users can't login
