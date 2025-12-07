'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { apiUrl } from '@/lib/api'

interface Product {
  id: string
  name: string
  price: number
  requires_prescription: boolean
  generic_name: string
  brand_name: string
  image_url?: string
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(apiUrl('/products'))
      if (response.ok) {
        const data = await response.json()
        // Get first 3 products as featured
        setProducts(data.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8">Featured Medications</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative ${product.requires_prescription ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
            {/* Red notification badge for prescription items */}
            {product.requires_prescription && (
              <div className="absolute top-3 right-3 z-10">
                <div className="relative">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                </div>
              </div>
            )}
            
            <div className="w-full h-48 bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
            
            <div className="p-6">
              {product.requires_prescription && (
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 mb-2 font-medium">
                  <Lock className="w-4 h-4" />
                  <span>Prescription Required</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {product.brand_name || product.generic_name}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                <Link href="/products" className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
