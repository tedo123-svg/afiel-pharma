const bcrypt = require('bcrypt');

const password = 'Admin@AfiEl2024!';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('\n=== ADMIN PASSWORD HASH ===');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\n=== SQL TO UPDATE USER ===');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@afielpharma.com';`);
  console.log('\n');
});
