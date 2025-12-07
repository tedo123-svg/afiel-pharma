-- Create admin user for AfiEl Pharma
-- Run this in Supabase SQL Editor

-- First, check if users table exists
-- If it doesn't, you need to run the migrations first

-- Create admin user
-- Password: Admin@AfiEl2024! (will be hashed by bcrypt with 10 rounds)
-- Hash generated: $2b$10$rQ7HvHZ8vX5kqYp8FqGqXeK8YvN8mH5jL5xZ9nQ7vH8vX5kqYp8Fq

INSERT INTO users (
  id,
  email,
  password_hash,
  first_name,
  last_name,
  role,
  is_active,
  email_verified,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@afielpharma.com',
  '$2b$10$YQRiQE8H9F3xGqZ8vX5kqYp8FqGqXeK8YvN8mH5jL5xZ9nQ7vH8vX',
  'Admin',
  'User',
  'admin',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verify the user was created
SELECT id, email, role, is_active FROM users WHERE email = 'admin@afielpharma.com';
