'use client'

import { Shield, Award, Users, FileCheck } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t.about.title}</h1>
      
      <section className="mb-12">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          {t.about.intro}
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="flex gap-4">
          <Shield className="w-12 h-12 text-primary-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold mb-2">{t.about.hipaaCompliantTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.about.hipaaCompliantDesc}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Award className="w-12 h-12 text-primary-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold mb-2">{t.about.licensedPharmacistsTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.about.licensedPharmacistsDesc}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Users className="w-12 h-12 text-primary-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold mb-2">{t.about.support247Title}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.about.support247Desc}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <FileCheck className="w-12 h-12 text-primary-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold mb-2">{t.about.fdaApprovedTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.about.fdaApprovedDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t.about.certificationsTitle}</h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>• State Board of Pharmacy Licensed (All 50 States)</li>
          <li>• HIPAA Security Rule Compliant</li>
          <li>• FDA 21 CFR Part 11 Compliant</li>
          <li>• PCI DSS Level 1 Certified</li>
          <li>• NABP Verified Internet Pharmacy Practice Site (VIPPS)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">{t.about.ourPharmacistsTitle}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {t.about.ourPharmacistsDesc}
        </p>
      </section>
    </div>
  )
}
