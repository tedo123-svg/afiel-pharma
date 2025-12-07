'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Edit, Trash2, Shield } from 'lucide-react'
import { apiUrl } from '@/lib/api'

export default function AdminUsersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'pharmacist',
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      if (parsedUser.role !== 'admin') {
        router.push('/')
      }
    } else {
      router.push('/login')
    }
    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      const response = await fetch(apiUrl('/auth/users'))
      if (response.ok) {
        const data = await response.json()
        // Show all users except admins
        const nonAdminUsers = data.filter((u: any) => u.role !== 'admin')
        setUsers(nonAdminUsers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      const response = await fetch(apiUrl(`/auth/users/${userId}/toggle-status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user.id }),
      })

      if (response.ok) {
        alert('User status updated successfully!')
        fetchUsers()
      } else {
        alert('Failed to update user status')
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Error updating user status')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(apiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(`${formData.role} account created successfully!`)
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'pharmacist',
        })
        setShowForm(false)
        fetchUsers()
      } else {
        const data = await response.json()
        alert(`Failed to create account: ${data.message}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user')
    }
  }

  const handleCancelForm = () => {
    setEditingUser(null)
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'pharmacist',
    })
    setShowForm(false)
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Create User
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Create New User Account
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="Min 8 characters"
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <option value="pharmacist">Pharmacist</option>
                <option value="doctor">Doctor</option>
              </select>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {formData.role === 'pharmacist' 
                  ? '🔬 Pharmacists can verify prescriptions and approve orders'
                  : '👨‍⚕️ Doctors can write and manage prescriptions'}
              </p>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="btn btn-primary">
                Create Account
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">All Users ({users.length})</h3>
        
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No users yet</p>
            <p className="text-sm text-gray-500 mt-1">Users will appear here when they register</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((staffUser) => (
              <div key={staffUser.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className={`w-5 h-5 ${staffUser.role === 'pharmacist' ? 'text-blue-600' : 'text-green-600'}`} />
                      <div>
                        <p className="font-semibold">
                          {staffUser.firstName} {staffUser.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {staffUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Created: {new Date(staffUser.createdAt).toLocaleDateString()}
                      </span>
                      {staffUser.lastLoginAt && (
                        <span>
                          Last login: {new Date(staffUser.lastLoginAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      staffUser.role === 'pharmacist' 
                        ? 'bg-blue-100 text-blue-800' 
                        : staffUser.role === 'doctor'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {staffUser.role === 'pharmacist' ? 'Pharmacist' : staffUser.role === 'doctor' ? 'Doctor' : 'Patient'}
                    </span>
                    
                    <button
                      onClick={() => handleToggleStatus(staffUser.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        staffUser.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {staffUser.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      staffUser.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {staffUser.isActive ? '✓ Active' : '✗ Inactive'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {staffUser.isActive 
                        ? 'Can access the system' 
                        : 'Cannot login or access the system'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>ℹ️ Note:</strong> Deactivating an account will prevent the user from logging in. 
            You can reactivate accounts at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
