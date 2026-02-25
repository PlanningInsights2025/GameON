import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadOrders = async (withLoader = true) => {
    try {
      if (withLoader) {
        setLoading(true);
      }
      const data = await orderService.list();
      setOrders(data);
    } finally {
      if (withLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrders(true);

    const intervalId = setInterval(() => {
      loadOrders(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'processing': 'bg-blue-100 text-blue-800 border-blue-300',
      'shipped': 'bg-purple-100 text-purple-800 border-purple-300',
      'delivered': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'processing': '📦',
      'shipped': '🚚',
      'delivered': '✅',
      'cancelled': '❌',
    };
    return icons[status] || '📋';
  };

  const getOrderTimeline = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    
    return statuses.map((s, idx) => ({
      name: s.charAt(0).toUpperCase() + s.slice(1),
      completed: idx <= currentIndex,
      active: s === status,
    }));
  };

  const getPaymentStatusColor = (paymentStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      paid: 'bg-green-100 text-green-800 border-green-300',
      refunded: 'bg-blue-100 text-blue-800 border-blue-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[paymentStatus] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link 
              to="/products" 
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              (() => {
                const orderItems = order.items || order.products || [];
                const updates = Array.isArray(order.updates) ? [...order.updates].sort((a, b) => new Date(b.at) - new Date(a.at)) : [];

                return (
              <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <p className="text-blue-100 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{order.total.toLocaleString()}</p>
                      <p className="text-blue-100 text-sm">{orderItems.length || 0} items</p>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getStatusIcon(order.status)}</span>
                      <div>
                        <p className="text-sm text-gray-600">Order Status</p>
                        <span className={`inline-block px-4 py-2 rounded-lg font-semibold border-2 ${getStatusColor(order.status)} capitalize`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition"
                    >
                      {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-gray-600">Payment ({(order.payment?.method || 'cod').toUpperCase()})</span>
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getPaymentStatusColor(order.payment?.status || 'pending')} capitalize`}>
                        {order.payment?.status || 'pending'}
                      </span>
                      {order.payment?.refund?.status === 'processed' && (
                        <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold border bg-green-100 text-green-800 border-green-300">
                          Return Processed
                        </span>
                      )}
                    </div>
                    {order.payment?.refund?.status === 'processed' && order.payment?.refund?.processedAt && (
                      <p className="text-xs text-gray-600 mt-2">
                        Refund completed on {new Date(order.payment.refund.processedAt).toLocaleString()}
                      </p>
                    )}
                    {order.payment?.refund?.status === 'processed' && order.payment?.refund?.reason && (
                      <p className="text-xs text-gray-600 mt-1">
                        Reason: {order.payment.refund.reason}
                      </p>
                    )}
                  </div>

                  {/* Order Timeline */}
                  {order.status !== 'cancelled' && (
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                          style={{ 
                            width: `${(getOrderTimeline(order.status).filter(s => s.completed).length / 4) * 100}%` 
                          }}
                        />
                      </div>
                      {getOrderTimeline(order.status).map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${
                            step.completed 
                              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {step.completed ? '✓' : idx + 1}
                          </div>
                          <span className={`text-xs font-semibold ${
                            step.active ? 'text-blue-600' : step.completed ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order._id && (
                  <div className="p-6 bg-gray-50">
                    <h4 className="font-bold text-lg mb-4">Order Updates</h4>
                    {updates.length > 0 ? (
                      <div className="space-y-2 mb-6">
                        {updates.map((update, idx) => (
                          <div key={`${update.at || idx}-${idx}`} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-gray-900">{update.title}</p>
                              <p className="text-xs text-gray-500">{update.at ? new Date(update.at).toLocaleString() : '-'}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{update.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 mb-6">No updates available yet.</p>
                    )}

                    <h4 className="font-bold text-lg mb-4">Order Items</h4>
                    {orderItems.length > 0 ? (
                      <div className="space-y-3">
                        {orderItems.map((item, idx) => {
                          const quantity = item.quantity ?? item.qty ?? 0;
                          return (
                          <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-lg">
                            {item.product?.images?.[0] ? (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1">
                              <h5 className="font-semibold">{item.product?.name || 'Product'}</h5>
                              <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                              <p className="text-sm text-gray-600">Price: ₹{item.price?.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">₹{(item.price * quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        )})}
                      </div>
                    ) : (
                      <p className="text-gray-500">No item details available</p>
                    )}

                    {/* Shipping Address */}
                    {order.address && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-bold text-lg mb-3">Shipping Address</h4>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="font-semibold">{order.address.name}</p>
                          <p className="text-gray-700">{order.address.street}</p>
                          <p className="text-gray-700">
                            {order.address.city}, {order.address.state} {order.address.zipCode}
                          </p>
                          <p className="text-gray-700">{order.address.country}</p>
                          {order.address.phone && (
                            <p className="text-gray-700 mt-2">Phone: {order.address.phone}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
                );
              })()
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
