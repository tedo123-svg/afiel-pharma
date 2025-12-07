'use client'

import { useEffect, useState } from 'react'
import { Lock, ShoppingCart, Upload, X, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { FilterState } from './ProductFilters'
import { apiUrl } from '@/lib/api'
import { useLanguage } from '@/contexts/LanguageContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  requiresPrescription: boolean
  genericName: string
  brandName: string
  dosage: string
  stockQuantity: number
  imageUrl?: string
}

interface ProductGridProps {
  filters?: FilterState
}

export function ProductGrid({ filters }: ProductGridProps) {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const { addItem, updatePrescription } = useCartStore()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const fetchProducts = async () => {
    try {
      const response = await fetch(apiUrl('/products'))
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    if (filters) {
      // Filter by prescription type
      if (filters.prescriptionType === 'prescription') {
        filtered = filtered.filter(p => p.requiresPrescription)
      } else if (filters.prescriptionType === 'otc') {
        filtered = filtered.filter(p => !p.requiresPrescription)
      }

      // Filter by type (brand/generic)
      if (filters.type.length > 0) {
        filtered = filtered.filter(p => {
          if (filters.type.includes('brand') && p.brandName) return true
          if (filters.type.includes('generic') && p.genericName && !p.brandName) return true
          return false
        })
      }

      // Filter by condition (search in description)
      if (filters.conditions.length > 0) {
        filtered = filtered.filter(p => {
          const searchText = `${p.name} ${p.description} ${p.genericName} ${p.brandName}`.toLowerCase()
          return filters.conditions.some(condition => 
            searchText.includes(condition.toLowerCase())
          )
        })
      }
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product: Product) => {
    if (product.requiresPrescription) {
      // Show prescription upload modal for prescription items
      setSelectedProduct(product)
      setShowPrescriptionModal(true)
    } else {
      // Add non-prescription items directly
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        requiresPrescription: product.requiresPrescription,
      })
    }
  }

  const handlePrescriptionUpload = async () => {
    if (!prescriptionFile || !selectedProduct) return

    // Convert file to base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(prescriptionFile)
    })

    // Add item to cart with prescription
    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      requiresPrescription: selectedProduct.requiresPrescription,
      prescriptionImage: base64,
    })

    // Close modal and reset
    setShowPrescriptionModal(false)
    setSelectedProduct(null)
    setPrescriptionFile(null)
  }

  const handleCloseModal = () => {
    setShowPrescriptionModal(false)
    setSelectedProduct(null)
    setPrescriptionFile(null)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">{t.common.loading}</p>
      </div>
    )
  }

  const displayProducts = filteredProducts.length > 0 || filters ? filteredProducts : products

  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          {filters && (filters.conditions.length > 0 || filters.type.length > 0 || filters.prescriptionType !== 'all')
            ? 'No products match your filters'
            : 'No products available'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <div key={product.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative ${product.requiresPrescription ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
            {/* Red notification badge for prescription items */}
            {product.requiresPrescription && (
              <div className="absolute top-3 right-3 z-10">
                <div className="relative">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                </div>
              </div>
            )}
            
            <div className="w-full h-48 bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {product.dosage}
                </span>
              )}
            </div>
            <div className="p-6">
              {product.requiresPrescription && (
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 mb-2 font-medium">
                  <Lock className="w-4 h-4" />
                  <span>{t.home.prescriptionRequired}</span>
                </div>
              )}
            
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {product.brandName || product.genericName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 line-clamp-2">
              {product.description}
            </p>
            
              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                  <p className="text-xs text-gray-500">{t.products.inStock}: {product.stockQuantity}</p>
                </div>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t.products.addToCart}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Upload Modal */}
      {showPrescriptionModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{t.products.uploadPrescription}</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-orange-900 dark:text-orange-100 mb-2">
                <strong>📋 {t.home.prescriptionRequired}</strong>
              </p>
              <p className="text-sm text-orange-900 dark:text-orange-100">
                This medication requires a valid prescription. Please upload your prescription to add this item to your cart.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">{selectedProduct.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedProduct.brandName || selectedProduct.genericName}
              </p>
              <p className="text-lg font-bold text-primary-600 mt-2">
                ${selectedProduct.price}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                {t.products.prescriptionImage} *
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
              {prescriptionFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{prescriptionFile.name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="btn btn-secondary flex-1"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handlePrescriptionUpload}
                disabled={!prescriptionFile}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {t.products.addToCart}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
