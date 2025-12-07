'use client'

import Link from 'next/link'
import { Shield, Clock, Award } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function HeroSection() {
  const { t } = useLanguage()
  
  return (
    <section className="bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t.home.hero.title}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {t.home.hero.subtitle}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/products" className="btn btn-primary text-lg px-8 py-3">
              {t.home.hero.cta}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-primary-600 mb-3" />
              <h3 className="font-semibold mb-2">{t.home.hipaaCompliant}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.home.hipaaDesc}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-primary-600 mb-3" />
              <h3 className="font-semibold mb-2">{t.home.fastDelivery}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.home.fastDeliveryDesc}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 text-primary-600 mb-3" />
              <h3 className="font-semibold mb-2">{t.home.verifiedPharmacists}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.home.verifiedPharmacistsDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
