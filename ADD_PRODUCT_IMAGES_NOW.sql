-- Run this in Supabase SQL Editor to add product images
-- Go to: https://supabase.com/dashboard/project/[your-project]/sql/new

-- Add image_url column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add pharmaceutical images for all products
-- Using free pharmaceutical/medical images from Unsplash

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&h=500&fit=crop&q=80' 
WHERE name ILIKE '%Lisinopril%' OR name ILIKE '%blood pressure%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop&q=80' 
WHERE name ILIKE '%Metformin%' OR name ILIKE '%diabetes%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=500&fit=crop&q=80' 
WHERE name ILIKE '%Atorvastatin%' OR name ILIKE '%cholesterol%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&h=500&fit=crop&q=80' 
WHERE name ILIKE '%Amlodipine%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1550572017-4a6e8e8e4e8e?w=500&h=500&fit=crop&q=80' 
WHERE name ILIKE '%Omeprazole%' OR name ILIKE '%acid%';

-- Set default image for any products without images
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop&q=80' 
WHERE image_url IS NULL OR image_url = '';

-- Verify the update
SELECT id, name, image_url FROM products LIMIT 10;
