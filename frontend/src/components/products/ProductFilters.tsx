'use client'

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  conditions: string[]
  type: string[]
  prescriptionType: 'all' | 'prescription' | 'otc'
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    conditions: [],
    type: [],
    prescriptionType: 'all',
  })

  const handleConditionChange = (condition: string, checked: boolean) => {
    const newConditions = checked
      ? [...filters.conditions, condition]
      : filters.conditions.filter((c) => c !== condition)
    
    const newFilters = { ...filters, conditions: newConditions }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.type, type]
      : filters.type.filter((t) => t !== type)
    
    const newFilters = { ...filters, type: newTypes }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePrescriptionTypeChange = (prescriptionType: 'all' | 'prescription' | 'otc') => {
    const newFilters = { ...filters, prescriptionType }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Condition</h4>
          <div className="space-y-2">
            {['Diabetes', 'Hypertension', 'Cholesterol', 'Asthma'].map((condition) => (
              <label key={condition} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={filters.conditions.includes(condition)}
                  onChange={(e) => handleConditionChange(condition, e.target.checked)}
                />
                <span className="text-sm">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Type</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded"
                checked={filters.type.includes('brand')}
                onChange={(e) => handleTypeChange('brand', e.target.checked)}
              />
              <span className="text-sm">Brand Name</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded"
                checked={filters.type.includes('generic')}
                onChange={(e) => handleTypeChange('generic', e.target.checked)}
              />
              <span className="text-sm">Generic</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Prescription Required</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="rx" 
                className="rounded-full"
                checked={filters.prescriptionType === 'all'}
                onChange={() => handlePrescriptionTypeChange('all')}
              />
              <span className="text-sm">All</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="rx" 
                className="rounded-full"
                checked={filters.prescriptionType === 'prescription'}
                onChange={() => handlePrescriptionTypeChange('prescription')}
              />
              <span className="text-sm">Prescription Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="rx" 
                className="rounded-full"
                checked={filters.prescriptionType === 'otc'}
                onChange={() => handlePrescriptionTypeChange('otc')}
              />
              <span className="text-sm">Over-the-Counter</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
