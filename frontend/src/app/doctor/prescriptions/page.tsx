'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle, XCircle, Clock, Image as ImageIcon } from 'lucide-react'
import { apiUrl } from '@/lib/api'

export default function DoctorPrescriptionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrescriptionImage, setSelectedPrescriptionImage] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      if (parsedUser.role !== 'doctor' && parsedUser.role !== 'pharmacist') {
        router.push('/')
        return
      }
      fetchPendingPrescriptions(parsedUser)
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchPendingPrescriptions = async (userData: any) => {
    try {
      const response = await fetch(apiUrl('/orders/prescriptions/pending'), {
        headers: {
          'x-user-id': userData.id,
          'x-user-role': userData.role,
        },
      })

      if (response.ok) {
        const orders = await response.json()
        setPrescriptions(orders)
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (orderId: string, approved: boolean) => {
    if (!user) return

    try {
      const response = await fetch(apiUrl(`/orders/${orderId}/verify`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': user.role,
        },
        body: JSON.stringify({
          approved,
          pharmacistId: user.id,
          notes: approved ? 'Prescription verified and approved' : 'Prescription rejected',
        }),
      })

      if (response.ok) {
        alert(`Prescription ${approved ? 'approved' : 'rejected'}!`)
        // Refresh the list
        fetchPendingPrescriptions(user)
      } else {
        alert('Failed to verify prescription')
      }
    } catch (error) {
      console.error('Error verifying prescription:', error)
      alert('Error verifying prescription')
    }
  }

  const viewPrescriptionImage = (item: any) => {
    if (item.prescriptionImage) {
      setSelectedPrescriptionImage(item.prescriptionImage)
    }
  }

  if (!user || (user.role !== 'doctor' && user.role !== 'pharmacist')) {
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
        <h1 className="text-3xl font-bold mb-2">Prescription Verification</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and verify patient prescriptions
        </p>
      </div>

      <div className="grid gap-6">
        {prescriptions.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-primary-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Order #{order.id.substring(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Patient ID: {order.userId}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ordered: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-primary-600 mt-1">
                    Total: ${parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-600">
                  Pending Review
                </span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold mb-3">Prescription Items:</h4>
              <div className="space-y-3">
                {order.items
                  .filter((item: any) => item.requiresPrescription)
                  .map((item: any, index: number) => (
                    <div key={index} className="flex items-start justify-between border-b border-gray-200 dark:border-gray-600 pb-3 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.quantity} | Price: ${item.price}
                        </p>
                      </div>
                      {item.prescriptionImage && (
                        <button
                          onClick={() => viewPrescriptionImage(item)}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                        >
                          <ImageIcon className="w-4 h-4" />
                          View Rx
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleVerify(order.id, true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Order
              </button>
              <button
                onClick={() => handleVerify(order.id, false)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                <XCircle className="w-5 h-5" />
                Reject Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {prescriptions.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">No Pending Prescriptions</p>
          <p className="text-gray-600 dark:text-gray-400">
            All prescriptions have been reviewed
          </p>
        </div>
      )}

      {/* Prescription Image Modal */}
      {selectedPrescriptionImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPrescriptionImage(null)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Prescription Image</h3>
              <button
                onClick={() => setSelectedPrescriptionImage(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto">
              <img 
                src={selectedPrescriptionImage} 
                alt="Prescription" 
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
