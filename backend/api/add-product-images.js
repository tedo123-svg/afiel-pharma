const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL from .env or construct from individual parts
const connectionString = process.env.DATABASE_URL || 'postgresql://meduser:medpassword@localhost:5432/medplatform';

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Medical/pharmaceutical themed images
const productImages = {
  'Lisinopril': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
  'Metformin': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
  'Atorvastatin': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop',
  'Amlodipine': 'https://images.unsplash.com/photo-1550572017-4a6e8e8e4e8e?w=400&h=400&fit=crop',
  'Omeprazole': 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop',
  'Levothyroxine': 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop',
  'Metoprolol': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
  'Losartan': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
  'Albuterol': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop',
  'Gabapentin': 'https://images.unsplash.com/photo-1550572017-4a6e8e8e4e8e?w=400&h=400&fit=crop',
};

const defaultImage = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop';

async function addProductImages() {
  const client = await pool.connect();
  
  try {
    console.log('Adding image_url column if it doesn\'t exist...');
    await client.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)
    `);
    
    console.log('Fetching all products...');
    const result = await client.query('SELECT id, name FROM products');
    const products = result.rows;
    
    console.log(`Found ${products.length} products. Updating images...`);
    
    for (const product of products) {
      let imageUrl = defaultImage;
      
      // Find matching image based on product name
      for (const [key, url] of Object.entries(productImages)) {
        if (product.name.includes(key)) {
          imageUrl = url;
          break;
        }
      }
      
      await client.query(
        'UPDATE products SET image_url = $1 WHERE id = $2',
        [imageUrl, product.id]
      );
      
      console.log(`✓ Updated ${product.name} with image`);
    }
    
    console.log('\n✅ Successfully added images to all products!');
    
  } catch (error) {
    console.error('Error adding product images:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addProductImages();
