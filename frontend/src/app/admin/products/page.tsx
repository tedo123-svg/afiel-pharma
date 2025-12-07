'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContainer'
import { apiUrl } from '@/lib/api'

export default function AdminProductsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    requiresPrescription: true,
    genericName: '',
    brandName: '',
    dosage: '',
    stockQuantity: '',
    imageUrl: '',
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      if (parsedUser.role !== 'admin') {
        router.push('/')
      }
    } else {
      router.push('/login')
    }
    fetchProducts()
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch(apiUrl('/products'))
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleEdit = (product: any) => {
    console.log('Edit button clicked for product:', product)
    setEditingProduct(product)
    const imageUrl = product.imageUrl || product.image_url || ''
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      requiresPrescription: product.requiresPrescription ?? product.requires_prescription,
      genericName: product.genericName || product.generic_name || '',
      brandName: product.brandName || product.brand_name || '',
      dosage: product.dosage || '',
      stockQuantity: (product.stockQuantity ?? product.stock_quantity ?? 0).toString(),
      imageUrl: imageUrl,
    })
    setImagePreview(imageUrl)
    setShowForm(true)
    console.log('Form should now be visible')
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Set max dimensions
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height
          
          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height)
          
          // Convert to base64 with compression (0.7 quality for JPEG)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
          resolve(compressedBase64)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error')
        return
      }

      try {
        showToast('Compressing image...', 'info')
        const compressedBase64 = await compressImage(file)
        setImagePreview(compressedBase64)
        setFormData({ ...formData, imageUrl: compressedBase64 })
        showToast('Image uploaded successfully!', 'success')
      } catch (error) {
        console.error('Error compressing image:', error)
        showToast('Failed to process image', 'error')
      }
    }
  }

  const handleRemoveImage = () => {
    setImagePreview('')
    setFormData({ ...formData, imageUrl: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct 
        ? apiUrl(`/products/${editingProduct.id}`)
        : apiUrl('/products')
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          requires_prescription: formData.requiresPrescription,
          generic_name: formData.genericName,
          brand_name: formData.brandName || null,
          dosage: formData.dosage,
          stock_quantity: parseInt(formData.stockQuantity) || 0,
          image_url: formData.imageUrl || null,
        }),
      })

      if (response.ok) {
        showToast(editingProduct ? 'Product updated successfully!' : 'Product added successfully!', 'success')
        setFormData({
          name: '',
          description: '',
          price: '',
          requiresPrescription: true,
          genericName: '',
          brandName: '',
          dosage: '',
          stockQuantity: '',
          imageUrl: '',
        })
        setImagePreview('')
        setEditingProduct(null)
        setShowForm(false)
        fetchProducts()
      } else {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        showToast(editingProduct ? `Failed to update product: ${errorText}` : `Failed to add product: ${errorText}`, 'error')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      showToast(`Error saving product: ${error}`, 'error')
    }
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      requiresPrescription: true,
      genericName: '',
      brandName: '',
      dosage: '',
      stockQuantity: '',
      imageUrl: '',
    })
    setImagePreview('')
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(apiUrl(`/products/${id}`), {
        method: 'DELETE',
      })

      if (response.ok) {
        showToast('Product deleted successfully!', 'success')
        fetchProducts()
      } else {
        showToast('Failed to delete product', 'error')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast('Error deleting product', 'error')
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="e.g., Lisinopril 10mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Generic Name</label>
              <input
                type="text"
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dosage</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="e.g., 10mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="29.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                rows={3}
                placeholder="Product description..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Product Image</label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
                      <Upload className="w-5 h-5" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">Max 5MB, JPG/PNG/GIF</span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.requiresPrescription}
                  onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Requires Prescription</span>
              </label>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rx Required
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  {(product.imageUrl || product.image_url) ? (
                    <img 
                      src={product.imageUrl || product.image_url} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.genericName || product.generic_name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">${product.price}</td>
                <td className="px-6 py-4 text-sm">{product.stockQuantity ?? product.stock_quantity}</td>
                <td className="px-6 py-4 text-sm">
                  {(product.requiresPrescription ?? product.requires_prescription) ? (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Yes</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">No</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="text-primary-600 hover:text-primary-700 mr-3"
                    title="Edit product"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="text-sm text-green-900 dark:text-green-100">
          <strong>✅ Admin Panel Active:</strong> You can now add, edit, and delete products directly from this page!
        </p>
      </div>
    </div>
  )
}
