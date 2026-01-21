import { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Clock, CheckCircle, LogOut, RefreshCw, Navigation, Calendar } from 'lucide-react';
import { API_ENDPOINTS, apiCall } from '@/config/api';

interface DriverDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function DriverDashboard({ user, onLogout }: DriverDashboardProps) {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deliveriesData, vehiclesData] = await Promise.all([
        apiCall(API_ENDPOINTS.deliveries),
        apiCall(API_ENDPOINTS.vehicles),
      ]);
      
      // Filter deliveries assigned to this driver
      const driverDeliveries = deliveriesData.filter((d: any) => d.driver_id === user.user_id);
      setDeliveries(driverDeliveries);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeDeliveries = deliveries.filter(d => 
    d.status === 'In Transit' || d.status === 'Picked Up' || d.status === 'Out for Delivery'
  );
  const completedDeliveries = deliveries.filter(d => d.status === 'Delivered');
  const pendingDeliveries = deliveries.filter(d => d.status === 'Pending');

  const stats = {
    total: deliveries.length,
    active: activeDeliveries.length,
    completed: completedDeliveries.length,
    pending: pendingDeliveries.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Picked Up': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'In Transit': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return Clock;
      case 'Picked Up': return Package;
      case 'In Transit': return Truck;
      case 'Out for Delivery': return Navigation;
      case 'Delivered': return CheckCircle;
      default: return Package;
    }
  };

  const getCurrentDeliveries = () => {
    switch (activeTab) {
      case 'active':
        return activeDeliveries;
      case 'completed':
        return completedDeliveries;
      case 'pending':
        return pendingDeliveries;
      default:
        return deliveries;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
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
          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deliveries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Deliveries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white rounded-xl p-2 shadow-lg border border-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span>Active Deliveries</span>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>Pending</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Completed</span>
          </button>
        </div>

        {/* Deliveries List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {activeTab === 'active' && 'Active Deliveries'}
                {activeTab === 'pending' && 'Pending Deliveries'}
                {activeTab === 'completed' && 'Completed Deliveries'}
              </h2>
              <button
                onClick={fetchData}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : getCurrentDeliveries().length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No deliveries found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getCurrentDeliveries().map((delivery) => {
                  const StatusIcon = getStatusIcon(delivery.status);
                  return (
                    <div key={delivery.delivery_id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Delivery #{delivery.delivery_id}</h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(delivery.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {delivery.status}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-start space-x-3">
                          <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Order ID</p>
                            <p className="text-sm text-gray-900">{delivery.order_id}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Pickup Location</p>
                            <p className="text-sm text-gray-900">{delivery.pickup_location}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Delivery Location</p>
                            <p className="text-sm text-gray-900">{delivery.delivery_location}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div className="flex space-x-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Pickup Date</p>
                              <p className="text-sm text-gray-900">{delivery.pickup_date}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Delivery Date</p>
                              <p className="text-sm text-gray-900">{delivery.delivery_date}</p>
                            </div>
                          </div>
                        </div>

                        {delivery.current_location && (
                          <div className="flex items-start space-x-3">
                            <Navigation className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">Current Location</p>
                              <p className="text-sm text-gray-900">{delivery.current_location}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {delivery.status === 'Pending' && (
                          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition shadow-md">
                            Start Pickup
                          </button>
                        )}
                        {(delivery.status === 'In Transit' || delivery.status === 'Out for Delivery') && (
                          <>
                            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition shadow-md">
                              Update Location
                            </button>
                            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition shadow-md">
                              Mark Delivered
                            </button>
                          </>
                        )}
                        {delivery.status === 'Delivered' && (
                          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed">
                            Completed
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}