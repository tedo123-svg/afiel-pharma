'use client'

import { Search } from 'lucide-react'

export function DoctorSearch() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Find a Doctor</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Specialty</label>
          <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
            <option>All Specialties</option>
            <option>Cardiology</option>
            <option>Endocrinology</option>
            <option>Family Medicine</option>
            <option>Internal Medicine</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            placeholder="City or ZIP code"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>

        <button className="btn btn-primary w-full flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          Search Doctors
        </button>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Need a prescription?</strong> Schedule a telehealth consultation with a licensed physician.
        </p>
      </div>
    </div>
  )
}
