import Link from 'next/link'
import { Shield, Clock, Award } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            AfiEl Pharma - Your Trusted Online Pharmacy
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            HIPAA-compliant prescription medications delivered to your door with licensed pharmacist verification
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/products" className="btn btn-primary text-lg px-8 py-3">
              Browse Medications
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-primary-600 mb-3" />
              <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your health data is encrypted and protected
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-primary-600 mb-3" />
              <h3 className="font-semibold mb-2">24/7 Pharmacist Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Licensed pharmacists available anytime
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 text-primary-600 mb-3" />
              <h3 className="font-semibold mb-2">FDA Approved</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All medications meet FDA standards
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
