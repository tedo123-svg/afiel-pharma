'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react'

export default function PharmacistOrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      if (parsedUser.role !== 'pharmacist') {
        router.push('/')
        return
      }
      fetchOrders(parsedUser)
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchOrders = async (userData: any) => {
    try {
      const response = await fetch('http://localhost:3001/orders/prescriptions/pending', {
        headers: {
          'x-user-id': userData.id,
          'x-user-role': userData.role,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error('Failed to fetch orders:', response.status)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleVerify = async (orderId: string, approved: boolean) => {
    if (!user) return
    
    try {
      const response = await fetch(`http://localhost:3001/orders/${orderId}/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': user.role,
        },
        body: JSON.stringify({
          approved,
          pharmacistId: user.id,
          notes,
        }),
      })

      if (response.ok) {
        alert(approved ? 'Prescription verified!' : 'Prescription denied')
        setSelectedOrder(null)
        setNotes('')
        fetchOrders(user)
      } else {
        alert('Failed to process verification')
      }
    } catch (error) {
      console.error('Error verifying prescription:', error)
      alert('Error processing verification')
    }
  }

  if (!user || user.role !== 'pharmacist') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Prescription Verification</h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No pending verifications</h2>
          <p className="text-gray-600 dark:text-gray-400">
            All prescription orders have been reviewed
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Placed: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Awaiting Verification
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <h4 className="font-semibold mb-3">Prescription Items:</h4>
                <div className="space-y-4">
                  {order.items
                    .filter((item: any) => item.requiresPrescription)
                    .map((item: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">${item.price}</p>
                        </div>
                        {item.prescriptionImage && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Prescription Image:</p>
                            <img 
                              src={item.prescriptionImage} 
                              alt="Prescription" 
                              className="max-w-full h-auto rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-90"
                              onClick={() => window.open(item.prescriptionImage, '_blank')}
                            />
                            <p className="text-xs text-gray-500 mt-1">Click to view full size</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-semibold mb-2">Patient Information:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  User ID: {order.userId}
                </p>
              </div>

              {selectedOrder?.id === order.id ? (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Pharmacist Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4"
                    rows={3}
                    placeholder="Add any notes about this verification..."
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify(order.id, true)}
                      className="btn btn-primary flex items-center gap-2 flex-1"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Prescription
                    </button>
                    <button
                      onClick={() => handleVerify(order.id, false)}
                      className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 flex-1"
                    >
                      <XCircle className="w-5 h-5" />
                      Deny Prescription
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(null)
                        setNotes('')
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="btn btn-primary w-full mt-4"
                >
                  Review Prescription
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
