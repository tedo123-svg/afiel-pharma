import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User, UserRole } from './entities/user.entity'
import { AuditService, AuditAction } from '../audit/audit.service'
import { EmailService } from '../email/email.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private auditService: AuditService,
    private emailService: EmailService,
  ) {}

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async register(email: string, password: string, firstName: string, lastName: string, role?: string) {
    const passwordHash = await bcrypt.hash(password, 12)
    const userRole = (role || 'patient') as UserRole
    
    const user = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role: userRole,
      isActive: true,
    })

    await this.userRepository.save(user)
    // await this.auditService.log(AuditAction.USER_CREATE, user.id, 'user', user.id)

    return { id: user.id, email: user.email, role: user.role }
  }

  async verifyOTP(email: string, otp: string): Promise<any> {
    throw new BadRequestException('OTP verification not implemented')
  }

  async resendOTP(email: string): Promise<any> {
    throw new BadRequestException('OTP not implemented')
  }

  async login(email: string, password: string, ipAddress?: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive')
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    const token = this.jwtService.sign(payload)

    user.lastLoginAt = new Date()
    await this.userRepository.save(user)
    
    // await this.auditService.log(
    //   AuditAction.LOGIN,
    //   user.id,
    //   'user',
    //   user.id,
    //   { email },
    //   ipAddress,
    // )

    return { access_token: token, user: { id: user.id, email: user.email, role: user.role } }
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } })
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt', 'lastLoginAt'],
      order: { createdAt: 'DESC' },
    })
  }

  async toggleUserStatus(userId: string, adminId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) return null

    user.isActive = !user.isActive
    await this.userRepository.save(user)
    
    // await this.auditService.log(
    //   AuditAction.USER_CREATE,
    //   adminId,
    //   'user',
    //   userId,
    //   { action: user.isActive ? 'activated' : 'deactivated' }
    // )

    return user
  }
}
