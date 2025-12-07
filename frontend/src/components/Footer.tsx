import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">AfiEl Pharma</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              HIPAA-compliant prescription medication platform
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary-600">Products</Link></li>
              <li><Link href="/prescriptions" className="hover:text-primary-600">Prescriptions</Link></li>
              <li><Link href="/about" className="hover:text-primary-600">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
              <li><Link href="/hipaa" className="hover:text-primary-600">HIPAA Notice</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>24/7 Pharmacist Support</li>
              <li>1-800-MED-HELP</li>
              <li>support@afiel-pharma.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} AfiEl Pharma. All rights reserved. Licensed in all 50 states.</p>
        </div>
      </div>
    </footer>
  )
}
