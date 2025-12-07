'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Eye, Trash2, Calendar, Package, X } from 'lucide-react'

export default function PrescriptionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ orderId: string; itemIndex: number } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      if (parsedUser.role !== 'patient') {
        router.push('/')
        return
      }
      
      fetchPrescriptions(parsedUser)
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchPrescriptions = async (userData: any) => {
    try {
      const response = await fetch(`http://localhost:3001/orders/user/${userData.id}`, {
        headers: {
          'x-user-id': userData.id,
          'x-user-role': userData.role,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Filter orders that have prescription items
        const ordersWithPrescriptions = data.filter((order: any) =>
          order.items.some((item: any) => item.requiresPrescription && item.prescriptionImage)
        )
        setOrders(ordersWithPrescriptions)
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePrescription = (orderId: string, itemIndex: number) => {
    setDeleteConfirm({ orderId, itemIndex })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return

    // In a real implementation, this would call an API to delete the prescription
    // For now, we'll just remove it from the local state
    const updatedOrders = orders.map(order => {
      if (order.id === deleteConfirm.orderId) {
        const updatedItems = [...order.items]
        updatedItems[deleteConfirm.itemIndex] = {
          ...updatedItems[deleteConfirm.itemIndex],
          prescriptionImage: null
        }
        return { ...order, items: updatedItems }
      }
      return order
    })

    setOrders(updatedOrders.filter(order => 
      order.items.some((item: any) => item.requiresPrescription && item.prescriptionImage)
    ))
    
    setDeleteConfirm(null)
    alert('Prescription deleted successfully')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      'awaiting_prescription_verification': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      'prescription_verified': { color: 'bg-green-100 text-green-800', text: 'Verified' },
      'prescription_denied': { color: 'bg-red-100 text-red-800', text: 'Denied' },
      'processing': { color: 'bg-blue-100 text-blue-800', text: 'Processing' },
      'shipped': { color: 'bg-purple-100 text-purple-800', text: 'Shipped' },
      'delivered': { color: 'bg-green-100 text-green-800', text: 'Delivered' },
    }

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  if (!user || user.role !== 'patient') {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading prescriptions...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Prescriptions</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage your uploaded prescription images
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Prescriptions Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't uploaded any prescriptions yet
          </p>
          <button
            onClick={() => router.push('/products')}
            className="btn btn-primary"
          >
            Browse Medications
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Order #{order.id.substring(0, 8)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.items.filter((i: any) => i.requiresPrescription).length} prescription item(s)
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="space-y-4">
                  {order.items
                    .filter((item: any) => item.requiresPrescription && item.prescriptionImage)
                    .map((item: any, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity} | Price: ${item.price}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Prescription Image</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedImage(item.prescriptionImage)}
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              {order.status === 'awaiting_prescription_verification' && (
                                <button
                                  onClick={() => handleDeletePrescription(order.id, order.items.indexOf(item))}
                                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="relative h-48 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                            <img
                              src={item.prescriptionImage}
                              alt="Prescription"
                              className="w-full h-full object-contain cursor-pointer hover:opacity-90"
                              onClick={() => setSelectedImage(item.prescriptionImage)}
                            />
                          </div>
                          {order.status !== 'awaiting_prescription_verification' && (
                            <p className="text-xs text-gray-500 mt-2">
                              Cannot delete - prescription already {order.status === 'prescription_verified' ? 'verified' : 'processed'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Prescription Image</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage}
                alt="Prescription"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Delete Prescription?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this prescription image? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
