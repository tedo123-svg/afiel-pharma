import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  requiresPrescription: boolean
  prescriptionId?: string
  prescriptionImage?: string
  imageUrl?: string
}

interface CartStore {
  items: CartItem[]
  currentUserId: string | null
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updatePrescription: (id: string, prescriptionImage: string) => void
  clearCart: () => void
  setUser: (userId: string | null) => void
  getTotalPrice: () => number
}

// Helper to get current user ID
const getCurrentUserId = (): string | null => {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem('user')
  if (!userData) return null
  try {
    const user = JSON.parse(userData)
    return user.id || null
  } catch {
    return null
  }
}

export const useCartStore = create<CartStore>()((set, get) => ({
      items: [],
      currentUserId: null,
      
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },
      
      updatePrescription: (id, prescriptionImage) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, prescriptionImage } : i
          ),
        }))
      },
      
      clearCart: () => set({ items: [], currentUserId: null }),
      
      setUser: (userId) => {
        const currentUserId = get().currentUserId
        
        // If switching users, load their cart from storage
        if (userId !== currentUserId) {
          // Load user-specific cart from localStorage
          const storageKey = userId ? `cart-storage-${userId}` : 'cart-storage-guest'
          const stored = localStorage.getItem(storageKey)
          
          if (stored) {
            try {
              const { items } = JSON.parse(stored)
              set({ items: items || [], currentUserId: userId })
            } catch {
              set({ items: [], currentUserId: userId })
            }
          } else {
            set({ items: [], currentUserId: userId })
          }
          
          // Save current cart before switching
          if (currentUserId) {
            const currentStorageKey = currentUserId ? `cart-storage-${currentUserId}` : 'cart-storage-guest'
            localStorage.setItem(currentStorageKey, JSON.stringify({ items: get().items }))
          }
        }
      },
      
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
    }))
