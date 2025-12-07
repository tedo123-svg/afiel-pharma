import { DataSource } from 'typeorm'
import { seedAdminUser, seedTestUsers } from './admin.seed'
import { seedProducts } from './products.seed'

async function runSeeds() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'meduser',
    password: 'medpassword',
    database: 'medplatform',
    entities: ['src/**/*.entity.ts'],
    synchronize: true,
  })

  try {
    await dataSource.initialize()
    console.log('📦 Database connected')

    console.log('\n🌱 Seeding database...\n')

    // Seed admin and test users
    await seedAdminUser(dataSource)
    await seedTestUsers(dataSource)

    // Seed products
    await seedProducts(dataSource)

    console.log('\n✅ Database seeding completed successfully!')
    console.log('\n📋 Test Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Admin:      admin@medrx.com / Admin@MedRx2024!')
    console.log('Pharmacist: pharmacist@medrx.com / Pharmacist@2024!')
    console.log('Doctor:     doctor@medrx.com / Doctor@2024!')
    console.log('Patient:    patient@medrx.com / Patient@2024!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    await dataSource.destroy()
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

runSeeds()
