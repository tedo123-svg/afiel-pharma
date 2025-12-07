const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.zxrcwubjqoqqeyuafmxu',
  password: 'Word@1212tedo',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkOrders() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get recent orders
    const result = await client.query(`
      SELECT 
        id,
        user_id,
        status,
        total_amount,
        payment_method,
        payment_status,
        created_at,
        items
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log(`📦 Found ${result.rows.length} recent orders:\n`);
    
    result.rows.forEach((order, index) => {
      console.log(`Order ${index + 1}:`);
      console.log(`  ID: ${order.id}`);
      console.log(`  User ID: ${order.user_id}`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Total: $${order.total_amount}`);
      console.log(`  Payment Method: ${order.payment_method}`);
      console.log(`  Payment Status: ${order.payment_status}`);
      console.log(`  Created: ${order.created_at}`);
      console.log(`  Items: ${JSON.stringify(order.items, null, 2)}`);
      console.log('---\n');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkOrders();
