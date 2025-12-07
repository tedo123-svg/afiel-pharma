import { Controller, Post, Get, Put, Body, Req, Param } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; firstName: string; lastName: string; role?: string }) {
    return this.authService.register(body.email, body.password, body.firstName, body.lastName, body.role)
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Req() req: any) {
    const ipAddress = req.ip
    return this.authService.login(body.email, body.password, ipAddress)
  }

  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers()
  }

  @Put('users/:id/toggle-status')
  async toggleUserStatus(@Param('id') id: string, @Body() body: { adminId: string }) {
    return this.authService.toggleUserStatus(id, body.adminId)
  }

  @Post('verify-otp')
  async verifyOTP(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOTP(body.email, body.otp)
  }

  @Post('resend-otp')
  async resendOTP(@Body() body: { email: string }) {
    return this.authService.resendOTP(body.email)
  }
}
