import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'AfiEl Pharma API is running',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      message: 'Healthy',
    }
  }
}
