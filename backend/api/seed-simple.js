const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function seed() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'meduser',
    password: 'medpassword',
    database: 'medplatform',
  });

  try {
    await client.connect();
    console.log('📦 Database connected');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'patient',
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone_number VARCHAR(20),
        mfa_enabled BOOLEAN DEFAULT false,
        mfa_secret VARCHAR(255),
        email_verified BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP
      );
    `);

    console.log('✅ Users table created');

    // Check if admin exists
    const adminCheck = await client.query('SELECT * FROM users WHERE email = $1', ['admin@medrx.com']);
    
    if (adminCheck.rows.length === 0) {
      // Create admin user
      const adminPassword = await bcrypt.hash('Admin@MedRx2024!', 12);
      await client.query(`
        INSERT INTO users (email, password_hash, role, first_name, last_name, email_verified, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, ['admin@medrx.com', adminPassword, 'admin', 'System', 'Administrator', true, true]);
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create test users
    const testUsers = [
      { email: 'pharmacist@medrx.com', password: 'Pharmacist@2024!', role: 'pharmacist', firstName: 'Jane', lastName: 'Smith' },
      { email: 'doctor@medrx.com', password: 'Doctor@2024!', role: 'doctor', firstName: 'Dr. John', lastName: 'Williams' },
      { email: 'patient@medrx.com', password: 'Patient@2024!', role: 'patient', firstName: 'Alice', lastName: 'Johnson' },
    ];

    for (const user of testUsers) {
      const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [user.email]);
      if (userCheck.rows.length === 0) {
        const passwordHash = await bcrypt.hash(user.password, 12);
        await client.query(`
          INSERT INTO users (email, password_hash, role, first_name, last_name, email_verified, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [user.email, passwordHash, user.role, user.firstName, user.lastName, true, true]);
        console.log(`✅ Created ${user.role}: ${user.email}`);
      }
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:      admin@medrx.com / Admin@MedRx2024!');
    console.log('Pharmacist: pharmacist@medrx.com / Pharmacist@2024!');
    console.log('Doctor:     doctor@medrx.com / Doctor@2024!');
    console.log('Patient:    patient@medrx.com / Patient@2024!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
