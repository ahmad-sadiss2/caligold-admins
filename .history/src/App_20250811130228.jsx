import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Users, Car, MessageSquare, HelpCircle, Star, FileText, 
  Calendar, DollarSign, TrendingUp, Plus, Edit2, Trash2,
  Eye, Upload, LogOut, Menu, X, Save, Search, Filter,
  BarChart3, PieChart, Activity, Bell, Settings, Home,
  ChevronRight, CheckCircle, XCircle, AlertCircle, Info
} from 'lucide-react';
import ImageCropper from './ImageCropper';

// API Configuration
const API_BASE_URL = 'https://api.caligolddrive.com/api/';

// Auth Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API Functions
const api = {
  // Auth
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  validate: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/validate`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Dashboard
  getDashboardStats: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getRecentBookings: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/recent-bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Vehicles
  getVehicles: async (token, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/admin/vehicles?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createVehicle: async (token, vehicleData) => {
    const response = await fetch(`${API_BASE_URL}/admin/vehicles`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicleData)
    });
    return response.json();
  },

  updateVehicle: async (token, id, vehicleData) => {
    const response = await fetch(`${API_BASE_URL}/admin/vehicles/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicleData)
    });
    return response.json();
  },

  deleteVehicle: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/admin/vehicles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  },

  toggleVehicleAvailability: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/admin/vehicles/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Reviews
  getReviews: async (token, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/admin/reviews?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createReview: async (token, formData) => {
    console.log('Sending review data:', formData);
    const response = await fetch(`${API_BASE_URL}/admin/reviews`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - let browser set it automatically for FormData
      },
      body: formData
    });
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    return response.json();
  },

  updateReview: async (token, id, formData) => {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return response.json();
  },

  deleteReview: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  },



  // Users
  getUsers: async (token, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createUser: async (token, userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  updateUser: async (token, id, userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  deleteUser: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  },

  // FAQs
  getFAQs: async (token, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/admin/faqs?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createFAQ: async (token, faqData) => {
    const response = await fetch(`${API_BASE_URL}/admin/faqs`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(faqData)
    });
    return response.json();
  },

  updateFAQ: async (token, id, faqData) => {
    const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(faqData)
    });
    return response.json();
  },

  deleteFAQ: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  },

  // Features
  getFeatures: async (token, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/admin/features?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createFeature: async (token, formData) => {
    const response = await fetch(`${API_BASE_URL}/admin/features`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return response.json();
  },

  updateFeature: async (token, id, formData) => {
    const response = await fetch(`${API_BASE_URL}/admin/features/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return response.json();
  },

  deleteFeature: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/admin/features/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // File Upload
  uploadFile: async (token, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/admin/files/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return response.json();
  },

  // Bookings
  getBookings: async (token, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateBooking: async (token, id, bookingData) => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },

  deleteBooking: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  },

  // Services
  getServices: async (token, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/admin/services?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createService: async (token, serviceData) => {
    const response = await fetch(`${API_BASE_URL}/admin/services`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });
    return response.json();
  },

  updateService: async (token, id, serviceData) => {
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });
    return response.json();
  },

  deleteService: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  },

  toggleServiceStatus: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}/toggle-status`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },



  // Contact Submissions
  getContactSubmissions: async (token) => {
    const response = await fetch(`${API_BASE_URL}/contact-submissions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

// Utility function to get image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  // Use Cloudinary for image serving
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'caligolddrive';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${imagePath}`;
};

// Reusable Pagination Controls Component
const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  totalElements, 
  pageSize, 
  onPageChange, 
  onPageSizeChange,
  itemName = "items"
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} {itemName}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
        >
          <option value={6}>6 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className={`px-3 py-1 text-sm rounded-md ${
            currentPage === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i;
            } else if (currentPage < 3) {
              pageNum = i;
            } else if (currentPage >= totalPages - 3) {
              pageNum = totalPages - 5 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === pageNum
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
          className={`px-3 py-1 text-sm rounded-md ${
            currentPage === totalPages - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const userData = await api.validate(token);
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('adminToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      if (response.token) {
        setToken(response.token);
        setUser(response);
        localStorage.setItem('adminToken', response.token);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component
const LoginPage = () => {
  const [email, setEmail] = useState('admin@caligolddrive.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-yellow-500 rounded-xl flex items-center justify-center">
            <Car className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">CALI GOLD DRIVE</h2>
          <p className="mt-2 text-sm text-gray-600">Admin Dashboard</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <XCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, bookingsData] = await Promise.all([
          api.getDashboardStats(token),
          api.getRecentBookings(token)
        ]);
        setStats(statsData);
        setRecentBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Bookings', 
      value: stats?.totalBookings || 0, 
      icon: Calendar, 
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: `${stats?.pendingBookings || 0} pending`,
      changeColor: 'text-blue-600'
    },
    { 
      title: 'Total Vehicles', 
      value: stats?.totalVehicles || 0, 
      icon: Car, 
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: `${stats?.availableVehicles || 0} available`,
      changeColor: 'text-green-600'
    },
    { 
      title: 'Total Revenue', 
      value: `$${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}`, 
      icon: DollarSign, 
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      change: `${stats?.completedBookings || 0} completed bookings`,
      changeColor: 'text-green-600'
    },
    { 
      title: 'Average Rating', 
      value: `${stats?.averageRating ? stats.averageRating.toFixed(1) : '5.0'}/5`, 
      icon: Star, 
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: `${stats?.totalReviews || 0} reviews`,
      changeColor: 'text-purple-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to CALI GOLD DRIVE</h1>
            <p className="text-yellow-100 text-lg">Manage your premium ride service with ease</p>
          </div>
          <div className="hidden md:block">
            <Car className="h-16 w-16 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className={`text-sm ${stat.changeColor} flex items-center`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} rounded-xl p-4 shadow-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Revenue Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                ${stats?.monthlyRevenue ? stats.monthlyRevenue.toLocaleString() : '0'}
              </p>
              <p className="text-sm text-gray-500">This month's total</p>
            </div>
            <div className="bg-green-500 rounded-xl p-4 shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Average Booking Value</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                ${stats?.totalBookings > 0 && stats?.totalRevenue ? 
                  (parseFloat(stats.totalRevenue) / stats.totalBookings).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-gray-500">Per booking</p>
            </div>
            <div className="bg-blue-500 rounded-xl p-4 shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Recent Bookings</h3>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {recentBookings.length} bookings
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500">When customers make bookings, they'll appear here.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.slice(0, 5).map((booking, index) => (
                  <tr key={booking.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {booking.customerFirstName?.[0]}{booking.customerLastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customerFirstName} {booking.customerLastName}
                          </div>
                          <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {booking.serviceType || 'Standard Service'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.pickupLocation ? `${booking.pickupLocation.substring(0, 30)}...` : 'Location TBD'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.pickupDateTime ? 
                        new Date(booking.pickupDateTime).toLocaleDateString() : 
                        new Date(booking.createdAt).toLocaleDateString()
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          booking.status === 'CONFIRMED' ? 'bg-green-400' :
                          booking.status === 'PENDING' ? 'bg-yellow-400' :
                          booking.status === 'COMPLETED' ? 'bg-blue-400' :
                          'bg-gray-400'
                        }`} />
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${booking.finalPrice || booking.estimatedPrice || '0.00'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.paymentStatus || 'Pending'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Quick Actions</h4>
            <Plus className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('vehicles')}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              Add New Vehicle
            </button>
            <button 
              onClick={() => setActiveTab('features')}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Manage Features
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">System Status</h4>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Backend API</span>
              <span className="text-green-600 text-sm font-medium">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-green-600 text-sm font-medium">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">File Storage</span>
              <span className="text-green-600 text-sm font-medium">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">System Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-green-900">Backend API</h4>
                  <p className="text-sm text-green-700">Online</p>
                </div>
              </div>
              <div className="text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-green-900">Database</h4>
                  <p className="text-sm text-green-700">Connected</p>
                </div>
              </div>
              <div className="text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab('vehicles')}
              className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center">
                <Car className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <h4 className="font-medium text-yellow-900">Add New Vehicle</h4>
                  <p className="text-sm text-yellow-700">Add a new vehicle to your fleet</p>
                </div>
              </div>
              <div className="text-yellow-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('features')}
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <Star className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-900">Manage Features</h4>
                  <p className="text-sm text-blue-700">Update your service features</p>
                </div>
              </div>
              <div className="text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vehicle Management Component
const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const { token } = useAuth();
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'SEDAN',
    pricePerDay: '',
    pricePerHour: '',
    passengerCapacity: '',
    luggageCapacity: '',
    description: '',
    imageUrl: '',
    features: [],
    isFeatured: false
  });

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, pageSize]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await api.getVehicles(token, currentPage, pageSize);
      if (data.content) {
        // Paginated response
        setVehicles(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        // Non-paginated response (fallback)
        setVehicles(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    // Show image cropper instead of direct upload
    setSelectedImageFile(file);
    setShowImageCropper(true);
  };

  const handleCropComplete = async (croppedFile) => {
    setShowImageCropper(false);
    setSelectedImageFile(null);
    
    setUploadingImage(true);
    try {
      const response = await api.uploadFile(token, croppedFile);
      if (response.success) {
        setFormData({ ...formData, imageUrl: response.data.filePath });
      }
    } catch (error) {
      console.error('Error uploading cropped image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCropCancel = () => {
    setShowImageCropper(false);
    setSelectedImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vehicleData = {
        ...formData,
        pricePerDay: parseFloat(formData.pricePerDay),
        pricePerHour: parseFloat(formData.pricePerHour),
        passengerCapacity: parseInt(formData.passengerCapacity),
        features: formData.features.filter(f => f.trim())
      };

      if (editingVehicle) {
        await api.updateVehicle(token, editingVehicle.id, vehicleData);
      } else {
        await api.createVehicle(token, vehicleData);
      }
      
      setShowModal(false);
      setEditingVehicle(null);
      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      pricePerDay: vehicle.pricePerDay?.toString() || '',
      pricePerHour: vehicle.pricePerHour?.toString() || '',
      passengerCapacity: vehicle.passengerCapacity?.toString() || '',
      luggageCapacity: vehicle.luggageCapacity || '',
      description: vehicle.description || '',
      imageUrl: vehicle.imageUrl || '',
      features: vehicle.features || [],
      isFeatured: vehicle.isFeatured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.deleteVehicle(token, id);
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await api.toggleVehicleAvailability(token, id);
      fetchVehicles();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'SEDAN',
      pricePerDay: '',
      pricePerHour: '',
      passengerCapacity: '',
      luggageCapacity: '',
      description: '',
      imageUrl: '',
      features: [],
      isFeatured: false
    });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length === 0 && !loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Car className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first vehicle.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        ) : (
          vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img
                                    src={getImageUrl(vehicle.imageUrl) || '/assets/vehicles/vehicle-fallback.jpg'}
                alt={vehicle.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                <div className="flex space-x-1">
                  {vehicle.isFeatured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    vehicle.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {vehicle.brand} {vehicle.model} ({vehicle.year})
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {vehicle.passengerCapacity} passengers • {vehicle.type}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-900 mb-4">
                <span>${vehicle.pricePerDay}/day</span>
                <span>${vehicle.pricePerHour}/hour</span>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleAvailability(vehicle.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    vehicle.isAvailable
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {vehicle.isAvailable ? 'Disable' : 'Enable'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} vehicles
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(0);
              }}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={18}>18 per page</option>
              <option value={24}>24 per page</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`px-3 py-1 text-sm rounded-md ${
                currentPage === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage < 3) {
                  pageNum = i;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === pageNum
                        ? 'bg-yellow-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className={`px-3 py-1 text-sm rounded-md ${
                currentPage === totalPages - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingVehicle(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    required
                    min="2000"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="SEDAN">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="VAN">Van</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="LUXURY">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passenger Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={formData.passengerCapacity}
                    onChange={(e) => setFormData({ ...formData, passengerCapacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Day ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Hour ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Luggage Capacity
                </label>
                <input
                  type="text"
                  value={formData.luggageCapacity}
                  onChange={(e) => setFormData({ ...formData, luggageCapacity: e.target.value })}
                  placeholder="e.g., 3 large suitcases"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                  </label>
                  {formData.imageUrl && (
                    <img
                      src={getImageUrl(formData.imageUrl)}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Enter feature"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Feature</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  Featured Vehicle
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingVehicle(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-yellow-700"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showImageCropper && selectedImageFile && (
        <ImageCropper
          imageFile={selectedImageFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={16/9}
          quality={0.95}
          maxWidth={1920}
          maxHeight={1080}
        />
      )}
    </div>
  );
};

// Features Management Component
const FeatureManagement = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { token } = useAuth();
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    displayOrder: 1
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchFeatures();
  }, [currentPage, pageSize]);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const data = await api.getFeatures(token, currentPage, pageSize);
      if (data.content) {
        // Paginated response
        setFeatures(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        // Non-paginated response (fallback)
        setFeatures(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('icon', formData.icon);
      formDataObj.append('displayOrder', formData.displayOrder);

      // Add image if selected
      if (selectedImage) {
        formDataObj.append('image', selectedImage);
      }

      if (editingFeature) {
        await api.updateFeature(token, editingFeature.id, formDataObj);
      } else {
        await api.createFeature(token, formDataObj);
      }
      
      setShowModal(false);
      setEditingFeature(null);
      resetForm();
      setSelectedImage(null);
      setImagePreview(null);
      fetchFeatures();
    } catch (error) {
      console.error('Error saving feature:', error);
    }
  };

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      displayOrder: feature.displayOrder
    });
    // Set image preview if feature has an image
    if (feature.imageUrl) {
      setImagePreview(feature.imageUrl);
    } else {
      setImagePreview(null);
    }
    setSelectedImage(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await api.deleteFeature(token, id);
        fetchFeatures();
      } catch (error) {
        console.error('Error deleting feature:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      displayOrder: 1
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show image cropper instead of direct preview
      setSelectedImageFile(file);
      setShowImageCropper(true);
    }
  };

  const handleCropComplete = async (croppedFile) => {
    setShowImageCropper(false);
    setSelectedImageFile(null);
    
    setSelectedImage(croppedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleCropCancel = () => {
    setShowImageCropper(false);
    setSelectedImageFile(null);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const columns = [
    { 
      key: 'title', 
      label: 'Feature',
      render: (title, feature) => (
        <div className="flex items-center space-x-3">
          {feature.imageUrl && (
            <img 
              src={getImageUrl(feature.imageUrl)} 
              alt={title}
              className="w-12 h-12 object-cover rounded-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{title}</div>
            <div className="text-sm text-gray-500">{feature.description}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'icon', 
      label: 'Icon',
      render: (icon) => <span className="text-2xl">{icon}</span>
    },
    { key: 'displayOrder', label: 'Order' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Feature Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Feature</span>
        </button>
      </div>

      <DataTable
        title=""
        data={features}
        loading={loading}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(0);
        }}
        itemName="features"
      />

      {/* Feature Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingFeature ? 'Edit Feature' : 'Add New Feature'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingFeature(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  required
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., 🐾, 👥, 💳"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feature Image
                </label>
                <div className="space-y-2">
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  <p className="text-xs text-gray-500">
                    Upload an image for this feature (optional). Recommended size: 300x300px
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingFeature(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-yellow-700"
                >
                  {editingFeature ? 'Update Feature' : 'Create Feature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showImageCropper && selectedImageFile && (
        <ImageCropper
          imageFile={selectedImageFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={4/3}
          quality={0.95}
          maxWidth={800}
          maxHeight={600}
        />
      )}
    </div>
  );
};

// Simple Data Table Component for other sections
const DataTable = ({ 
  title, 
  data, 
  loading, 
  columns, 
  onEdit, 
  onDelete,
  // Pagination props
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemName = "items"
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {data.length === 0 && !loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {itemName} found</h3>
          <p className="text-gray-500">There are no {itemName} to display at the moment.</p>
        </div>
      ) : (
        <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

          {/* Pagination Controls */}
          {onPageChange && onPageSizeChange && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              itemName={itemName}
            />
          )}
        </>
      )}
    </div>
  );
};

// Bookings Management Component
const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { token } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, [currentPage, pageSize]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getBookings(token, currentPage, pageSize);
      if (data.content) {
        // Paginated response
        setBookings(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        // Non-paginated response (fallback)
        setBookings(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.updateBooking(token, bookingId, { status: newStatus });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.deleteBooking(token, id);
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const columns = [
    { key: 'bookingReference', label: 'Reference' },
    { 
      key: 'customerName', 
      label: 'Customer',
      render: (_, booking) => `${booking.customerFirstName} ${booking.customerLastName}`
    },
    { key: 'customerEmail', label: 'Email' },
    { key: 'pickupLocation', label: 'Pickup' },
    { key: 'dropoffLocation', label: 'Dropoff' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status, booking) => (
        <div className="flex items-center gap-2">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
          status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
          <select
            value={status}
            onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
            className="text-xs border border-gray-300 rounded px-1 py-0.5"
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      )
    },
    { 
      key: 'finalPrice', 
      label: 'Amount',
      render: (price) => price ? `$${price}` : 'N/A'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
      </div>

    <DataTable
        title=""
      data={bookings}
      loading={loading}
      columns={columns}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(0);
        }}
        itemName="bookings"
      />
    </div>
  );
};

// Services Management Component  
const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    iconEmoji: '',
    imageUrl: '',
    basePrice: '',
    features: [],
    isActive: true,
    isFeatured: false,
    displayOrder: 0
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchServices();
  }, [currentPage, pageSize]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await api.getServices(token, currentPage, pageSize);
      if (data.content) {
        // Paginated response
        setServices(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        // Non-paginated response (fallback)
      setServices(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show image cropper instead of direct preview
      setSelectedImageFile(file);
      setShowImageCropper(true);
    }
  };

  const handleCropComplete = async (croppedFile) => {
    setShowImageCropper(false);
    setSelectedImageFile(null);
    
    setSelectedImage(croppedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleCropCancel = () => {
    setShowImageCropper(false);
    setSelectedImageFile(null);
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;
    
    setUploading(true);
    try {
      const response = await api.uploadFile(token, selectedImage);
      if (response.success) {
        return response.data.filePath;
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalFormData = { ...formData };
      
      // Upload image if a new one is selected
      if (selectedImage) {
        const uploadedImagePath = await uploadImage();
        if (uploadedImagePath) {
          finalFormData.imageUrl = uploadedImagePath;
        } else {
          return; // Stop if image upload failed
        }
      }

      if (editingService) {
        await api.updateService(token, editingService.id, finalFormData);
      } else {
        await api.createService(token, finalFormData);
      }
      setShowForm(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Please try again.');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      shortDescription: service.shortDescription || '',
      iconEmoji: service.iconEmoji || '',
      imageUrl: service.imageUrl || '',
      basePrice: service.basePrice || '',
      features: service.features || [],
      isActive: service.isActive !== undefined ? service.isActive : true,
      isFeatured: service.isFeatured !== undefined ? service.isFeatured : false,
      displayOrder: service.displayOrder || 0
    });
    setImagePreview(service.imageUrl ? getImageUrl(service.imageUrl) : null);
    setSelectedImage(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.deleteService(token, id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      iconEmoji: '',
      imageUrl: '',
      basePrice: '',
      features: [],
      isActive: true,
      isFeatured: false,
      displayOrder: 0
    });
    setSelectedImage(null);
    setImagePreview(null);
    setNewFeature('');
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const toggleServiceStatus = async (id) => {
    try {
      await api.toggleServiceStatus(token, id);
      fetchServices();
    } catch (error) {
      console.error('Error toggling service status:', error);
    }
  };

  const columns = [
    { 
      key: 'imageUrl', 
      label: 'Image',
      render: (imageUrl) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={getImageUrl(imageUrl)} 
              alt="Service" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">No Image</span>
          )}
        </div>
      )
    },
    { key: 'title', label: 'Title' },
    { key: 'shortDescription', label: 'Short Description' },
    { key: 'iconEmoji', label: 'Icon', render: (icon) => <span className="text-xl">{icon}</span> },
    { 
      key: 'basePrice', 
      label: 'Base Price',
      render: (price) => price ? `$${price}` : 'N/A'
    },
    { 
      key: 'isFeatured', 
      label: 'Featured',
      render: (isFeatured) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isFeatured ? 'Featured' : 'Regular'}
        </span>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (isActive, row) => (
        <div className="flex items-center space-x-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={() => toggleServiceStatus(row.id)}
            className="text-blue-600 hover:text-blue-800 text-xs"
            title="Toggle Status"
          >
            Toggle
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingService(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Emoji
                </label>
                <input
                  type="text"
                  value={formData.iconEmoji}
                  onChange={(e) => setFormData({...formData, iconEmoji: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🚗"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="75.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description *
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description for service cards"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of the service..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Image
              </label>
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a new image or keep existing one</p>
                </div>
                {imagePreview && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured
                </label>
                <select
                  value={formData.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={false}>Regular</option>
                  <option value={true}>Featured</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={uploading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  uploading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {uploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {selectedImage ? 'Uploading...' : 'Saving...'}
                  </span>
                ) : (
                  editingService ? 'Update Service' : 'Create Service'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingService(null);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    <DataTable
        title=""
      data={services}
      loading={loading}
      columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(0);
        }}
        itemName="services"
      />

      {/* Image Cropper Modal */}
      {showImageCropper && selectedImageFile && (
        <ImageCropper
          imageFile={selectedImageFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={16/9}
          quality={0.95}
          maxWidth={1200}
          maxHeight={675}
        />
      )}
    </div>
  );
};

const ReviewManagement = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerLocation: '',
    rating: 5,
    comment: '',
    serviceType: '',
    isFeatured: false,
    isApproved: true,
    isActive: true,
    displayOrder: 0
  });
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.getReviews(token, currentPage, pageSize);
      if (response.content) {
        // Paginated response
        setReviews(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        // Non-paginated response (fallback)
        setReviews(Array.isArray(response) ? response : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(response) ? response.length : 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, pageSize]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting review form:', formData);
      
      const formDataObj = new FormData();
      formDataObj.append('customerName', formData.customerName);
      formDataObj.append('customerLocation', formData.customerLocation || '');
      formDataObj.append('rating', formData.rating);
      formDataObj.append('comment', formData.comment);
      formDataObj.append('serviceType', formData.serviceType || '');
      formDataObj.append('isFeatured', formData.isFeatured.toString());
      formDataObj.append('isApproved', formData.isApproved.toString());
      formDataObj.append('isActive', formData.isActive.toString());
      formDataObj.append('displayOrder', formData.displayOrder);

      // Add avatar if selected
      if (selectedAvatar) {
        formDataObj.append('avatar', selectedAvatar);
      }

      console.log('FormData entries:');
      for (let [key, value] of formDataObj.entries()) {
        console.log(key, value);
      }

      let response;
      if (editingReview) {
        response = await api.updateReview(token, editingReview.id, formDataObj);
      } else {
        response = await api.createReview(token, formDataObj);
      }
      
      console.log('API response:', response);
      
      if (response.success) {
        setShowForm(false);
        setEditingReview(null);
        resetForm();
        setSelectedAvatar(null);
        setAvatarPreview(null);
        fetchReviews();
      } else {
        console.error('API returned error:', response.message);
        alert('Error saving review: ' + response.message);
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Error saving review: ' + error.message);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      customerName: review.customerName || '',
      customerLocation: review.customerLocation || '',
      rating: review.rating || 5,
      comment: review.comment || '',
      serviceType: review.serviceType || '',
      isFeatured: review.isFeatured !== undefined ? review.isFeatured : false,
      isApproved: review.isApproved !== undefined ? review.isApproved : true,
      isActive: review.isActive !== undefined ? review.isActive : true,
      displayOrder: review.displayOrder || 0
    });
    // Set avatar preview if review has an avatar
    if (review.customerAvatarUrl) {
      setAvatarPreview(review.customerAvatarUrl);
    } else {
      setAvatarPreview(null);
    }
    setSelectedAvatar(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.deleteReview(token, id);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerLocation: '',
      rating: 5,
      comment: '',
      serviceType: '',
      isFeatured: false,
      isApproved: true,
      isActive: true,
      displayOrder: 0
    });
    setSelectedAvatar(null);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show image cropper instead of direct preview
      setSelectedImageFile(file);
      setShowImageCropper(true);
    }
  };

  const handleCropComplete = async (croppedFile) => {
    setShowImageCropper(false);
    setSelectedImageFile(null);
    
    setSelectedAvatar(croppedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleCropCancel = () => {
    setShowImageCropper(false);
    setSelectedImageFile(null);
  };

  const removeAvatar = () => {
    setSelectedAvatar(null);
    setAvatarPreview(null);
  };

  const columns = [
    { 
      key: 'customerName', 
      label: 'Customer',
      render: (customerName, review) => (
        <div className="flex items-center space-x-3">
          {review.customerAvatarUrl && (
            <img 
              src={getImageUrl(review.customerAvatarUrl)} 
              alt={customerName}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{customerName}</div>
            <div className="text-sm text-gray-500">{review.customerLocation}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (rating) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </span>
          ))}
          <span className="ml-2 text-sm text-gray-600">({rating})</span>
        </div>
      )
    },
    { 
      key: 'comment', 
      label: 'Comment',
      render: (comment) => (
        <div className="max-w-xs truncate" title={comment}>
          {comment}
        </div>
      )
    },
    { 
      key: 'serviceType', 
      label: 'Service Type',
      render: (serviceType) => serviceType || 'N/A'
    },
    { 
      key: 'isApproved', 
      label: 'Status',
      render: (isApproved) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isApproved ? 'Approved' : 'Pending'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingReview(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Review
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingReview ? 'Edit Review' : 'Add New Review'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Location
                </label>
                <input
                  type="text"
                  value={formData.customerLocation}
                  onChange={(e) => setFormData({...formData, customerLocation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <input
                  type="text"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Airport Transfer, City Tour"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.isApproved}
                  onChange={(e) => setFormData({...formData, isApproved: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={true}>Approved</option>
                  <option value={false}>Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Review
                </label>
                <select
                  value={formData.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Avatar
              </label>
              <div className="space-y-2">
                {avatarPreview && (
                  <div className="relative">
                    <img 
                      src={avatarPreview} 
                      alt="Avatar Preview" 
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Upload a customer avatar (optional). Recommended size: 200x200px
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingReview ? 'Update Review' : 'Create Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingReview(null);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        title=""
        data={reviews}
        loading={loading}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(0);
        }}
        itemName="reviews"
      />

      {/* Image Cropper Modal */}
      {showImageCropper && selectedImageFile && (
        <ImageCropper
          imageFile={selectedImageFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1/1}
          quality={0.95}
          maxWidth={400}
          maxHeight={400}
        />
      )}
    </div>
  );
};

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.getUsers(token, currentPage, pageSize);
      if (response.content) {
        // Paginated response
        setUsers(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        // Non-paginated response (fallback)
        setUsers(Array.isArray(response) ? response : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(response) ? response.length : 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(token, editingUser.id, formData);
      } else {
        await api.createUser(token, formData);
      }
      setShowForm(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '', // Don't populate password for security
      role: user.roles?.[0]?.name === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(token, id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'USER'
    });
  };

  const columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'roles', 
      label: 'Role',
      render: (roles) => {
        const roleNames = roles?.map(role => {
          if (role.name === 'ROLE_ADMIN') return 'Admin';
          if (role.name === 'ROLE_USER') return 'User';
          return role.name;
        }).join(', ');
        return roleNames || 'User';
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingUser(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New User
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        title=""
        data={users}
        loading={loading}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(0);
        }}
        itemName="users"
      />
    </div>
  );
};

const FAQManagement = () => {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    isActive: true
  });

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await api.getFAQs(token, currentPage, pageSize);
      if (response.content) {
        // Paginated response
        setFaqs(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        // Non-paginated response (fallback)
        setFaqs(Array.isArray(response) ? response : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(response) ? response.length : 0);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [currentPage, pageSize]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFAQ) {
        await api.updateFAQ(token, editingFAQ.id, formData);
      } else {
        await api.createFAQ(token, formData);
      }
      setShowForm(false);
      setEditingFAQ(null);
      resetForm();
      fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || '',
      isActive: faq.isActive !== undefined ? faq.isActive : true
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await api.deleteFAQ(token, id);
        fetchFAQs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      isActive: true
    });
  };

  const columns = [
    { key: 'question', label: 'Question' },
    { key: 'answer', label: 'Answer' },
    { key: 'category', label: 'Category' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (isActive) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingFAQ(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New FAQ
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="General"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingFAQ ? 'Update FAQ' : 'Create FAQ'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingFAQ(null);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        title=""
        data={faqs}
        loading={loading}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(0);
        }}
        itemName="FAQs"
      />
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'features', label: 'Features', icon: Star },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'features':
        return <FeatureManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'users':
        return <UserManagement />;
      case 'faqs':
        return <FAQManagement />;
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-center h-16 bg-yellow-600 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-white" />
            <span className="text-white text-lg font-bold">CALI GOLD</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-yellow-100 text-yellow-900 border-r-4 border-yellow-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 space-y-3">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
          
          {/* Developer Credit */}
          <div className="px-4 py-2 text-center border-t border-gray-100">
                                      <div className="text-center">
               <span className="text-gray-500 text-xs">Created with precision and purpose by</span>
               <a 
                 href="https://wa.me/972594262092" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-yellow-600 hover:text-yellow-700 transition-colors text-xs font-medium hover:underline ml-1"
               >
                 A. Alarjah
               </a>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Bar */}
        <header className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="p-2 rounded-md text-gray-700 lg:hidden hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0 capitalize">
                {activeTab === 'faqs' ? 'FAQs' : activeTab}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <div className="h-10 w-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Root App Component
const AdminDashboard = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AdminDashboard;