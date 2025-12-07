import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuditLog } from './entities/audit-log.entity'

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PRESCRIPTION_UPLOAD = 'PRESCRIPTION_UPLOAD',
  PRESCRIPTION_VIEW = 'PRESCRIPTION_VIEW',
  PRESCRIPTION_VERIFY = 'PRESCRIPTION_VERIFY',
  ORDER_CREATE = 'ORDER_CREATE',
  PHI_ACCESS = 'PHI_ACCESS',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(
    action: AuditAction,
    userId: string,
    resourceType: string,
    resourceId: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
  ): Promise<void> {
    const auditLog = this.auditLogRepository.create({
      action,
      userId,
      resourceType,
      resourceId,
      metadata,
      ipAddress,
      timestamp: new Date(),
    })

    await this.auditLogRepository.save(auditLog)
  }

  async getAuditTrail(resourceId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { resourceId },
      order: { timestamp: 'DESC' },
    })
  }
}
