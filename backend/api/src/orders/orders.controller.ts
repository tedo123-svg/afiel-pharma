import { Controller, Get, Post, Body, Req, Param, UseGuards, ForbiddenException } from '@nestjs/common'
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Body() orderData: any, @Req() req: any) {
    // Get user ID from headers (sent by frontend)
    const userId = req.headers['x-user-id'] || 'anonymous'
    return this.ordersService.create(userId, orderData)
  }

  @Get()
  findAll() {
    return this.ordersService.findAll()
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @Req() req: any) {
    // Authorization: Ensure user can only access their own orders
    // Staff (admin, pharmacist, doctor) can view all orders
    const requestingUserId = req.headers['x-user-id'] // From frontend
    const requestingUserRole = req.headers['x-user-role'] // From frontend
    
    // Allow staff to view any orders
    if (requestingUserRole === 'admin' || requestingUserRole === 'pharmacist' || requestingUserRole === 'doctor') {
      return this.ordersService.findByUser(userId)
    }
    
    // Patients can only view their own orders
    if (requestingUserId !== userId) {
      throw new ForbiddenException('Unauthorized: You can only access your own orders')
    }
    
    return this.ordersService.findByUser(userId)
  }

  @Post(':id/verify')
  verifyPrescription(
    @Param('id') id: string,
    @Body() verificationData: { approved: boolean; pharmacistId: string; notes?: string }
  ) {
    return this.ordersService.verifyPrescription(
      id,
      verificationData.pharmacistId,
      verificationData.approved,
      verificationData.notes
    )
  }

  @Get('prescriptions/pending')
  getPendingPrescriptions(@Req() req: any) {
    // Only doctors and pharmacists can access this endpoint
    const requestingUserRole = req.headers['x-user-role']
    
    if (requestingUserRole !== 'doctor' && requestingUserRole !== 'pharmacist') {
      throw new ForbiddenException('Unauthorized: Only doctors and pharmacists can view prescriptions')
    }
    
    return this.ordersService.getPendingPrescriptions()
  }

  @Get(':id/prescription')
  getPrescriptionDetails(@Param('id') id: string, @Req() req: any) {
    // Authorization: Only the patient who owns the order, or staff can view prescription details
    const requestingUserId = req.headers['x-user-id']
    const requestingUserRole = req.headers['x-user-role']
    
    return this.ordersService.getPrescriptionDetails(id, requestingUserId, requestingUserRole)
  }

  @Post(':id/ship')
  shipOrder(@Param('id') id: string, @Req() req: any) {
    // Only admins can ship orders
    const requestingUserRole = req.headers['x-user-role']
    
    if (requestingUserRole !== 'admin') {
      throw new ForbiddenException('Unauthorized: Only admins can ship orders')
    }
    
    return this.ordersService.shipOrder(id)
  }

  @Post(':id/deliver')
  deliverOrder(@Param('id') id: string, @Req() req: any) {
    // Only admins can mark orders as delivered
    const requestingUserRole = req.headers['x-user-role']
    
    if (requestingUserRole !== 'admin') {
      throw new ForbiddenException('Unauthorized: Only admins can mark orders as delivered')
    }
    
    return this.ordersService.deliverOrder(id)
  }

  @Post(':id/delete')
  deleteOrder(@Param('id') id: string, @Req() req: any) {
    // Only admins can delete orders
    const requestingUserRole = req.headers['x-user-role']
    
    if (requestingUserRole !== 'admin') {
      throw new ForbiddenException('Unauthorized: Only admins can delete orders')
    }
    
    return this.ordersService.deleteOrder(id)
  }
}
