'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function HealthTips() {
  const { t } = useLanguage()
  
  const tips = [
    {
      title: t.healthTips.medicationAdherenceTitle,
      description: t.healthTips.medicationAdherenceDesc,
    },
    {
      title: t.healthTips.drugInteractionsTitle,
      description: t.healthTips.drugInteractionsDesc,
    },
    {
      title: t.healthTips.storageTipsTitle,
      description: t.healthTips.storageTipsDesc,
    },
  ]

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8">{t.healthTips.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">{tip.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tip.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
