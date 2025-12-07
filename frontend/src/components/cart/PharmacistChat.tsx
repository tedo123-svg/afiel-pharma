import { MessageCircle } from 'lucide-react'

export function PharmacistChat() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <MessageCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Questions about your medications?</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Chat with a licensed pharmacist before checkout. Available 24/7.
          </p>
          <button className="btn btn-primary">Chat with Pharmacist</button>
        </div>
      </div>
    </div>
  )
}
