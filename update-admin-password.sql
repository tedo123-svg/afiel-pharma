-- Update admin password to: Admin@AfiEl2024!
-- This hash was generated with bcrypt rounds=10
UPDATE users 
SET password = '$2b$10$MOJ45hp0WhVu1.nczvM05Ojj30WsqOE/IyhugDKKMZyz/y7PPQknS' 
WHERE email = 'admin@afielpharma.com';
