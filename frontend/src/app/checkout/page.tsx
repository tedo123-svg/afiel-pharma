'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Lock, CheckCircle, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { apiUrl } from '@/lib/api'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('telebirr')
  const [formData, setFormData] = useState({
    // Shipping
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Payment
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    telebirrPhone: '',
  })

  const subtotal = getTotalPrice()
  const shipping = 4.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const hasPrescriptionItems = items.some(item => item.requiresPrescription)
  const prescriptionItemsWithoutUpload = items.filter(
    item => item.requiresPrescription && !item.prescriptionImage
  )
  const allPrescriptionsUploaded = prescriptionItemsWithoutUpload.length === 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      // Create order
      try {
        const userData = localStorage.getItem('user')
        const user = userData ? JSON.parse(userData) : null
        
        const orderData = {
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            requiresPrescription: item.requiresPrescription,
            prescriptionImage: item.prescriptionImage || null,
          })),
          totalAmount: total,
          shippingAddress: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
        }

        const response = await fetch(apiUrl('/orders'), {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': user?.id || 'anonymous',
            'x-user-role': user?.role || 'patient',
          },
          body: JSON.stringify(orderData),
        })

        if (response.ok) {
          setStep(4)
          clearCart()
        } else {
          alert('Failed to create order')
        }
      } catch (error) {
        console.error('Error creating order:', error)
        alert('Error creating order')
      }
    }
  }

  if (items.length === 0 && step < 4) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => router.push('/products')}
          className="btn btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  // Block checkout if prescription items don't have prescriptions uploaded
  if (!allPrescriptionsUploaded && step < 4) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Prescription Required</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Some items in your cart require prescription upload before checkout
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">
              Items Missing Prescription:
            </h3>
            <ul className="space-y-2">
              {prescriptionItemsWithoutUpload.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                  <Lock className="w-4 h-4" />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please go back to your cart and upload prescriptions for the items listed above. 
              You can upload prescriptions by removing and re-adding the items to your cart.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/cart')}
                className="btn btn-primary flex-1"
              >
                Go to Cart
              </button>
              <button
                onClick={() => router.push('/products')}
                className="btn btn-secondary flex-1"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          
          {hasPrescriptionItems ? (
            <>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Your order has been submitted successfully!
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 mb-6">
                <p className="text-sm text-orange-900 dark:text-orange-100 mb-3">
                  <strong>⏳ Pending Pharmacist Verification</strong>
                </p>
                <p className="text-sm text-orange-900 dark:text-orange-100 mb-3">
                  Your order includes prescription medications. A licensed pharmacist will review your uploaded prescriptions shortly.
                </p>
                <p className="text-sm text-orange-900 dark:text-orange-100 mb-3">
                  <strong>What happens next?</strong>
                </p>
                <ul className="text-sm text-orange-900 dark:text-orange-100 mb-3 list-disc list-inside space-y-1">
                  <li>Pharmacist reviews your prescription(s)</li>
                  <li>You'll be notified of approval/denial</li>
                  <li>Once approved, your order will be processed</li>
                  <li>Track your order status in "My Orders"</li>
                </ul>
                <p className="text-sm text-orange-900 dark:text-orange-100 mb-2">
                  <strong>Order Total:</strong> ${total.toFixed(2)}
                </p>
                <p className="text-sm text-orange-900 dark:text-orange-100">
                  <strong>Confirmation sent to:</strong> {formData.email}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Thank you for your order. Your medications will be delivered within 3-5 business days.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-6">
                <p className="text-sm text-green-900 dark:text-green-100 mb-2">
                  <strong>Order Total:</strong> ${total.toFixed(2)}
                </p>
                <p className="text-sm text-green-900 dark:text-green-100">
                  <strong>Confirmation sent to:</strong> {formData.email}
                </p>
              </div>
            </>
          )}
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/account')}
              className="btn btn-primary"
            >
              View Order History
            </button>
            <button
              onClick={() => router.push('/products')}
              className="btn btn-secondary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
            1
          </div>
          <div className={`w-24 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
            2
          </div>
          <div className={`w-24 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
            3
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Truck className="w-6 h-6" />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-6">
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Method
                </h2>
                
                <div className="space-y-4 mb-6">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-600">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="telebirr"
                      checked={paymentMethod === 'telebirr'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-lg">📱 Telebirr</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-600">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Pay */}
            {step === 3 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6" />
                  Payment Details
                </h2>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        required={paymentMethod === 'card'}
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        required={paymentMethod === 'card'}
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          required={paymentMethod === 'card'}
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          required={paymentMethod === 'card'}
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'telebirr' && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                      <p className="text-sm text-green-900 dark:text-green-100 mb-2">
                        📱 Pay with Telebirr - Ethiopia's Mobile Money
                      </p>
                      <p className="text-xs text-green-800 dark:text-green-200">
                        Enter your Telebirr phone number. You'll receive a payment prompt on your phone to complete the transaction.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Telebirr Phone Number *</label>
                      <input
                        type="tel"
                        name="telebirrPhone"
                        required={paymentMethod === 'telebirr'}
                        placeholder="+251 9XX XXX XXX"
                        value={formData.telebirrPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Make sure this number is registered with Telebirr
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                      <p className="font-semibold mb-1">Secure Payment</p>
                      <p>Your payment information is encrypted and secure. We never store your card details.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Place Order - ${total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
