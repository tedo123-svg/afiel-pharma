const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.sdrzjesttcuvdfmlyqrk:Word%401212tedo@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkColumns() {
  try {
    await client.connect();
    
    // Get column names from users table
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n=== USERS TABLE COLUMNS ===');
    result.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });
    
    // Check if admin user exists
    const userCheck = await client.query(`SELECT * FROM users WHERE email = 'admin@afielpharma.com'`);
    console.log('\n=== ADMIN USER EXISTS ===');
    console.log(userCheck.rows.length > 0 ? 'Yes' : 'No');
    if (userCheck.rows.length > 0) {
      console.log('User data:', userCheck.rows[0]);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkColumns();
