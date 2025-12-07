export function SymptomFinder() {
  return (
    <section className="container mx-auto px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-center">Find Medications by Condition</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Browse medications for common health conditions
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Diabetes', 'Hypertension', 'Cholesterol', 'Asthma', 'Allergies', 'Pain Relief', 'Antibiotics', 'Vitamins'].map((condition) => (
            <button
              key={condition}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              {condition}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
