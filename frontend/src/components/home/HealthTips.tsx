export function HealthTips() {
  const tips = [
    {
      title: 'Medication Adherence',
      description: 'Taking medications as prescribed improves health outcomes by 50%',
    },
    {
      title: 'Drug Interactions',
      description: 'Always inform your pharmacist about all medications you\'re taking',
    },
    {
      title: 'Storage Tips',
      description: 'Store medications in a cool, dry place away from direct sunlight',
    },
  ]

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8">Health Tips</h2>
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
