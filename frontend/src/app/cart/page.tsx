'use client'

import { CartItems } from '@/components/cart/CartItems'
import { CartSummary } from '@/components/cart/CartSummary'
import { PharmacistChat } from '@/components/cart/PharmacistChat'
import { useCartStore } from '@/store/cartStore'
import { AlertCircle, FileText, Upload } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CartPage() {
  const { items, clearCart } = useCartStore()
  const { t } = useLanguage()

  const prescriptionItems = items.filter(item => item.requiresPrescription)
  const prescriptionItemsWithoutUpload = prescriptionItems.filter(
    item => !item.prescriptionImage
  )
  const hasPrescriptionItems = prescriptionItems.length > 0
  const hasMissingPrescriptions = prescriptionItemsWithoutUpload.length > 0

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t.cart.title}</h1>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            {t.cart.remove}
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">{t.cart.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Prescription Upload Alert */}
            {hasPrescriptionItems && (
              <div className={`rounded-lg shadow-md p-6 ${
                hasMissingPrescriptions 
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700' 
                  : 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700'
              }`}>
                <div className="flex items-start gap-4">
                  {hasMissingPrescriptions ? (
                    <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0" />
                  ) : (
                    <FileText className="w-8 h-8 text-green-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      hasMissingPrescriptions 
                        ? 'text-orange-900 dark:text-orange-100' 
                        : 'text-green-900 dark:text-green-100'
                    }`}>
                      {hasMissingPrescriptions 
                        ? '⚠️ Prescription Upload Required' 
                        : '✓ All Prescriptions Uploaded'}
                    </h3>
                    
                    {hasMissingPrescriptions ? (
                      <>
                        <p className="text-sm text-orange-900 dark:text-orange-100 mb-3">
                          You have {prescriptionItemsWithoutUpload.length} prescription medication(s) in your cart that require prescription upload before checkout.
                        </p>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Items Missing Prescription:
                          </p>
                          <ul className="space-y-2">
                            {prescriptionItemsWithoutUpload.map((item) => (
                              <li key={item.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Upload className="w-4 h-4 text-orange-600" />
                                <span className="font-medium">{item.name}</span>
                                <span className="text-xs text-gray-500">- Qty: {item.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-orange-100 dark:bg-orange-900/40 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-2">
                            📋 How to Upload Prescription:
                          </p>
                          <ol className="text-sm text-orange-900 dark:text-orange-100 space-y-1 list-decimal list-inside">
                            <li>Remove the prescription item from your cart</li>
                            <li>Go back to the product page</li>
                            <li>Click "Add to Cart" again</li>
                            <li>Upload your prescription when prompted</li>
                          </ol>
                        </div>

                        <p className="text-xs text-orange-800 dark:text-orange-200 italic">
                          Note: Checkout will be blocked until all prescription medications have valid prescriptions uploaded.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-green-900 dark:text-green-100 mb-3">
                          All {prescriptionItems.length} prescription medication(s) in your cart have prescriptions uploaded.
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            ✓ Prescriptions Uploaded For:
                          </p>
                          <ul className="space-y-2">
                            {prescriptionItems.map((item) => (
                              <li key={item.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <FileText className="w-4 h-4 text-green-600" />
                                <span className="font-medium">{item.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-xs text-green-800 dark:text-green-200 mt-3 italic">
                          A licensed pharmacist will review your prescriptions after you place your order.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <CartItems />
            <PharmacistChat />
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  )
}
