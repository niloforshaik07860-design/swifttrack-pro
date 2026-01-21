import { useState, useEffect } from 'react';
import { ShoppingBag, Package, Clock, CheckCircle, LogOut, RefreshCw, MapPin, Calendar } from 'lucide-react';
import { API_ENDPOINTS, apiCall } from '@/config/api';

interface CustomerDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function CustomerDashboard({ user, onLogout }: CustomerDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, deliveriesData] = await Promise.all([
        apiCall(API_ENDPOINTS.orders),
        apiCall(API_ENDPOINTS.deliveries),
      ]);
      
      // Filter orders for this customer
      const customerOrders = ordersData.filter((o: any) => o.customer_id === user.user_id);
      setOrders(customerOrders);
      
      // Get deliveries for customer's orders
      const orderIds = customerOrders.map((o: any) => o.order_id);
      const customerDeliveries = deliveriesData.filter((d: any) => orderIds.includes(d.order_id));
      setDeliveries(customerDeliveries);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalOrders: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    inTransit: deliveries.filter(d => d.status === 'In Transit').length,
    delivered: deliveries.filter(d => d.status === 'Delivered').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'In Transit': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-300';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Customer Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Transit</p>
                <p className="text-3xl font-bold text-gray-800">{stats.inTransit}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivered</p>
                <p className="text-3xl font-bold text-gray-800">{stats.delivered}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white rounded-xl p-2 shadow-lg border border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>My Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition ${
              activeTab === 'deliveries'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Track Deliveries</span>
          </button>
        </div>

        {/* Orders Table */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
                <button
                  onClick={fetchData}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-green-500 animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Delivery Address</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.order_id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.order_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.order_date}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.delivery_address}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">£{order.total_amount}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.payment_method}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Deliveries Tracking */}
        {activeTab === 'deliveries' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Track My Deliveries</h2>
                <button
                  onClick={fetchData}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-green-500 animate-spin" />
                </div>
              ) : deliveries.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No deliveries to track</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {deliveries.map((delivery) => (
                    <div key={delivery.delivery_id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Delivery #{delivery.delivery_id}</h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Order ID</p>
                            <p className="text-sm text-gray-900">{delivery.order_id}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Pickup Date</p>
                            <p className="text-sm text-gray-900">{delivery.pickup_date}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Expected Delivery</p>
                            <p className="text-sm text-gray-900">{delivery.delivery_date}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Current Location</p>
                            <p className="text-sm text-gray-900">{delivery.current_location || 'In Transit'}</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition shadow-md">
                        Track on Map
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}