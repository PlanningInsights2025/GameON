import { useState, useEffect } from 'react';
import { orderService } from '../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    try {
      setLoading(true);
      const data = await orderService.list();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const intervalId = setInterval(() => {
      orderService.list().then(setOrders).catch(() => {});
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      load();
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track customer orders</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div onClick={() => setFilter('all')} className={`cursor-pointer p-4 rounded-lg border-2 transition ${filter === 'all' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
          <p className="text-sm text-gray-600 uppercase">All</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div onClick={() => setFilter('pending')} className={`cursor-pointer p-4 rounded-lg border-2 transition ${filter === 'pending' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
          <p className="text-sm text-gray-600 uppercase">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div onClick={() => setFilter('processing')} className={`cursor-pointer p-4 rounded-lg border-2 transition ${filter === 'processing' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
          <p className="text-sm text-gray-600 uppercase">Processing</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.processing}</p>
        </div>
        <div onClick={() => setFilter('shipped')} className={`cursor-pointer p-4 rounded-lg border-2 transition ${filter === 'shipped' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
          <p className="text-sm text-gray-600 uppercase">Shipped</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.shipped}</p>
        </div>
        <div onClick={() => setFilter('delivered')} className={`cursor-pointer p-4 rounded-lg border-2 transition ${filter === 'delivered' ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
          <p className="text-sm text-gray-600 uppercase">Delivered</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.delivered}</p>
        </div>
        <div onClick={() => setFilter('cancelled')} className={`cursor-pointer p-4 rounded-lg border-2 transition ${filter === 'cancelled' ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
          <p className="text-sm text-gray-600 uppercase">Cancelled</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{filter === 'all' ? 'All Orders' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Transaction</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm">{o.user?.name || o.user?.email || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold">₹{(o.totalAmount || o.total || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium uppercase">{o.payment?.method || 'cod'}</div>
                      <div className={`text-xs mt-1 ${o.payment?.status === 'paid' ? 'text-green-600' : o.payment?.status === 'pending' ? 'text-yellow-600' : o.payment?.status === 'refunded' ? 'text-blue-600' : 'text-red-600'}`}>
                        {o.payment?.status || 'pending'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-mono">{o.payment?.transactionId || '-'}</div>
                      {o.payment?.paidAt && (
                        <div className="text-gray-500 mt-1">{new Date(o.payment.paidAt).toLocaleString()}</div>
                      )}
                      {o.payment?.details?.upiId && (
                        <div className="text-gray-500 mt-1">UPI: {o.payment.details.upiId}</div>
                      )}
                      {o.payment?.details?.cardLast4 && (
                        <div className="text-gray-500 mt-1">Card: ****{o.payment.details.cardLast4}</div>
                      )}
                      {o.payment?.details?.bankName && (
                        <div className="text-gray-500 mt-1">Bank: {o.payment.details.bankName}</div>
                      )}
                      {o.payment?.details?.note && (
                        <div className="text-gray-500 mt-1">Note: {o.payment.details.note}</div>
                      )}
                      {o.payment?.refund?.status === 'processed' && o.payment?.refund?.processedAt && (
                        <div className="text-green-600 mt-1">Refund processed: {new Date(o.payment.refund.processedAt).toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${o.status === 'delivered' ? 'bg-green-100 text-green-800' : o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : o.status === 'processing' ? 'bg-blue-100 text-blue-800' : o.status === 'shipped' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select value={o.status} onChange={e => handleStatusChange(o._id, e.target.value)} className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
}
