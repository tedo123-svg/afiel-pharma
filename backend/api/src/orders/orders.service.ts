import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order, OrderStatus } from './entities/order.entity'
import { AuditService, AuditAction } from '../audit/audit.service'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private auditService: AuditService,
  ) {}

  async create(userId: string, orderData: any): Promise<Order> {
    // Validate required prescriptions are present
    const missingPrescriptions = orderData.items?.filter(
      (item: any) => item.requiresPrescription && !item.prescriptionImage
    )

    if (missingPrescriptions && missingPrescriptions.length > 0) {
      const missingNames = missingPrescriptions.map((i: any) => i.name || i.id).join(', ')
      throw new BadRequestException(`Missing prescription for items: ${missingNames}`)
    }

    // Check if any items require prescription
    const requiresPrescription = orderData.items?.some(
      (item: any) => item.requiresPrescription
    )

    const order = this.orderRepository.create({
      userId,
      ...orderData,
      status: requiresPrescription 
        ? OrderStatus.AWAITING_PRESCRIPTION_VERIFICATION 
        : OrderStatus.PENDING,
    })

    const result = await this.orderRepository.save(order)
    const savedOrder = Array.isArray(result) ? result[0] : result
    await this.auditService.log(AuditAction.ORDER_CREATE, userId, 'order', savedOrder.id)

    return savedOrder
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({ where: { userId } })
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find()
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id } })
  }

  async verifyPrescription(
    orderId: string,
    pharmacistId: string,
    approved: boolean,
    notes?: string
  ): Promise<Order | null> {
    const order = await this.findOne(orderId)
    if (!order) return null

    order.status = approved 
      ? OrderStatus.PRESCRIPTION_VERIFIED 
      : OrderStatus.PRESCRIPTION_DENIED

    await this.orderRepository.save(order)
    await this.auditService.log(
      AuditAction.ORDER_CREATE,
      pharmacistId,
      'order',
      orderId
    )

    return order
  }

  async getPendingPrescriptions(): Promise<Order[]> {
    // Get all orders that require prescription verification
    return this.orderRepository.find({
      where: { 
        status: OrderStatus.AWAITING_PRESCRIPTION_VERIFICATION
      },
      order: { createdAt: 'DESC' }
    })
  }

  async getPrescriptionDetails(
    orderId: string, 
    requestingUserId: string, 
    requestingUserRole: string
  ): Promise<Order | null> {
    const order = await this.findOne(orderId)
    if (!order) return null

    // Staff can view any prescription
    if (requestingUserRole === 'admin' || 
        requestingUserRole === 'pharmacist' || 
        requestingUserRole === 'doctor') {
      return order
    }

    // Patients can only view their own prescriptions
    if (order.userId !== requestingUserId) {
      throw new BadRequestException('Unauthorized: You can only access your own prescriptions')
    }

    return order
  }

  async shipOrder(orderId: string): Promise<Order | null> {
    const order = await this.findOne(orderId)
    if (!order) return null
    
    order.status = OrderStatus.SHIPPED

    await this.orderRepository.save(order)
    await this.auditService.log(
      AuditAction.ORDER_CREATE,
      'admin',
      'order',
      orderId
    )

    return order
  }

  async deliverOrder(orderId: string): Promise<Order | null> {
    const order = await this.findOne(orderId)
    if (!order) return null

    order.status = OrderStatus.DELIVERED

    await this.orderRepository.save(order)
    await this.auditService.log(
      AuditAction.ORDER_CREATE,
      'admin',
      'order',
      orderId
    )

    return order
  }

  async deleteOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    const order = await this.findOne(orderId)
    if (!order) {
      return { success: false, message: 'Order not found' }
    }

    // Only allow deletion of shipped or delivered orders
    if (order.status !== OrderStatus.SHIPPED && order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Only shipped or delivered orders can be deleted')
    }

    await this.orderRepository.remove(order)
    await this.auditService.log(
      AuditAction.ORDER_CREATE,
      'admin',
      'order',
      orderId
    )

    return { success: true, message: 'Order deleted successfully' }
  }
}
