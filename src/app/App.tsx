import { useState, useEffect } from 'react';
import Login from '@/app/components/Login';
import SupplierDashboard from '@/app/components/SupplierDashboard';
import { ManagerDashboard } from '@/app/components/ManagerDashboard';
import AdminDashboard from '@/app/components/AdminDashboard';
import CustomerDashboard from '@/app/components/CustomerDashboard';
import DriverDashboard from '@/app/components/DriverDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<string>('login');

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('swifttrack_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setCurrentView(user.role);
    }
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setCurrentView(user.role);
    localStorage.setItem('swifttrack_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    localStorage.removeItem('swifttrack_user');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'login' && <Login onLogin={handleLogin} />}
      {currentView === 'supplier' && <SupplierDashboard user={currentUser} onLogout={handleLogout} />}
      {currentView === 'manager' && <ManagerDashboard onLogout={handleLogout} />}
      {currentView === 'admin' && <AdminDashboard user={currentUser} onLogout={handleLogout} />}
      {currentView === 'customer' && <CustomerDashboard user={currentUser} onLogout={handleLogout} />}
      {currentView === 'driver' && <DriverDashboard user={currentUser} onLogout={handleLogout} />}
    </div>
  );
}