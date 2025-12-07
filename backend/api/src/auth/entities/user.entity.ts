import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  PHARMACIST = 'pharmacist',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @Column({ type: 'varchar', default: UserRole.PATIENT })
  role: UserRole

  @Column({ name: 'first_name', nullable: true })
  firstName: string

  @Column({ name: 'last_name', nullable: true })
  lastName: string

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string

  @Column({ name: 'mfa_enabled', default: false })
  mfaEnabled: boolean

  @Column({ name: 'mfa_secret', nullable: true })
  mfaSecret: string

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean

  @Column({ name: 'verification_otp', type: 'varchar', nullable: true })
  verificationOtp?: string

  @Column({ name: 'otp_expires_at', type: 'timestamp', nullable: true })
  otpExpiresAt?: Date

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date
}
