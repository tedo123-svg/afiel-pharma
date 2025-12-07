const { Client } = require('pg');

async function createTestOrder() {
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

    // Create a test order with prescription_verified status
    const result = await client.query(`
      INSERT INTO orders (
        user_id, 
        status, 
        total_amount, 
        items, 
        shipping_address,
        requires_prescription_verification,
        pharmacist_id,
        pharmacist_notes
      ) VALUES (
        'test-user-123',
        'prescription_verified',
        25.99,
        '[
          {
            "id": "prod-1",
            "name": "Amoxicillin 500mg",
            "price": 19.99,
            "quantity": 1,
            "requiresPrescription": true,
            "prescriptionImage": "data:image/png;base64,test"
          }
        ]'::jsonb,
        '{
          "fullName": "Test User",
          "email": "test@example.com",
          "phone": "555-0123",
          "address": "123 Test St",
          "city": "Test City",
          "state": "TS",
          "zipCode": "12345"
        }'::jsonb,
        true,
        'pharmacist-123',
        'Prescription verified and approved'
      )
      RETURNING id
    `);

    console.log('✅ Test order created successfully!');
    console.log('Order ID:', result.rows[0].id);
    console.log('Status: prescription_verified');
    console.log('This order is ready to be shipped from the admin panel');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

createTestOrder();
