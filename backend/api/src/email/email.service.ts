import { Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
  async sendOTP(email: string, otp: string): Promise<void> {
    // In production, integrate with SendGrid, AWS SES, or similar
    console.log(`
╔════════════════════════════════════════╗
║     EMAIL VERIFICATION OTP             ║
╠════════════════════════════════════════╣
║  To: ${email.padEnd(30)} ║
║  OTP: ${otp.padEnd(29)} ║
║  Valid for: 10 minutes                 ║
╚════════════════════════════════════════╝
    `)
    
    // For development, we'll just log it
    // In production, replace with actual email sending:
    /*
    await this.mailer.sendMail({
      to: email,
      subject: 'Verify Your Email - AfiEl Pharma',
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    })
    */
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    console.log(`
╔════════════════════════════════════════╗
║     WELCOME EMAIL                      ║
╠════════════════════════════════════════╣
║  To: ${email.padEnd(30)} ║
║  Welcome ${firstName}!                 ║
╚════════════════════════════════════════╝
    `)
  }
}
