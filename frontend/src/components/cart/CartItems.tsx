'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { Trash2, Lock, Upload, CheckCircle } from 'lucide-react'

export function CartItems() {
  const { items, updateQuantity, removeItem, updatePrescription } = useCartStore()
  const [uploadingIds, setUploadingIds] = useState<Record<string, boolean>>({})

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })

  const handleFileChange = async (id: string, file?: File) => {
    if (!file) return
    try {
      setUploadingIds((s) => ({ ...s, [id]: true }))
      const base64 = await fileToBase64(file)
      updatePrescription(id, base64)
    } catch (err) {
      console.error('Failed to upload prescription for', id, err)
      alert('Failed to upload prescription')
    } finally {
      setUploadingIds((s) => ({ ...s, [id]: false }))
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              
              {item.requiresPrescription && (
                <div className="mb-2">
                  {item.prescriptionImage ? (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>✓ Prescription Uploaded</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-orange-900 dark:text-orange-100 mb-2">
                        <Lock className="w-4 h-4" />
                        <span className="font-semibold">⚠️ Prescription Required</span>
                      </div>

                      <label className="block text-sm mb-2">
                        <span className="sr-only">Upload prescription</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(item.id, e.target.files?.[0])}
                          className="w-full"
                        />
                      </label>

                      <p className="text-xs text-orange-800 dark:text-orange-200">
                        Upload your prescription here to attach it to this item.
                      </p>

                      {uploadingIds[item.id] && (
                        <p className="text-xs text-gray-500 mt-2">Uploading...</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
