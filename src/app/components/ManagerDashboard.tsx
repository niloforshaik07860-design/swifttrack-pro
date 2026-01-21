import { useState, useEffect } from 'react';
import { BarChart3, Users, Package, TrendingUp, LogOut, RefreshCw, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API_ENDPOINTS, apiCall } from '@/config/api';

interface ManagementDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function ManagementDashboard({ user, onLogout }: ManagementDashboardProps) {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deliveriesData, ordersData, driversData] = await Promise.all([
        apiCall(API_ENDPOINTS.deliveries),
        apiCall(API_ENDPOINTS.orders),
        apiCall(API_ENDPOINTS.drivers),
      ]);
      setDeliveries(deliveriesData);
      setOrders(ordersData);
      setDrivers(driversData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    totalDeliveries: deliveries.length,
    totalOrders: orders.length,
    activeDrivers: drivers.filter(d => d.status === 'Available').length,
    completedDeliveries: deliveries.filter(d => d.status === 'Delivered').length,
  };

  // Delivery status chart data
  const statusData = [
    { name: 'Pending', value: deliveries.filter(d => d.status === 'Pending').length, color: '#fbbf24' },
    { name: 'In Transit', value: deliveries.filter(d => d.status === 'In Transit').length, color: '#3b82f6' },
    { name: 'Delivered', value: deliveries.filter(d => d.status === 'Delivered').length, color: '#10b981' },
    { name: 'Cancelled', value: deliveries.filter(d => d.status === 'Cancelled').length, color: '#ef4444' },
  ];

  // Monthly deliveries data (mock - you can calculate from actual dates)
  const monthlyData = [
    { month: 'Jan', deliveries: 45, orders: 52 },
    { month: 'Feb', deliveries: 52, orders: 58 },
    { month: 'Mar', deliveries: 48, orders: 55 },
    { month: 'Apr', deliveries: 61, orders: 68 },
    { month: 'May', deliveries: 55, orders: 62 },
    { month: 'Jun', deliveries: 67, orders: 74 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Management Dashboard</h1>
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
          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deliveries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalDeliveries}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Drivers</p>
                <p className="text-3xl font-bold text-gray-800">{stats.activeDrivers}</p>
              </div>
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completedDeliveries}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Monthly Performance</h2>
              <button
                onClick={fetchData}
                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deliveries" fill="#a855f7" name="Deliveries" />
                  <Bar dataKey="orders" fill="#ec4899" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Status Distribution</h2>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Deliveries Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Deliveries</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : deliveries.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No deliveries found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Delivery ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Delivery Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deliveries.slice(0, 10).map((delivery) => (
                    <tr key={delivery.delivery_id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{delivery.delivery_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{delivery.order_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{delivery.driver_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{delivery.supplier_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{delivery.delivery_date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          delivery.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                          delivery.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}