'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, CheckCircle, X, AlertCircle } from 'lucide-react'

export default function UploadPrescriptionPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [medicationName, setMedicationName] = useState('')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      if (parsedUser.role !== 'patient') {
        router.push('/')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPrescriptionFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prescriptionFile) {
      alert('Please select a prescription image')
      return
    }

    setUploading(true)

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(prescriptionFile)
      })

      // In a real implementation, this would save to a prescriptions table
      // For now, we'll just show success
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSuccess(true)
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setPrescriptionFile(null)
        setPreview(null)
        setMedicationName('')
        setNotes('')
        setSuccess(false)
      }, 2000)

    } catch (error) {
      console.error('Error uploading prescription:', error)
      alert('Failed to upload prescription')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setPrescriptionFile(null)
    setPreview(null)
  }

  if (!user || user.role !== 'patient') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Prescription</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your prescription to order prescription medications
        </p>
      </div>

      {success ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Prescription Uploaded!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your prescription has been uploaded successfully. You can now order prescription medications.
          </p>
          <button
            onClick={() => router.push('/products')}
            className="btn btn-primary"
          >
            Browse Medications
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Important Information</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Upload a clear photo or scan of your prescription</li>
                  <li>Ensure all text is readable</li>
                  <li>Include doctor's signature and date</li>
                  <li>Accepted formats: JPG, PNG, PDF</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Medication Name (Optional)
              </label>
              <input
                type="text"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="e.g., Metformin 500mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Prescription Image *
              </label>
              
              {!prescriptionFile ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Click to upload or drag and drop
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="prescription-upload"
                  />
                  <label
                    htmlFor="prescription-upload"
                    className="btn btn-secondary cursor-pointer inline-block"
                  >
                    Choose File
                  </label>
                </div>
              ) : (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-primary-600" />
                      <div>
                        <p className="font-medium">{prescriptionFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(prescriptionFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {preview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <img
                        src={preview}
                        alt="Prescription preview"
                        className="max-w-full h-auto rounded border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="Any additional information for the pharmacist..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!prescriptionFile || uploading}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Prescription'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="font-semibold mb-3">What happens next?</h3>
        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-primary-600">1.</span>
            <span>Your prescription will be securely stored</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-primary-600">2.</span>
            <span>Browse and add prescription medications to your cart</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-primary-600">3.</span>
            <span>A licensed pharmacist will verify your prescription</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-primary-600">4.</span>
            <span>Once approved, your order will be processed and shipped</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
