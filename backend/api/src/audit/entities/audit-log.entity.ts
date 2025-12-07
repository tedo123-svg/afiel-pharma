import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm'

@Entity('audit_logs')
@Index(['resourceId', 'timestamp'])
@Index(['userId', 'timestamp'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  action: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'resource_type' })
  resourceType: string

  @Column({ name: 'resource_id' })
  resourceId: string

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string

  @CreateDateColumn()
  timestamp: Date
}
