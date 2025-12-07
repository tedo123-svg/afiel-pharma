-- Add image_url column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Update products with image URLs (using placeholder images from a CDN)
-- These are medical/pharmaceutical themed images

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop' WHERE name LIKE '%Lisinopril%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop' WHERE name LIKE '%Metformin%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop' WHERE name LIKE '%Atorvastatin%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1550572017-4a6e8e8e4e8e?w=400&h=400&fit=crop' WHERE name LIKE '%Amlodipine%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop' WHERE name LIKE '%Omeprazole%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop' WHERE name LIKE '%Levothyroxine%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop' WHERE name LIKE '%Metoprolol%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop' WHERE name LIKE '%Losartan%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop' WHERE name LIKE '%Albuterol%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1550572017-4a6e8e8e4e8e?w=400&h=400&fit=crop' WHERE name LIKE '%Gabapentin%';

-- For any products without images, set a default pharmaceutical image
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop' WHERE image_url IS NULL;
