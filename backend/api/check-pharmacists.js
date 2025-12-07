const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://meduser:medpassword@localhost:5432/medplatform',
});

async function checkPharmacists() {
  try {
    const result = await pool.query("SELECT id, email, role FROM users WHERE role = 'pharmacist'");
    console.log('Pharmacists in database:');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkPharmacists();
