import { useState, useEffect } from 'react';
import { Shield, Users, Package, Truck, Settings, LogOut, RefreshCw, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { API_ENDPOINTS, apiCall } from '@/config/api';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const usersData = await apiCall(API_ENDPOINTS.users);
          setUsers(usersData);
          break;
        case 'suppliers':
          const suppliersData = await apiCall(API_ENDPOINTS.suppliers);
          setSuppliers(suppliersData);
          break;
        case 'drivers':
          const driversData = await apiCall(API_ENDPOINTS.drivers);
          setDrivers(driversData);
          break;
        case 'vehicles':
          const vehiclesData = await apiCall(API_ENDPOINTS.vehicles);
          setVehicles(vehiclesData);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalUsers: users.length,
    totalSuppliers: suppliers.length,
    totalDrivers: drivers.length,
    totalVehicles: vehicles.length,
  };

  const tabs = [
    { id: 'users', name: 'Users', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 'suppliers', name: 'Suppliers', icon: Package, color: 'from-purple-500 to-pink-500' },
    { id: 'drivers', name: 'Drivers', icon: Users, color: 'from-green-500 to-emerald-500' },
    { id: 'vehicles', name: 'Vehicles', icon: Truck, color: 'from-orange-500 to-red-500' },
  ];

  const renderTable = () => {
    let data: any[] = [];
    let columns: string[] = [];

    switch (activeTab) {
      case 'users':
        data = users.filter(item =>
          item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        columns = ['User ID', 'Username', 'Name', 'Role', 'Email', 'Phone', 'Actions'];
        break;
      case 'suppliers':
        data = suppliers.filter(item =>
          item.supplier_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        columns = ['Supplier ID', 'Name', 'Contact Person', 'Email', 'Phone', 'Address', 'Actions'];
        break;
      case 'drivers':
        data = drivers.filter(item =>
          item.driver_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        columns = ['Driver ID', 'Name', 'License Number', 'Phone', 'Email', 'Status', 'Actions'];
        break;
      case 'vehicles':
        data = vehicles.filter(item =>
          item.vehicle_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.registration_number?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        columns = ['Vehicle ID', 'Registration', 'Type', 'Model', 'Capacity', 'Status', 'Actions'];
        break;
    }

    return (
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No data found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  {activeTab === 'users' && (
                    <>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.user_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.phone}</td>
                    </>
                  )}
                  {activeTab === 'suppliers' && (
                    <>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.supplier_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.supplier_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.contact_person}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.address}</td>
                    </>
                  )}
                  {activeTab === 'drivers' && (
                    <>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.driver_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.license_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === 'vehicles' && (
                    <>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.vehicle_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.registration_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.vehicle_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.model}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.capacity}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
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
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Suppliers</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalSuppliers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Drivers</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalDrivers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Vehicles</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalVehicles}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white rounded-xl p-2 shadow-lg border border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Manage {tabs.find(t => t.id === activeTab)?.name}</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchData}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition shadow-md">
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${tabs.find(t => t.id === activeTab)?.name.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Table */}
          {renderTable()}
        </div>
      </main>
    </div>
  );
}