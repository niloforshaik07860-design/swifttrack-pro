import { useState } from 'react';
import { motion } from 'motion/react';
import { Truck, Shield, Users, Package, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: (role: string, userData?: any) => void;
}

const roles = [
  { 
    id: 'admin', 
    label: 'Administrator', 
    icon: Shield, 
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    color: 'bg-purple-600'
  },
  { 
    id: 'manager', 
    label: 'Manager', 
    icon: Users, 
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    color: 'bg-blue-600'
  },
  { 
    id: 'supplier', 
    label: 'Supplier', 
    icon: Package, 
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    color: 'bg-orange-600'
  },
  { 
    id: 'customer', 
    label: 'Customer', 
    icon: ShoppingBag, 
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    color: 'bg-indigo-600'
  },
  { 
    id: 'driver', 
    label: 'Driver', 
    icon: Truck, 
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    color: 'bg-green-600'
  },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowLoginForm(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Simple login check - just username "admin" and password "admin123"
      if (username === 'admin' && password === 'admin123') {
        toast.success('Welcome, Administrator!');
        onLogin(selectedRole, { 
          username: username, 
          name: 'Administrator',
          role: selectedRole 
        });
        return;
      }

      // If credentials don't match
      toast.error('Invalid username or password');
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
            style={{
              background: `linear-gradient(${Math.random() * 360}deg, #8b5cf6, #ec4899, #3b82f6)`,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              SwiftTrack Pro
            </h1>
          </motion.div>
          <p className="text-xl text-purple-200">UK Delivery & Logistics Management System</p>
        </motion.div>

        {!showLoginForm ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRoleSelect(role.id)}
                  className="cursor-pointer"
                >
                  <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${role.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300`}></div>
                    <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                      <div className={`${role.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white text-center mb-2">{role.label}</h3>
                      <div className="flex items-center justify-center text-purple-300 text-sm">
                        <span>Sign in</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r ${selectedRoleData?.gradient} rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-300`}></div>
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
                <button
                  onClick={() => setShowLoginForm(false)}
                  className="text-purple-300 hover:text-white mb-4 flex items-center gap-2 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to roles
                </button>
                
                <div className="text-center mb-8">
                  {selectedRoleData && (
                    <>
                      <div className={`${selectedRoleData.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl`}>
                        <selectedRoleData.icon className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedRoleData.label} Login</h2>
                      <p className="text-purple-200">Enter your credentials to continue</p>
                    </>
                  )}
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className={`w-full ${selectedRoleData?.color} hover:opacity-90 text-white h-12 text-lg shadow-lg`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Sign In'}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}