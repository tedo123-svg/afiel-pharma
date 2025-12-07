'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login after 2 seconds
    const timer = setTimeout(() => {
      router.push('/login')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <Mail className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Email Verification</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Email verification is currently disabled.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login...
          </p>
        </div>
      </div>
    </div>
  )
}
