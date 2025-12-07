'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Shield, LogOut } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <User className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="text-lg font-semibold">
                {user.firstName || 'N/A'} {user.lastName || ''}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Mail className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Shield className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
              <p className="text-lg font-semibold capitalize">{user.role || 'Patient'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/prescriptions" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-600 transition-colors">
              <h3 className="font-semibold mb-1">My Prescriptions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your prescriptions</p>
            </a>
            <a href="/orders" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-600 transition-colors">
              <h3 className="font-semibold mb-1">Order History</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your orders</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
