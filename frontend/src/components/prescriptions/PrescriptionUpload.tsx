'use client'

import { useState } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'

export function PrescriptionUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('prescription', file)

    try {
      const response = await fetch(`${process.env.PRESCRIPTION_SERVICE_URL}/api/prescriptions/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      
      if (response.ok) {
        alert('Prescription uploaded successfully! A pharmacist will review it shortly.')
        setFile(null)
      }
    } catch (error) {
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Prescription</h2>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-1">Prescription Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Clear photo or scan of valid prescription</li>
              <li>Prescriber name and DEA number visible</li>
              <li>Patient name must match your account</li>
              <li>Prescription must not be expired</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="prescription-upload"
          />
          <label htmlFor="prescription-upload" className="cursor-pointer">
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-primary-600" />
                <span className="text-lg">{file.name}</span>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg mb-2">Click to upload prescription</p>
                <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB</p>
              </div>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload Prescription'}
        </button>
      </form>
    </div>
  )
}
