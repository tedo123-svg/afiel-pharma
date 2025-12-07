const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://meduser:medpassword@localhost:5432/medplatform',
});

async function listPrescriptionMeds() {
  try {
    const result = await pool.query(`
      SELECT name, brand_name, generic_name, dosage, price, requires_prescription 
      FROM products 
      WHERE requires_prescription = true 
      ORDER BY name
    `);
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║         PRESCRIPTION MEDICATIONS (Rx Required)             ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    result.rows.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Brand: ${p.brand_name || 'N/A'} | Generic: ${p.generic_name || 'N/A'}`);
      console.log(`   Dosage: ${p.dosage} | Price: $${p.price}`);
      console.log(`   🔴 Requires Prescription\n`);
    });
    
    console.log(`\n📊 Total: ${result.rows.length} prescription medications\n`);
    
    // Also show OTC medications
    const otcResult = await pool.query(`
      SELECT name, dosage, price 
      FROM products 
      WHERE requires_prescription = false 
      ORDER BY name
    `);
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║      OVER-THE-COUNTER MEDICATIONS (No Rx Required)        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    otcResult.rows.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ${p.dosage} - $${p.price}`);
    });
    
    console.log(`\n📊 Total: ${otcResult.rows.length} OTC medications\n`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

listPrescriptionMeds();
