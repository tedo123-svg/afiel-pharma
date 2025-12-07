'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingCart, User, LogOut, Languages, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useLanguage } from '@/contexts/LanguageContext'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { items, setUser: setCartUser, clearCart } = useCartStore()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const [user, setUser] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
    setIsSidebarOpen(false)
    router.push('/')
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="text-xl sm:text-2xl font-bold text-primary-600 truncate">
              AfiEl Pharma
            </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
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

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
              title={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
            >
              <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">{language === 'en' ? 'አማ' : 'EN'}</span>
            </button>
            
            {/* Show cart only for patients and non-logged-in users */}
            {(!user || user.role === 'patient') && (
              <Link 
                href="/cart" 
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
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
                  className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium truncate max-w-[100px]">
                    {user.firstName || user.email.split('@')[0]}
                  </span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors touch-manipulation"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
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

    {/* Mobile Sidebar Overlay */}
    {isSidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
        onClick={closeSidebar}
      />
    )}

    {/* Mobile Sidebar */}
    <div 
      className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <span className="text-lg font-bold text-primary-600">AfiEl Pharma</span>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{user.firstName || user.email.split('@')[0]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
              >
                <span>{t.nav.home}</span>
              </Link>
            </li>

            {/* Show Products only for patients or non-logged-in users */}
            {(!user || user.role === 'patient') && (
              <li>
                <Link 
                  href="/products" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                >
                  <span>{t.nav.products}</span>
                </Link>
              </li>
            )}

            {/* Show Prescriptions for patients */}
            {user && user.role === 'patient' && (
              <li>
                <Link 
                  href="/prescriptions" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                >
                  <span>{t.nav.myPrescriptions}</span>
                </Link>
              </li>
            )}

            {/* Show Verify Prescriptions for doctors/pharmacists */}
            {user && (user.role === 'doctor' || user.role === 'pharmacist') && (
              <li>
                <Link 
                  href="/doctor/prescriptions" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                >
                  <span>{t.nav.verifyPrescriptions}</span>
                </Link>
              </li>
            )}

            {/* Show Admin links for admin */}
            {user && user.role === 'admin' && (
              <>
                <li>
                  <Link 
                    href="/admin/products" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                  >
                    <span>{t.nav.manageProducts}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/users" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                  >
                    <span>{t.nav.manageUsers}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/orders" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                  >
                    <span>{t.nav.manageOrders}</span>
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link 
                href="/about" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
              >
                <span>{t.nav.about}</span>
              </Link>
            </li>

            {user && (
              <li>
                <Link 
                  href="/account" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                >
                  <span>{t.nav.account}</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          {/* Language Switcher */}
          <button
            onClick={() => {
              setLanguage(language === 'en' ? 'am' : 'en')
              closeSidebar()
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
          >
            <Languages className="w-5 h-5" />
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors touch-manipulation"
            >
              <LogOut className="w-5 h-5" />
              <span>{t.nav.signOut}</span>
            </button>
          ) : (
            <>
              <Link 
                href="/login" 
                className="w-full flex items-center justify-center px-3 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors touch-manipulation"
              >
                {t.nav.login}
              </Link>
              <Link 
                href="/register" 
                className="w-full flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors touch-manipulation"
              >
                {t.nav.register}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
