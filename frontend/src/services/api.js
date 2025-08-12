import axios from 'axios';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://accounts-api.ghlboysclub.workers.dev'
  : 'https://accounts-api.ghlboysclub.workers.dev'; // Use production API for both dev and prod

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add token to requests if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    // Log API calls in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        headers: config.headers
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data
      });
    }

    return response;
  },
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0;
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - but don't auto-logout from every page
      const currentPath = window.location.pathname;
      
      // Only redirect to login if we're on certain critical pages
      if (currentPath === '/login' || currentPath === '/') {
        return Promise.reject(error);
      }
      
      // For other pages, show error but don't auto-logout
      const errorMessage = 'Authentication required for this action.';
      console.warn('API 401 Error:', errorMessage);
      
      // Don't redirect automatically - let the page handle it
      toast.error(errorMessage);
      
    } else if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 429) {
      // Rate limited
      toast.error('Too many requests. Please wait a moment and try again.');
    } else if (error.response?.status >= 500) {
      // Server error
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      toast.error('Request timeout. Please check your connection and try again.');
    } else if (!error.response) {
      // Network error
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// API Service functions
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/api/auth/login', credentials),
    logout: () => api.post('/api/auth/logout'),
    register: (userData) => api.post('/api/auth/register', userData),
    me: () => api.get('/api/auth/me'),
    refreshToken: () => api.post('/api/auth/refresh')
  },

  // Dashboard endpoints
  dashboard: {
    getStats: () => api.get('/api/dashboard'),
    getRecentTransactions: (limit = 10) => api.get(`/api/dashboard/recent-transactions?limit=${limit}`),
    getRevenueChart: (period = '6months') => api.get(`/api/dashboard/revenue-chart?period=${period}`)
  },

  // Partners endpoints
  partners: {
    getAll: () => api.get('/api/partners'),
    getById: (id) => api.get(`/api/partners/${id}`),
    create: (data) => api.post('/api/partners', data),
    update: (id, data) => api.put(`/api/partners/${id}`, data),
    delete: (id) => api.delete(`/api/partners/${id}`),
    getTransactions: (id) => api.get(`/api/partners/${id}/transactions`)
  },

  // Clients endpoints
  clients: {
    getAll: () => api.get('/api/clients'),
    getById: (id) => api.get(`/api/clients/${id}`),
    create: (data) => api.post('/api/clients', data),
    update: (id, data) => api.put(`/api/clients/${id}`, data),
    delete: (id) => api.delete(`/api/clients/${id}`),
    getProjects: (id) => api.get(`/api/clients/${id}/projects`)
  },

  // Transactions endpoints
  transactions: {
    getAll: (params = {}) => api.get('/api/transactions', { params }),
    getById: (id) => api.get(`/api/transactions/${id}`),
    create: (data) => api.post('/api/transactions', data),
    update: (id, data) => api.put(`/api/transactions/${id}`, data),
    delete: (id) => api.delete(`/api/transactions/${id}`),
    approve: (id) => api.post(`/api/transactions/${id}/approve`),
    reject: (id) => api.post(`/api/transactions/${id}/reject`)
  },

  // Projects endpoints
  projects: {
    getAll: () => api.get('/api/projects'),
    getById: (id) => api.get(`/api/projects/${id}`),
    create: (data) => api.post('/api/projects', data),
    update: (id, data) => api.put(`/api/projects/${id}`, data),
    delete: (id) => api.delete(`/api/projects/${id}`)
  },

  // Users endpoints (Admin only)
  users: {
    getAll: () => api.get('/api/users'),
    getById: (id) => api.get(`/api/users/${id}`),
    create: (data) => api.post('/api/users', data),
    update: (id, data) => api.put(`/api/users/${id}`, data),
    delete: (id) => api.delete(`/api/users/${id}`),
    updateRole: (id, role) => api.put(`/api/users/${id}/role`, { role })
  },

  // Health check
  health: () => api.get('/health')
};

// Utility functions
export const apiUtils = {
  // Format error messages
  getErrorMessage: (error) => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Check if error is network related
  isNetworkError: (error) => {
    return !error.response && error.code !== 'ECONNABORTED';
  },

  // Check if error is timeout
  isTimeoutError: (error) => {
    return error.code === 'ECONNABORTED';
  },

  // Format currency
  formatCurrency: (amount, currency = 'PKR') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'PKR' ? 'USD' : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    if (currency === 'PKR') {
      return `${formatter.format(amount).replace('$', '')} PKR`;
    }
    
    return formatter.format(amount);
  },

  // Format percentage
  formatPercentage: (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  },

  // Format date
  formatDate: (date, format = 'short') => {
    const d = new Date(date);
    
    if (format === 'short') {
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    if (format === 'long') {
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return d.toLocaleDateString();
  },

  // Format time ago
  formatTimeAgo: (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    return past.toLocaleDateString();
  }
};

export default api;