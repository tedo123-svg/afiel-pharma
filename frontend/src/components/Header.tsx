'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingCart, User, LogOut, Languages } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useLanguage } from '@/contexts/LanguageContext'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { items, setUser: setCartUser, clearCart } = useCartStore()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const [user, setUser] = useState<any>(null)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    // Check if user is logged in - runs on every route change
    const checkUser = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setCartUser(parsedUser.id) // Update cart with user ID
      } else {
        setUser(null)
        setCartUser(null)
      }
    }
    
    checkUser()
    
    // Also listen for storage events (when localStorage changes in another tab/window)
    window.addEventListener('storage', checkUser)
    
    return () => {
      window.removeEventListener('storage', checkUser)
    }
  }, [pathname, setCartUser]) // Re-run when pathname changes

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    clearCart() // Clear cart on logout
    setUser(null)
    setCartUser(null)
    router.push('/')
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            AfiEl Pharma
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              {t.nav.home}
            </Link>
            
            {/* Show Products only for patients or non-logged-in users */}
            {(!user || user.role === 'patient') && (
              <Link href="/products" className="hover:text-primary-600 transition-colors">
                {t.nav.products}
              </Link>
            )}
            
            {/* Show Prescriptions for patients */}
            {user && user.role === 'patient' && (
              <Link href="/prescriptions" className="hover:text-primary-600 transition-colors">
                {t.nav.myPrescriptions}
              </Link>
            )}
            
            {/* Show Verify Prescriptions for doctors/pharmacists */}
            {user && (user.role === 'doctor' || user.role === 'pharmacist') && (
              <Link href="/doctor/prescriptions" className="hover:text-primary-600 transition-colors">
                {t.nav.verifyPrescriptions}
              </Link>
            )}
            
            {/* Show Admin links for admin */}
            {user && user.role === 'admin' && (
              <>
                <Link href="/admin/products" className="hover:text-primary-600 transition-colors">
                  {t.nav.manageProducts}
                </Link>
                <Link href="/admin/users" className="hover:text-primary-600 transition-colors">
                  {t.nav.manageUsers}
                </Link>
                <Link href="/admin/orders" className="hover:text-primary-600 transition-colors">
                  {t.nav.manageOrders}
                </Link>
              </>
            )}
            
            <Link href="/about" className="hover:text-primary-600 transition-colors">
              {t.nav.about}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
            >
              <Languages className="w-5 h-5" />
              <span className="text-sm font-medium">{language === 'en' ? 'አማ' : 'EN'}</span>
            </button>
            
            {/* Show cart only for patients and non-logged-in users */}
            {(!user || user.role === 'patient') && (
              <Link 
                href="/cart" 
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            
            {user ? (
              // Logged in state
              <>
                <Link 
                  href="/account" 
                  className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">
                    {user.firstName || user.email.split('@')[0]}
                  </span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </>
            ) : (
              // Logged out state
              <>
                <Link 
                  href="/login" 
                  className="hidden md:block px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Sign In
                </Link>
                
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
                >
                  Sign Up
                </Link>
                
                <Link 
                  href="/account" 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="User account"
                >
                  <User className="w-6 h-6" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
