'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">AfiEl Pharma</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4" />
              <span>{t.footer.hipaaCompliant}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary-600">{t.nav.products}</Link></li>
              <li><Link href="/prescriptions" className="hover:text-primary-600">{t.footer.prescriptions}</Link></li>
              <li><Link href="/about" className="hover:text-primary-600">{t.nav.about}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-primary-600">{t.footer.privacyPolicy}</Link></li>
              <li><Link href="/terms" className="hover:text-primary-600">{t.footer.termsOfService}</Link></li>
              <li><Link href="/hipaa" className="hover:text-primary-600">{t.footer.hipaaNotice}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.contact}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>{t.footer.support}</li>
              <li>1-800-MED-HELP</li>
              <li>support@afiel-pharma.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} AfiEl Pharma. {t.footer.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  )
}
