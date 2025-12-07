const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://meduser:medpassword@localhost:5432/medplatform' });

pool.query(`SELECT name, requires_prescription FROM products WHERE name LIKE '%Metformin%'`)
  .then(r => {
    console.log('\nMetformin prescription status:');
    r.rows.forEach(p => console.log(`${p.name}: requires_prescription = ${p.requires_prescription}`));
    pool.end();
  });
