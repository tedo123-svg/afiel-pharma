const { Client } = require('pg');

async function addMoreProducts() {
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

    const products = [
      // Cardiovascular
      { name: 'Losartan 50mg', description: 'Angiotensin receptor blocker for high blood pressure', price: 25.99, requiresPrescription: true, genericName: 'Losartan', brandName: 'Cozaar', dosage: '50mg', stockQuantity: 400 },
      { name: 'Carvedilol 12.5mg', description: 'Beta blocker for heart failure and hypertension', price: 28.99, requiresPrescription: true, genericName: 'Carvedilol', brandName: 'Coreg', dosage: '12.5mg', stockQuantity: 350 },
      { name: 'Clopidogrel 75mg', description: 'Antiplatelet medication to prevent blood clots', price: 45.99, requiresPrescription: true, genericName: 'Clopidogrel', brandName: 'Plavix', dosage: '75mg', stockQuantity: 300 },
      
      // Diabetes
      { name: 'Glipizide 5mg', description: 'Oral diabetes medication to control blood sugar', price: 21.99, requiresPrescription: true, genericName: 'Glipizide', brandName: 'Glucotrol', dosage: '5mg', stockQuantity: 450 },
      { name: 'Insulin Glargine', description: 'Long-acting insulin for diabetes management', price: 89.99, requiresPrescription: true, genericName: 'Insulin Glargine', brandName: 'Lantus', dosage: '100 units/mL', stockQuantity: 150 },
      
      // Antibiotics
      { name: 'Amoxicillin 500mg', description: 'Penicillin antibiotic for bacterial infections', price: 15.99, requiresPrescription: true, genericName: 'Amoxicillin', brandName: 'Amoxil', dosage: '500mg', stockQuantity: 600 },
      { name: 'Azithromycin 250mg', description: 'Macrolide antibiotic for respiratory infections', price: 32.99, requiresPrescription: true, genericName: 'Azithromycin', brandName: 'Zithromax', dosage: '250mg', stockQuantity: 400 },
      { name: 'Ciprofloxacin 500mg', description: 'Fluoroquinolone antibiotic for various infections', price: 28.99, requiresPrescription: true, genericName: 'Ciprofloxacin', brandName: 'Cipro', dosage: '500mg', stockQuantity: 350 },
      
      // Respiratory
      { name: 'Albuterol Inhaler', description: 'Bronchodilator for asthma and COPD', price: 42.99, requiresPrescription: true, genericName: 'Albuterol', brandName: 'Ventolin', dosage: '90mcg', stockQuantity: 250 },
      { name: 'Montelukast 10mg', description: 'Leukotriene receptor antagonist for asthma', price: 35.99, requiresPrescription: true, genericName: 'Montelukast', brandName: 'Singulair', dosage: '10mg', stockQuantity: 400 },
      
      // Mental Health
      { name: 'Sertraline 50mg', description: 'SSRI antidepressant for depression and anxiety', price: 24.99, requiresPrescription: true, genericName: 'Sertraline', brandName: 'Zoloft', dosage: '50mg', stockQuantity: 500 },
      { name: 'Escitalopram 10mg', description: 'SSRI for depression and generalized anxiety disorder', price: 29.99, requiresPrescription: true, genericName: 'Escitalopram', brandName: 'Lexapro', dosage: '10mg', stockQuantity: 450 },
      { name: 'Alprazolam 0.5mg', description: 'Benzodiazepine for anxiety disorders', price: 18.99, requiresPrescription: true, genericName: 'Alprazolam', brandName: 'Xanax', dosage: '0.5mg', stockQuantity: 300 },
      
      // Pain Management
      { name: 'Tramadol 50mg', description: 'Opioid pain medication for moderate to severe pain', price: 22.99, requiresPrescription: true, genericName: 'Tramadol', brandName: 'Ultram', dosage: '50mg', stockQuantity: 400 },
      { name: 'Gabapentin 300mg', description: 'Anticonvulsant for nerve pain', price: 19.99, requiresPrescription: true, genericName: 'Gabapentin', brandName: 'Neurontin', dosage: '300mg', stockQuantity: 500 },
      { name: 'Meloxicam 15mg', description: 'NSAID for arthritis and pain', price: 16.99, requiresPrescription: true, genericName: 'Meloxicam', brandName: 'Mobic', dosage: '15mg', stockQuantity: 450 },
      
      // Gastrointestinal
      { name: 'Pantoprazole 40mg', description: 'Proton pump inhibitor for GERD', price: 26.99, requiresPrescription: true, genericName: 'Pantoprazole', brandName: 'Protonix', dosage: '40mg', stockQuantity: 400 },
      { name: 'Ondansetron 4mg', description: 'Anti-nausea medication', price: 31.99, requiresPrescription: true, genericName: 'Ondansetron', brandName: 'Zofran', dosage: '4mg', stockQuantity: 300 },
      
      // Allergy
      { name: 'Cetirizine 10mg', description: 'Antihistamine for allergies', price: 11.99, requiresPrescription: false, genericName: 'Cetirizine', brandName: 'Zyrtec', dosage: '10mg', stockQuantity: 800 },
      { name: 'Loratadine 10mg', description: 'Non-drowsy antihistamine for allergies', price: 10.99, requiresPrescription: false, genericName: 'Loratadine', brandName: 'Claritin', dosage: '10mg', stockQuantity: 900 },
      { name: 'Fluticasone Nasal Spray', description: 'Corticosteroid nasal spray for allergies', price: 18.99, requiresPrescription: false, genericName: 'Fluticasone', brandName: 'Flonase', dosage: '50mcg', stockQuantity: 400 },
      
      // Vitamins & Supplements
      { name: 'Vitamin B12 1000mcg', description: 'Essential vitamin for energy and nerve health', price: 14.99, requiresPrescription: false, genericName: 'Cyanocobalamin', brandName: null, dosage: '1000mcg', stockQuantity: 700 },
      { name: 'Omega-3 Fish Oil', description: 'Heart health supplement', price: 19.99, requiresPrescription: false, genericName: 'Omega-3', brandName: null, dosage: '1000mg', stockQuantity: 600 },
      { name: 'Calcium + Vitamin D', description: 'Bone health supplement', price: 16.99, requiresPrescription: false, genericName: 'Calcium Carbonate', brandName: null, dosage: '600mg + 400IU', stockQuantity: 650 },
      { name: 'Multivitamin Daily', description: 'Complete daily multivitamin', price: 13.99, requiresPrescription: false, genericName: 'Multivitamin', brandName: null, dosage: 'Daily', stockQuantity: 800 },
      
      // Cold & Flu
      { name: 'Dextromethorphan Cough Syrup', description: 'Cough suppressant', price: 9.99, requiresPrescription: false, genericName: 'Dextromethorphan', brandName: 'Robitussin', dosage: '15mg/5mL', stockQuantity: 500 },
      { name: 'Pseudoephedrine 30mg', description: 'Decongestant for nasal congestion', price: 8.99, requiresPrescription: false, genericName: 'Pseudoephedrine', brandName: 'Sudafed', dosage: '30mg', stockQuantity: 600 },
      
      // Skin Care
      { name: 'Hydrocortisone Cream 1%', description: 'Topical corticosteroid for skin inflammation', price: 7.99, requiresPrescription: false, genericName: 'Hydrocortisone', brandName: null, dosage: '1%', stockQuantity: 700 },
      { name: 'Clotrimazole Cream', description: 'Antifungal cream for skin infections', price: 12.99, requiresPrescription: false, genericName: 'Clotrimazole', brandName: 'Lotrimin', dosage: '1%', stockQuantity: 500 },
      
      // Eye Care
      { name: 'Artificial Tears', description: 'Lubricating eye drops for dry eyes', price: 11.99, requiresPrescription: false, genericName: 'Polyethylene Glycol', brandName: 'Systane', dosage: '0.4%', stockQuantity: 600 },
    ];

    let added = 0;
    let existing = 0;

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
        added++;
      } else {
        existing++;
      }
    }

    console.log('\n✅ Products update completed!');
    console.log(`📊 Added: ${added} new products`);
    console.log(`ℹ️  Already existed: ${existing} products`);
    console.log(`📦 Total in database: ${added + existing + 10} products`);

  } catch (error) {
    console.error('❌ Error adding products:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addMoreProducts();
