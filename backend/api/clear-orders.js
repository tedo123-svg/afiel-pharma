const { Client } = require('pg');

async function clearOrders() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'medplatform',
    user: 'meduser',
    password: 'medpassword',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Delete all orders
    const result = await client.query('DELETE FROM orders');
    
    console.log(`✅ Deleted ${result.rowCount} orders`);
    console.log('All orders have been removed from the database');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

clearOrders();
