const { Client } = require('pg');

async function verifyOrder() {
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

    // Get an order that needs verification
    const result = await client.query(`
      SELECT id, user_id, status, items 
      FROM orders 
      WHERE status = 'awaiting_prescription_verification' 
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      console.log('No orders awaiting verification');
      return;
    }

    const order = result.rows[0];
    console.log('Found order:', order.id);

    // Update to verified
    await client.query(`
      UPDATE orders 
      SET status = 'prescription_verified',
          pharmacist_id = 'test-pharmacist',
          pharmacist_notes = 'Prescription verified for testing'
      WHERE id = $1
    `, [order.id]);

    console.log('✅ Order verified successfully!');
    console.log('Order ID:', order.id);
    console.log('You can now ship this order from the admin panel');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

verifyOrder();
