'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { apiUrl } from '@/lib/api'

export default function OrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchOrders(parsedUser.id)
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchOrders = async (userId: string) => {
    try {
      const userData = localStorage.getItem('user')
      const user = userData ? JSON.parse(userData) : null
      
      const response = await fetch(apiUrl(`/orders/user/${userId}`), {
        headers: {
          'x-user-id': user?.id || '',
          'x-user-role': user?.role || 'patient',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else if (response.status === 403 || response.status === 401) {
        alert('Unauthorized: You can only access your own orders')
        router.push('/account')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'awaiting_prescription_verification':
        return <Clock className="w-5 h-5 text-orange-600" />
      case 'prescription_verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'prescription_denied':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'awaiting_prescription_verification':
        return 'Awaiting Pharmacist Verification'
      case 'prescription_verified':
        return 'Prescription Verified - Processing'
      case 'prescription_denied':
        return 'Prescription Denied'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      default:
        return 'Pending'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awaiting_prescription_verification':
        return 'bg-orange-100 text-orange-800'
      case 'prescription_verified':
        return 'bg-green-100 text-green-800'
      case 'prescription_denied':
        return 'bg-red-100 text-red-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start shopping to see your orders here
          </p>
          <button
            onClick={() => router.push('/products')}
            className="btn btn-primary"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Placed: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </span>
              </div>

              {order.status === 'awaiting_prescription_verification' && (
                <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-orange-900 dark:text-orange-100">
                    <strong>⏳ Waiting for Pharmacist Review</strong>
                  </p>
                  <p className="text-sm text-orange-900 dark:text-orange-100 mt-1">
                    Your order contains prescription medications. A licensed pharmacist will review and verify your prescription shortly.
                  </p>
                </div>
              )}

              {order.status === 'prescription_denied' && order.pharmacistNotes && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-900 dark:text-red-100">
                    <strong>❌ Prescription Denied</strong>
                  </p>
                  <p className="text-sm text-red-900 dark:text-red-100 mt-1">
                    <strong>Pharmacist Notes:</strong> {order.pharmacistNotes}
                  </p>
                </div>
              )}

              {order.status === 'prescription_verified' && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    <strong>✅ Prescription Verified</strong>
                  </p>
                  <p className="text-sm text-green-900 dark:text-green-100 mt-1">
                    Your prescription has been verified by our pharmacist. Your order is now being processed.
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-semibold mb-3">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.quantity}
                          {item.requiresPrescription && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-orange-100 text-orange-800 rounded">
                              Rx Required
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary-600">
                  ${order.totalAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
