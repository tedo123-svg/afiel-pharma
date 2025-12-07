import { DataSource } from 'typeorm'
import { Product } from '../../products/entities/product.entity'

export async function seedProducts(dataSource: DataSource) {
  const productRepository = dataSource.getRepository(Product)

  const products = [
    {
      name: 'Lisinopril 10mg',
      description: 'ACE inhibitor for high blood pressure and heart failure',
      price: 29.99,
      requiresPrescription: true,
      genericName: 'Lisinopril',
      brandName: 'Prinivil, Zestril',
      dosage: '10mg',
      stockQuantity: 500,
    },
    {
      name: 'Metformin 500mg',
      description: 'Oral diabetes medication that helps control blood sugar',
      price: 19.99,
      requiresPrescription: true,
      genericName: 'Metformin',
      brandName: 'Glucophage',
      dosage: '500mg',
      stockQuantity: 750,
    },
    {
      name: 'Atorvastatin 20mg',
      description: 'Statin medication to lower cholesterol',
      price: 34.99,
      requiresPrescription: true,
      genericName: 'Atorvastatin',
      brandName: 'Lipitor',
      dosage: '20mg',
      stockQuantity: 600,
    },
    {
      name: 'Omeprazole 20mg',
      description: 'Proton pump inhibitor for acid reflux and heartburn',
      price: 24.99,
      requiresPrescription: true,
      genericName: 'Omeprazole',
      brandName: 'Prilosec',
      dosage: '20mg',
      stockQuantity: 800,
    },
    {
      name: 'Levothyroxine 50mcg',
      description: 'Thyroid hormone replacement medication',
      price: 22.99,
      requiresPrescription: true,
      genericName: 'Levothyroxine',
      brandName: 'Synthroid',
      dosage: '50mcg',
      stockQuantity: 450,
    },
    {
      name: 'Ibuprofen 200mg',
      description: 'Over-the-counter pain reliever and anti-inflammatory',
      price: 9.99,
      requiresPrescription: false,
      genericName: 'Ibuprofen',
      brandName: 'Advil, Motrin',
      dosage: '200mg',
      stockQuantity: 1000,
    },
    {
      name: 'Acetaminophen 500mg',
      description: 'Over-the-counter pain reliever and fever reducer',
      price: 8.99,
      requiresPrescription: false,
      genericName: 'Acetaminophen',
      brandName: 'Tylenol',
      dosage: '500mg',
      stockQuantity: 1200,
    },
    {
      name: 'Vitamin D3 1000 IU',
      description: 'Dietary supplement for bone health',
      price: 12.99,
      requiresPrescription: false,
      genericName: 'Cholecalciferol',
      brandName: undefined,
      dosage: '1000 IU',
      stockQuantity: 900,
    },
  ]

  for (const productData of products) {
    const existing = await productRepository.findOne({
      where: { name: productData.name },
    })

    if (!existing) {
      const product = productRepository.create(productData)
      await productRepository.save(product)
      console.log(`✅ Created product: ${productData.name}`)
    }
  }
}
