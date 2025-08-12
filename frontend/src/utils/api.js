// frontend/src/utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API utility functions
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get authorization header
  getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// Authentication API calls
export const authAPI = {
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (userData) => apiClient.post('/api/auth/register', userData),
  refreshToken: () => apiClient.post('/api/auth/refresh'),
  logout: () => apiClient.post('/api/auth/logout'),
  me: () => apiClient.get('/api/auth/me'),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => apiClient.get('/api/dashboard/stats'),
  getRecentTransactions: (limit = 10) => 
    apiClient.get('/api/dashboard/recent-transactions', { limit }),
  getRevenueTrends: (period = '30d') => 
    apiClient.get('/api/dashboard/revenue-trends', { period }),
};

// Clients API calls
export const clientsAPI = {
  getAll: (params = {}) => apiClient.get('/api/clients', params),
  getById: (id) => apiClient.get(`/api/clients/${id}`),
  create: (clientData) => apiClient.post('/api/clients', clientData),
  update: (id, clientData) => apiClient.put(`/api/clients/${id}`, clientData),
  delete: (id) => apiClient.delete(`/api/clients/${id}`),
  search: (query) => apiClient.get('/api/clients/search', { q: query }),
};

// Transactions API calls
export const transactionsAPI = {
  getAll: (params = {}) => apiClient.get('/api/transactions', params),
  getById: (id) => apiClient.get(`/api/transactions/${id}`),
  create: (transactionData) => apiClient.post('/api/transactions', transactionData),
  update: (id, transactionData) => apiClient.put(`/api/transactions/${id}`, transactionData),
  delete: (id) => apiClient.delete(`/api/transactions/${id}`),
  getByClient: (clientId, params = {}) => 
    apiClient.get(`/api/transactions/client/${clientId}`, params),
};

// Analytics API calls
export const analyticsAPI = {
  getOverview: (period = '30d') => apiClient.get('/api/analytics/overview', { period }),
  getRevenueAnalysis: (params = {}) => apiClient.get('/api/analytics/revenue', params),
  getClientAnalysis: (params = {}) => apiClient.get('/api/analytics/clients', params),
  getExpenseAnalysis: (params = {}) => apiClient.get('/api/analytics/expenses', params),
  exportData: (type, params = {}) => 
    apiClient.get(`/api/analytics/export/${type}`, params),
};

// Reports API calls
export const reportsAPI = {
  generate: (type, params = {}) => apiClient.post(`/api/reports/generate/${type}`, params),
  getAll: (params = {}) => apiClient.get('/api/reports', params),
  download: (reportId) => apiClient.get(`/api/reports/${reportId}/download`),
  delete: (reportId) => apiClient.delete(`/api/reports/${reportId}`),
};

// Error handling utility
export const handleApiError = (error, showNotification) => {
  console.error('API Error:', error);
  
  if (error.message.includes('401')) {
    // Handle authentication errors
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return;
  }

  if (error.message.includes('403')) {
    showNotification && showNotification('error', 'Access denied. You do not have permission to perform this action.');
    return;
  }

  if (error.message.includes('404')) {
    showNotification && showNotification('error', 'The requested resource was not found.');
    return;
  }

  if (error.message.includes('500')) {
    showNotification && showNotification('error', 'Server error. Please try again later.');
    return;
  }

  // Generic error
  showNotification && showNotification('error', error.message || 'An unexpected error occurred.');
};