'use client'

import { createContext, useContext, useState } from 'react'

const TabsContext = createContext<{
  activeTab: string
  setActiveTab: (tab: string) => void
}>({ activeTab: '', setActiveTab: () => {} })

export function Tabs({ 
  children, 
  defaultValue 
}: { 
  children: React.ReactNode
  defaultValue: string 
}) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
      {children}
    </div>
  )
}

export function TabsTrigger({ 
  value, 
  children 
}: { 
  value: string
  children: React.ReactNode 
}) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 font-medium transition-colors ${
        isActive
          ? 'border-b-2 border-primary-600 text-primary-600'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ 
  value, 
  children 
}: { 
  value: string
  children: React.ReactNode 
}) {
  const { activeTab } = useContext(TabsContext)

  if (activeTab !== value) return null

  return <div>{children}</div>
}
