'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { Lock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function CartSummary() {
  const { t } = useLanguage()
  const { getTotalPrice, items } = useCartStore()
  const subtotal = getTotalPrice()
  const shipping = 4.99
  const total = subtotal + shipping

  const prescriptionItemsWithoutUpload = items.filter(
    item => item.requiresPrescription && !item.prescriptionImage
  )
  const hasMissingPrescriptions = prescriptionItemsWithoutUpload.length > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
      <h3 className="text-xl font-semibold mb-4">{t.checkout.orderSummary}</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span>{t.cart.subtotal}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.cart.shipping}</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
          <span>{t.cart.total}</span>
          <span className="text-primary-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {hasMissingPrescriptions && (
        <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="flex items-start gap-2 text-sm text-orange-900 dark:text-orange-100">
            <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">{t.home.prescriptionRequired}</p>
              <p className="text-xs">
                {prescriptionItemsWithoutUpload.length} item(s) need prescription upload
              </p>
            </div>
          </div>
        </div>
      )}

      <Link 
        href="/checkout" 
        className={`btn w-full mb-4 text-center block ${
          hasMissingPrescriptions 
            ? 'btn-secondary opacity-50 cursor-not-allowed pointer-events-none' 
            : 'btn-primary'
        }`}
      >
        {hasMissingPrescriptions ? 'Upload Prescriptions First' : t.cart.checkout}
      </Link>

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p>✓ Secure checkout</p>
        <p>✓ {t.footer.hipaaCompliant}</p>
        <p>✓ Free shipping on orders over $50</p>
      </div>
    </div>
  )
}
