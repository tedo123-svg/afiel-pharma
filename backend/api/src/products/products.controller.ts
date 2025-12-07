import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id)
  }

  @Post()
  create(@Body() productData: any) {
    return this.productsService.create(productData)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() productData: any) {
    return this.productsService.update(id, productData)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id)
  }
}
