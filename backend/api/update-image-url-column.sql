-- Update image_url column to TEXT type to support base64 images
-- Base64 images can be very large (100KB+ encoded)

ALTER TABLE products 
ALTER COLUMN image_url TYPE TEXT;

-- Verify the change
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'image_url';
