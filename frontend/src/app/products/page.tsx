'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductFilters, FilterState } from '@/components/products/ProductFilters'
import { ProductGrid } from '@/components/products/ProductGrid'

export default function ProductsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    conditions: [],
    type: [],
    prescriptionType: 'all',
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      
      // Redirect non-patients to their respective dashboards
      if (parsedUser.role === 'admin') {
        router.push('/admin/products')
        return
      } else if (parsedUser.role === 'doctor' || parsedUser.role === 'pharmacist') {
        router.push('/doctor/prescriptions')
        return
      }
    }
    setLoading(false)
  }, [router])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Medications</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilters onFilterChange={handleFilterChange} />
        </aside>
        <div className="lg:col-span-3">
          <ProductGrid filters={filters} />
        </div>
      </div>
    </div>
  )
}
