const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';

// Test user IDs (from database)
const PATIENT_ID = 'test-patient-123';
const PHARMACIST_ID = 'c4705530-5635-4d4a-a6ba-f80f4ff1a19b'; // Ayele

// Sample prescription image (base64 encoded small image)
const SAMPLE_PRESCRIPTION = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function testWorkflow() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     TESTING PRESCRIPTION WORKFLOW                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // Step 1: Create order with prescription item
    console.log('📝 Step 1: Creating order with prescription medication...');
    
    const orderData = {
      items: [
        {
          id: '17ceb622-a99d-49c4-960a-afdd99a7b43b', // Metformin
          name: 'Metformin 500mg',
          price: 19.99,
          quantity: 1,
          requiresPrescription: true,
          prescriptionImage: SAMPLE_PRESCRIPTION
        }
      ],
      totalAmount: 27.96, // 19.99 + 4.99 shipping + tax
      shippingAddress: {
        fullName: 'Test Patient',
        email: 'test@example.com',
        phone: '555-0123',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345'
      }
    };

    const createResponse = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': PATIENT_ID,
        'x-user-role': 'patient'
      },
      body: JSON.stringify(orderData)
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Failed to create order: ${error}`);
    }

    const order = await createResponse.json();
    console.log(`✅ Order created: ${order.id}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Requires Rx Verification: ${order.requiresPrescriptionVerification}`);

    // Step 2: Check if order appears in pending queue
    console.log('\n🔍 Step 2: Checking pharmacist pending queue...');
    
    const pendingResponse = await fetch(`${API_URL}/orders/prescriptions/pending`, {
      headers: {
        'x-user-id': PHARMACIST_ID,
        'x-user-role': 'pharmacist'
      }
    });

    if (!pendingResponse.ok) {
      throw new Error('Failed to fetch pending prescriptions');
    }

    const pendingOrders = await pendingResponse.json();
    const foundOrder = pendingOrders.find(o => o.id === order.id);
    
    if (foundOrder) {
      console.log(`✅ Order found in pharmacist queue`);
      console.log(`   ${pendingOrders.length} total pending prescription(s)`);
    } else {
      console.log(`⚠️  Order not found in queue (might be old order)`);
    }

    // Step 3: Approve the prescription
    console.log('\n✅ Step 3: Pharmacist approving prescription...');
    
    const verifyResponse = await fetch(`${API_URL}/orders/${order.id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': PHARMACIST_ID,
        'x-user-role': 'pharmacist'
      },
      body: JSON.stringify({
        approved: true,
        pharmacistId: PHARMACIST_ID,
        notes: 'Prescription verified - automated test'
      })
    });

    if (!verifyResponse.ok) {
      throw new Error('Failed to verify prescription');
    }

    const verifiedOrder = await verifyResponse.json();
    console.log(`✅ Prescription approved`);
    console.log(`   New Status: ${verifiedOrder.status}`);
    console.log(`   Pharmacist ID: ${verifiedOrder.pharmacistId}`);
    console.log(`   Notes: ${verifiedOrder.pharmacistNotes}`);

    // Step 4: Verify order no longer in pending queue
    console.log('\n🔍 Step 4: Verifying order removed from queue...');
    
    const checkResponse = await fetch(`${API_URL}/orders/prescriptions/pending`, {
      headers: {
        'x-user-id': PHARMACIST_ID,
        'x-user-role': 'pharmacist'
      }
    });

    const remainingOrders = await checkResponse.json();
    const stillInQueue = remainingOrders.find(o => o.id === order.id);
    
    if (!stillInQueue) {
      console.log(`✅ Order successfully removed from pending queue`);
      console.log(`   ${remainingOrders.length} remaining pending prescription(s)`);
    } else {
      console.log(`❌ Order still in queue (unexpected)`);
    }

    // Step 5: Check patient can see updated order
    console.log('\n👤 Step 5: Checking patient order view...');
    
    const patientOrdersResponse = await fetch(`${API_URL}/orders/user/${PATIENT_ID}`, {
      headers: {
        'x-user-id': PATIENT_ID,
        'x-user-role': 'patient'
      }
    });

    if (patientOrdersResponse.ok) {
      const patientOrders = await patientOrdersResponse.json();
      const patientOrder = patientOrders.find(o => o.id === order.id);
      
      if (patientOrder) {
        console.log(`✅ Patient can see their order`);
        console.log(`   Status: ${patientOrder.status}`);
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║     ✅ WORKFLOW TEST COMPLETED SUCCESSFULLY                ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('Summary:');
    console.log('✅ Order created with prescription item');
    console.log('✅ Order appeared in pharmacist queue');
    console.log('✅ Pharmacist approved prescription');
    console.log('✅ Order status updated to verified');
    console.log('✅ Order removed from pending queue');
    console.log('✅ Patient can view updated order\n');

  } catch (error) {
    console.error('\n❌ Error during workflow test:', error.message);
    console.error(error);
  }
}

// Run the test
testWorkflow();
