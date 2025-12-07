import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User, UserRole } from '../../auth/entities/user.entity'

export async function seedAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User)

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@medrx.com' },
  })

  if (existingAdmin) {
    console.log('Admin user already exists')
    return existingAdmin
  }

  // Create admin user with secure password
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@MedRx2024!'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  const admin = userRepository.create({
    email: 'admin@medrx.com',
    passwordHash,
    role: UserRole.ADMIN,
    firstName: 'System',
    lastName: 'Administrator',
  })

  await userRepository.save(admin)

  console.log('✅ Admin user created successfully')
  console.log('📧 Email: admin@medrx.com')
  console.log('🔑 Password:', adminPassword)
  console.log('⚠️  Please change this password after first login!')

  return admin
}

export async function seedTestUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User)

  const testUsers = [
    {
      email: 'pharmacist@medrx.com',
      password: 'Pharmacist@2024!',
      role: UserRole.PHARMACIST,
      firstName: 'Jane',
      lastName: 'Smith',
    },
    {
      email: 'doctor@medrx.com',
      password: 'Doctor@2024!',
      role: UserRole.DOCTOR,
      firstName: 'Dr. John',
      lastName: 'Williams',
    },
    {
      email: 'patient@medrx.com',
      password: 'Patient@2024!',
      role: UserRole.PATIENT,
      firstName: 'Alice',
      lastName: 'Johnson',
    },
  ]

  for (const userData of testUsers) {
    const existing = await userRepository.findOne({
      where: { email: userData.email },
    })

    if (!existing) {
      const passwordHash = await bcrypt.hash(userData.password, 12)
      const user = userRepository.create({
        email: userData.email,
        passwordHash,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
      })

      await userRepository.save(user)
      console.log(`✅ Created ${userData.role}: ${userData.email}`)
    }
  }
}
