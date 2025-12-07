import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Column({ name: 'requires_prescription', default: true })
  requiresPrescription: boolean

  @Column({ name: 'generic_name', nullable: true })
  genericName: string

  @Column({ name: 'brand_name', nullable: true })
  brandName: string

  @Column({ nullable: true })
  dosage: string

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity: number

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
