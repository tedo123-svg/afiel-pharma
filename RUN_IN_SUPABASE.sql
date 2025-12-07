-- IMPORTANT: Run these SQL commands in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/[your-project]/sql/new

-- 1. Add is_active column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Set all existing users to active
UPDATE users SET is_active = true WHERE is_active IS NULL;

-- 3. Update admin password (if you haven't already)
UPDATE users 
SET password = '$2b$10$MOJ45hp0WhVu1.nczvM05Ojj30WsqOE/IyhugDKKMZyz/y7PPQknS' 
WHERE email = 'admin@afielpharma.com';

-- 4. Verify the changes
SELECT id, email, role, is_active, created_at FROM users ORDER BY created_at DESC;
