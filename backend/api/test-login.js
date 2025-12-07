const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post('https://afiel-pharma.onrender.com/auth/login', {
      email: 'admin@afielpharma.com',
      password: 'Admin@AfiEl2024!'
    });
    
    console.log('\n✅ LOGIN SUCCESS!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('\n❌ LOGIN FAILED');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
