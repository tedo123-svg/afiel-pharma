'use client'

import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

const mockPrescriptions = [
  {
    id: 'rx_001',
    medication: 'Lisinopril 10mg',
    status: 'verified',
    uploadedAt: '2024-01-15',
    verifiedAt: '2024-01-15',
  },
  {
    id: 'rx_002',
    medication: 'Metformin 500mg',
    status: 'pending',
    uploadedAt: '2024-01-20',
  },
]

export function PrescriptionList() {
  return (
    <div className="space-y-4">
      {mockPrescriptions.map((rx) => (
        <div
          key={rx.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-start gap-4"
        >
          <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{rx.medication}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Uploaded: {new Date(rx.uploadedAt).toLocaleDateString()}
            </p>
            
            <div className="flex items-center gap-2">
              {rx.status === 'verified' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Verified</span>
                </>
              )}
              {rx.status === 'pending' && (
                <>
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-600 font-medium">Pending Review</span>
                </>
              )}
              {rx.status === 'rejected' && (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Rejected</span>
                </>
              )}
            </div>
          </div>

          <button className="btn btn-secondary">View Details</button>
        </div>
      ))}
    </div>
  )
}
