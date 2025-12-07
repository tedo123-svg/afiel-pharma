'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Truck, CheckCircle, XCircle, Clock, Eye, X, FileText, Trash2, Download, FileSpreadsheet, FileDown } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContainer'
import { apiUrl } from '@/lib/api'

export default function AdminOrdersPage() {
  const { showToast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      if (parsedUser.role !== 'admin') {
        router.push('/')
        return
      }
      
      fetchOrders()
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...')
      const response = await fetch(apiUrl('/orders'))
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Orders data:', data)
        console.log('Order statuses:', data.map((o: any) => ({ id: o.id.substring(0, 8), status: o.status })))
        setOrders(data)
      } else {
        console.error('Failed to fetch orders:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShipOrder = async (orderId: string) => {
    try {
      const response = await fetch(apiUrl(`/orders/${orderId}/ship`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': user.role,
        },
      })
      
      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ))
        showToast('Order marked as shipped successfully!', 'success')
      } else {
        const errorText = await response.text()
        showToast(`Failed to ship order: ${errorText}`, 'error')
      }
    } catch (error) {
      console.error('Error shipping order:', error)
      showToast(`Failed to ship order: ${error}`, 'error')
    }
  }

  const handleDeliverOrder = async (orderId: string) => {
    try {
      const response = await fetch(apiUrl(`/orders/${orderId}/deliver`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': user.role,
        },
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ))
        showToast('Order marked as delivered successfully!', 'success')
      } else {
        const errorText = await response.text()
        showToast(`Failed to mark as delivered: ${errorText}`, 'error')
      }
    } catch (error) {
      console.error('Error delivering order:', error)
      showToast(`Failed to mark as delivered: ${error}`, 'error')
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(apiUrl(`/orders/${orderId}/delete`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': user.role,
        },
      })

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId))
        showToast('Order deleted successfully!', 'success')
      } else {
        const errorData = await response.json()
        showToast(`Failed to delete order: ${errorData.message || 'Unknown error'}`, 'error')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      showToast('Failed to delete order', 'error')
    }
  }

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer ID', 'Date', 'Status', 'Total Amount', 'Payment Method', 'Items', 'Shipping Address']
    const rows = filteredOrders.map(order => [
      order.id,
      order.userId,
      new Date(order.createdAt).toLocaleString(),
      order.status,
      `$${parseFloat(order.totalAmount).toFixed(2)}`,
      order.paymentMethod || 'N/A',
      order.items.map((item: any) => `${item.name} (x${item.quantity})`).join('; '),
      order.shippingAddress ? `${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}` : 'N/A'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    showToast('Orders exported to CSV successfully!', 'success')
  }

  const exportToExcel = () => {
    const headers = ['Order ID', 'Customer ID', 'Date', 'Status', 'Total Amount', 'Payment Method', 'Items', 'Shipping Address']
    const rows = filteredOrders.map(order => [
      order.id,
      order.userId,
      new Date(order.createdAt).toLocaleString(),
      order.status,
      parseFloat(order.totalAmount).toFixed(2),
      order.paymentMethod || 'N/A',
      order.items.map((item: any) => `${item.name} (x${item.quantity})`).join('; '),
      order.shippingAddress ? `${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}` : 'N/A'
    ])

    let html = '<html><head><meta charset="utf-8"><style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background-color:#4CAF50;color:white}</style></head><body>'
    html += '<h2>AfiEl Pharma - Orders Export</h2>'
    html += '<p>Export Date: ' + new Date().toLocaleString() + '</p>'
    html += '<table><thead><tr>'
    headers.forEach(header => {
      html += `<th>${header}</th>`
    })
    html += '</tr></thead><tbody>'
    rows.forEach(row => {
      html += '<tr>'
      row.forEach(cell => {
        html += `<td>${cell}</td>`
      })
      html += '</tr>'
    })
    html += '</tbody></table></body></html>'

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `orders_${new Date().toISOString().split('T')[0]}.xls`
    link.click()
    showToast('Orders exported to Excel successfully!', 'success')
  }

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      showToast('Please allow popups to export PDF', 'error')
      return
    }

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>AfiEl Pharma - Orders Export</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #2563eb; }
          .header { margin-bottom: 30px; }
          .order { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; page-break-inside: avoid; }
          .order-header { background: #f3f4f6; padding: 10px; margin: -15px -15px 15px -15px; }
          .order-id { font-size: 18px; font-weight: bold; }
          .status { display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 12px; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-shipped { background: #ddd6fe; color: #5b21b6; }
          .status-delivered { background: #d1fae5; color: #065f46; }
          .items { margin: 10px 0; }
          .item { padding: 5px 0; border-bottom: 1px solid #eee; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
          th { background: #2563eb; color: white; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AfiEl Pharma - Orders Report</h1>
          <p><strong>Export Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Orders:</strong> ${filteredOrders.length}</p>
          <p><strong>Filter:</strong> ${filter === 'all' ? 'All Orders' : filter.charAt(0).toUpperCase() + filter.slice(1)}</p>
        </div>
        <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">Print / Save as PDF</button>
    `

    filteredOrders.forEach(order => {
      const statusClass = order.status.includes('shipped') ? 'status-shipped' : 
                         order.status.includes('delivered') ? 'status-delivered' : 'status-pending'
      
      html += `
        <div class="order">
          <div class="order-header">
            <div class="order-id">Order #${order.id.substring(0, 8)}</div>
            <span class="status ${statusClass}">${order.status.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          <p><strong>Customer ID:</strong> ${order.userId}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> $${parseFloat(order.totalAmount).toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
          
          <div class="items">
            <strong>Items:</strong>
            ${order.items.map((item: any) => `
              <div class="item">
                ${item.name} - Qty: ${item.quantity} - $${(Number(item.price) * item.quantity).toFixed(2)}
                ${item.requiresPrescription ? ' <span style="background: #fed7aa; padding: 2px 6px; border-radius: 3px; font-size: 11px;">Rx</span>' : ''}
              </div>
            `).join('')}
          </div>
          
          ${order.shippingAddress ? `
            <div style="margin-top: 15px; padding: 10px; background: #f9fafb; border-radius: 5px;">
              <strong>Shipping Address:</strong><br>
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              Phone: ${order.shippingAddress.phone}
            </div>
          ` : ''}
        </div>
      `
    })

    html += '</body></html>'
    
    printWindow.document.write(html)
    printWindow.document.close()
    showToast('PDF preview opened. Use Print to save as PDF', 'success')
  }

  const getStatusBadge = (status: string) => {
    const config: any = {
      'pending': { color: 'bg-gray-100 text-gray-800', icon: Clock },
      'awaiting_prescription_verification': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'prescription_verified': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'prescription_denied': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'processing': { color: 'bg-blue-100 text-blue-800', icon: Package },
      'shipped': { color: 'bg-purple-100 text-purple-800', icon: Truck },
      'delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    }

    const { color, icon: Icon } = config[status] || { color: 'bg-gray-100 text-gray-800', icon: Package }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${color}`}>
        <Icon className="w-4 h-4" />
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    )
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    if (filter === 'verified') return order.status === 'prescription_verified'
    if (filter === 'shipped') return order.status === 'shipped'
    if (filter === 'pending') return order.status === 'awaiting_prescription_verification'
    return true
  })

  if (!user || user.role !== 'admin') {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and ship customer orders
          </p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="btn btn-secondary flex items-center gap-2"
            title="Export to CSV"
          >
            <FileDown className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={exportToExcel}
            className="btn btn-secondary flex items-center gap-2"
            title="Export to Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={exportToPDF}
            className="btn btn-secondary flex items-center gap-2"
            title="Export to PDF"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Pending Verification ({orders.filter(o => o.status === 'awaiting_prescription_verification').length})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-4 py-2 rounded-lg ${filter === 'verified' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Ready to Ship ({orders.filter(o => o.status === 'prescription_verified').length})
        </button>
        <button
          onClick={() => setFilter('shipped')}
          className={`px-4 py-2 rounded-lg ${filter === 'shipped' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Shipped ({orders.filter(o => o.status === 'shipped').length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id.substring(0, 8)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer ID: {order.userId}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Date: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(order.status)}
                <span className="text-lg font-bold text-primary-600">
                  ${parseFloat(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold mb-2">Items:</h4>
              <div className="space-y-2">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                      {item.requiresPrescription && (
                        <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                          Rx
                        </span>
                      )}
                    </span>
                    <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold mb-2">Shipping Address:</h4>
                <p className="text-sm">{order.shippingAddress.fullName}</p>
                <p className="text-sm">{order.shippingAddress.address}</p>
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-sm">{order.shippingAddress.phone}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrder(order)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              
              {order.status === 'prescription_verified' && (
                <button
                  onClick={() => handleShipOrder(order.id)}
                  className="btn bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  type="button"
                >
                  <Truck className="w-4 h-4" />
                  Mark as Shipped
                </button>
              )}
              
              {order.status === 'shipped' && (
                <button
                  onClick={() => handleDeliverOrder(order.id)}
                  className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Delivered
                </button>
              )}

              {(order.status === 'shipped' || order.status === 'delivered') && (
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No orders match the selected filter
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Order #{selectedOrder.id.substring(0, 8)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600 dark:text-gray-400">Order ID:</span> {selectedOrder.id}</p>
                    <p><span className="text-gray-600 dark:text-gray-400">Customer ID:</span> {selectedOrder.userId}</p>
                    <p><span className="text-gray-600 dark:text-gray-400">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p><span className="text-gray-600 dark:text-gray-400">Total:</span> <span className="font-bold text-primary-600">${parseFloat(selectedOrder.totalAmount).toFixed(2)}</span></p>
                  </div>
                </div>

                {selectedOrder.trackingNumber && (
                  <div>
                    <h3 className="font-semibold mb-2">Tracking</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600 dark:text-gray-400">Tracking Number:</span></p>
                      <p className="font-mono font-bold">{selectedOrder.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.requiresPrescription && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                              Prescription Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                        {item.prescriptionImage && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              Prescription uploaded
                            </p>
                            <img 
                              src={item.prescriptionImage} 
                              alt="Prescription" 
                              className="w-32 h-32 object-cover rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-80"
                              onClick={() => window.open(item.prescriptionImage, '_blank')}
                            />
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                    <p className="text-sm">{selectedOrder.shippingAddress.address}</p>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span> {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Verification Info */}
              {selectedOrder.verifiedBy && (
                <div>
                  <h3 className="font-semibold mb-3">Verification Details</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-1 text-sm">
                    <p><span className="text-gray-600 dark:text-gray-400">Verified by:</span> {selectedOrder.verifiedBy}</p>
                    {selectedOrder.verifiedAt && (
                      <p><span className="text-gray-600 dark:text-gray-400">Verified at:</span> {new Date(selectedOrder.verifiedAt).toLocaleString()}</p>
                    )}
                    {selectedOrder.verificationNotes && (
                      <div className="mt-2">
                        <p className="text-gray-600 dark:text-gray-400">Notes:</p>
                        <p className="mt-1">{selectedOrder.verificationNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {selectedOrder.status === 'prescription_verified' && (
                  <button
                    onClick={() => {
                      handleShipOrder(selectedOrder.id)
                      setSelectedOrder(null)
                    }}
                    className="btn bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Mark as Shipped
                  </button>
                )}
                
                {selectedOrder.status === 'shipped' && (
                  <button
                    onClick={() => {
                      handleDeliverOrder(selectedOrder.id)
                      setSelectedOrder(null)
                    }}
                    className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Delivered
                  </button>
                )}

                {(selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered') && (
                  <button
                    onClick={() => {
                      handleDeleteOrder(selectedOrder.id)
                      setSelectedOrder(null)
                    }}
                    className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Order
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-secondary ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
