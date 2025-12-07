import { Video } from 'lucide-react'

export function TelehealthBanner() {
  return (
    <section className="container mx-auto px-4">
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Video className="w-12 h-12" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Need a Prescription?</h3>
              <p className="text-blue-100">Consult with a licensed physician via telehealth</p>
            </div>
          </div>
          <button className="btn bg-white text-primary-600 hover:bg-gray-100">
            Schedule Consultation
          </button>
        </div>
      </div>
    </section>
  )
}
