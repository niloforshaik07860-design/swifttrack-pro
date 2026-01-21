// API Configuration for SwiftTrack Pro
// Update this URL to your ngrok tunnel or production API endpoint

export const API_BASE_URL = 'https://nonlethally-pseudomorular-shakia.ngrok-free.dev';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  login: `${API_BASE_URL}/api/login`,
  
  // Suppliers
  suppliers: `${API_BASE_URL}/api/suppliers`,
  
  // Deliveries
  deliveries: `${API_BASE_URL}/api/deliveries`,
  deliveryById: (id: string) => `${API_BASE_URL}/api/deliveries/${id}`,
  
  // Orders
  orders: `${API_BASE_URL}/api/orders`,
  orderById: (id: string) => `${API_BASE_URL}/api/orders/${id}`,
  
  // Customers
  customers: `${API_BASE_URL}/api/customers`,
  
  // Drivers
  drivers: `${API_BASE_URL}/api/drivers`,
  
  // Vehicles
  vehicles: `${API_BASE_URL}/api/vehicles`,
  
  // Users
  users: `${API_BASE_URL}/api/users`,
};

// Helper function to make API calls
export const apiCall = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};