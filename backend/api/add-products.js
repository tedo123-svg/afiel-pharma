const { Client } = require('pg');

async function addProducts() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'meduser',
    password: 'medpassword',
    database: 'medplatform',
  });

  try {
    await client.connect();
    console.log('📦 Database connected');

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL,
        requires_prescription BOOLEAN DEFAULT true,
        generic_name VARCHAR(255),
        brand_name VARCHAR(255),
        dosage VARCHAR(100),
        stock_quantity INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Products table created');

    const products = [
      {
        name: 'Lisinopril 10mg',
        description: 'ACE inhibitor for high blood pressure and heart failure',
        price: 29.99,
        requiresPrescription: true,
        genericName: 'Lisinopril',
        brandName: 'Prinivil, Zestril',
        dosage: '10mg',
        stockQuantity: 500,
      },
      {
        name: 'Metformin 500mg',
        description: 'Oral diabetes medication that helps control blood sugar',
        price: 19.99,
        requiresPrescription: true,
        genericName: 'Metformin',
        brandName: 'Glucophage',
        dosage: '500mg',
        stockQuantity: 750,
      },
      {
        name: 'Atorvastatin 20mg',
        description: 'Statin medication to lower cholesterol',
        price: 34.99,
        requiresPrescription: true,
        genericName: 'Atorvastatin',
        brandName: 'Lipitor',
        dosage: '20mg',
        stockQuantity: 600,
      },
      {
        name: 'Omeprazole 20mg',
        description: 'Proton pump inhibitor for acid reflux and heartburn',
        price: 24.99,
        requiresPrescription: true,
        genericName: 'Omeprazole',
        brandName: 'Prilosec',
        dosage: '20mg',
        stockQuantity: 800,
      },
      {
        name: 'Levothyroxine 50mcg',
        description: 'Thyroid hormone replacement medication',
        price: 22.99,
        requiresPrescription: true,
        genericName: 'Levothyroxine',
        brandName: 'Synthroid',
        dosage: '50mcg',
        stockQuantity: 450,
      },
      {
        name: 'Amlodipine 5mg',
        description: 'Calcium channel blocker for high blood pressure',
        price: 18.99,
        requiresPrescription: true,
        genericName: 'Amlodipine',
        brandName: 'Norvasc',
        dosage: '5mg',
        stockQuantity: 550,
      },
      {
        name: 'Ibuprofen 200mg',
        description: 'Over-the-counter pain reliever and anti-inflammatory',
        price: 9.99,
        requiresPrescription: false,
        genericName: 'Ibuprofen',
        brandName: 'Advil, Motrin',
        dosage: '200mg',
        stockQuantity: 1000,
      },
      {
        name: 'Acetaminophen 500mg',
        description: 'Over-the-counter pain reliever and fever reducer',
        price: 8.99,
        requiresPrescription: false,
        genericName: 'Acetaminophen',
        brandName: 'Tylenol',
        dosage: '500mg',
        stockQuantity: 1200,
      },
      {
        name: 'Vitamin D3 1000 IU',
        description: 'Dietary supplement for bone health',
        price: 12.99,
        requiresPrescription: false,
        genericName: 'Cholecalciferol',
        brandName: null,
        dosage: '1000 IU',
        stockQuantity: 900,
      },
      {
        name: 'Aspirin 81mg',
        description: 'Low-dose aspirin for heart health',
        price: 7.99,
        requiresPrescription: false,
        genericName: 'Aspirin',
        brandName: 'Bayer',
        dosage: '81mg',
        stockQuantity: 1500,
      },
    ];

    for (const product of products) {
      const check = await client.query('SELECT * FROM products WHERE name = $1', [product.name]);
      
      if (check.rows.length === 0) {
        await client.query(`
          INSERT INTO products (name, description, price, requires_prescription, generic_name, brand_name, dosage, stock_quantity)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          product.name,
          product.description,
          product.price,
          product.requiresPrescription,
          product.genericName,
          product.brandName,
          product.dosage,
          product.stockQuantity
        ]);
        console.log(`✅ Added: ${product.name}`);
      } else {
        console.log(`ℹ️  Already exists: ${product.name}`);
      }
    }

    console.log('\n✅ Products added successfully!');
    console.log(`\n📊 Total products: ${products.length}`);

  } catch (error) {
    console.error('❌ Error adding products:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addProducts();
