import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly key: Buffer

  constructor() {
    const keyString = process.env.ENCRYPTION_KEY
    if (!keyString || keyString.length !== 64) {
      throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)')
    }
    this.key = Buffer.from(keyString, 'hex')
  }

  /**
   * Encrypt PHI data using AES-256-GCM
   * Returns base64-encoded encrypted data with IV and auth tag
   */
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    // Combine IV + authTag + encrypted data
    const combined = Buffer.concat([
      iv,
      authTag,
      Buffer.from(encrypted, 'hex'),
    ])
    
    return combined.toString('base64')
  }

  /**
   * Decrypt PHI data
   */
  decrypt(encryptedData: string): string {
    const combined = Buffer.from(encryptedData, 'base64')
    
    const iv = combined.subarray(0, 16)
    const authTag = combined.subarray(16, 32)
    const encrypted = combined.subarray(32)
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    
    return decrypted.toString('utf8')
  }

  /**
   * Hash sensitive data (one-way, for comparison only)
   */
  hash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
  }

  /**
   * Generate secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }
}
