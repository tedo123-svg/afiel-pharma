import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find()
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } })
  }

  async create(productData: any): Promise<Product> {
    // Transform snake_case to camelCase for TypeORM
    const transformedData: any = {}
    
    if (productData.name !== undefined) transformedData.name = productData.name
    if (productData.description !== undefined) transformedData.description = productData.description
    if (productData.price !== undefined) transformedData.price = productData.price
    if (productData.requires_prescription !== undefined) transformedData.requiresPrescription = productData.requires_prescription
    if (productData.generic_name !== undefined) transformedData.genericName = productData.generic_name
    if (productData.brand_name !== undefined) transformedData.brandName = productData.brand_name
    if (productData.dosage !== undefined) transformedData.dosage = productData.dosage
    if (productData.stock_quantity !== undefined) transformedData.stockQuantity = productData.stock_quantity
    if (productData.image_url !== undefined) transformedData.imageUrl = productData.image_url
    
    const product = this.productRepository.create(transformedData)
    const result = await this.productRepository.save(product)
    return Array.isArray(result) ? result[0] : result
  }

  async update(id: string, productData: any): Promise<Product | null> {
    // Transform snake_case to camelCase for TypeORM
    const transformedData: any = {}
    
    if (productData.name !== undefined) transformedData.name = productData.name
    if (productData.description !== undefined) transformedData.description = productData.description
    if (productData.price !== undefined) transformedData.price = productData.price
    if (productData.requires_prescription !== undefined) transformedData.requiresPrescription = productData.requires_prescription
    if (productData.generic_name !== undefined) transformedData.genericName = productData.generic_name
    if (productData.brand_name !== undefined) transformedData.brandName = productData.brand_name
    if (productData.dosage !== undefined) transformedData.dosage = productData.dosage
    if (productData.stock_quantity !== undefined) transformedData.stockQuantity = productData.stock_quantity
    if (productData.image_url !== undefined) transformedData.imageUrl = productData.image_url
    
    await this.productRepository.update(id, transformedData)
    return this.findOne(id)
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.update(id, { isActive: false })
  }
}
