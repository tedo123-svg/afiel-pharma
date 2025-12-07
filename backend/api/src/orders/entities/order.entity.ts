import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum OrderStatus {
  PENDING = 'pending',
  AWAITING_PRESCRIPTION_VERIFICATION = 'awaiting_prescription_verification',
  PRESCRIPTION_VERIFIED = 'prescription_verified',
  PRESCRIPTION_DENIED = 'prescription_denied',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number

  @Column({ type: 'jsonb' })
  items: any[]

  @Column({ type: 'jsonb', nullable: true, name: 'shipping_address' })
  shippingAddress: any

  @Column({ nullable: true, name: 'tracking_number' })
  trackingNumber: string

  @Column({ name: 'requires_prescription_verification', default: false })
  requiresPrescriptionVerification: boolean

  @Column({ name: 'pharmacist_id', nullable: true })
  pharmacistId: string

  @Column({ type: 'text', nullable: true, name: 'pharmacist_notes' })
  pharmacistNotes: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
