import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import your existing components with correct paths
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Partners from './pages/Partners';
import Clients from './pages/Clients';
import Analytics from './pages/Analytics';
import Transactions from './pages/Transactions';
import Layout from './components/layout/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Coming Soon Component for unimplemented pages
const ComingSoon = ({ page }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
      <span className="text-white text-2xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      {page} - Coming Soon
    </h2>
    <p className="text-gray-600 max-w-md">
      We're working hard to bring you this feature. It will be available in the next update!
    </p>
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <p className="text-sm text-blue-800">
        <strong>Status:</strong> In Development<br />
        <strong>Expected:</strong> Next Release
      </p>
    </div>
  </div>
);

// 404 Not Found Component
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
      <span className="text-red-600 text-2xl">❌</span>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      Page Not Found
    </h2>
    <p className="text-gray-600 max-w-md mb-6">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <button 
      onClick={() => window.history.back()}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Go Back
    </button>
  </div>
);

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes with Layout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          } 
        >
          {/* Nested routes inside the layout */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="partners" element={<Partners />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="clients" element={<Clients />} />
          <Route path="analytics" element={<Analytics />} />
          
          {/* New Finance Pages */}
          <Route path="expenses" element={<ComingSoon page="Expenses" />} />
          <Route path="investments" element={<ComingSoon page="Investments" />} />
          <Route path="distributions" element={<ComingSoon page="Distributions" />} />
          
          {/* Business Pages */}
          <Route path="projects" element={<ComingSoon page="Projects" />} />
          
          {/* Reports Pages */}
          <Route path="reports" element={<ComingSoon page="Financial Reports" />} />
          
          {/* Tools Pages */}
          <Route path="calendar" element={<ComingSoon page="Calendar" />} />
          <Route path="banking" element={<ComingSoon page="Banking" />} />
          <Route path="advances" element={<ComingSoon page="Advances" />} />
          
          {/* Admin Pages */}
          <Route path="users" element={<ComingSoon page="User Management" />} />
          <Route path="settings" element={<ComingSoon page="Settings" />} />
          
          {/* Legacy Routes - Still Coming Soon */}
          <Route path="invoices" element={<ComingSoon page="Invoices" />} />
          <Route path="estimates" element={<ComingSoon page="Estimates" />} />
          <Route path="bills" element={<ComingSoon page="Bills" />} />
          <Route path="vendors" element={<ComingSoon page="Vendors" />} />
          <Route path="profit-sharing" element={<ComingSoon page="Profit Sharing" />} />
          <Route path="notifications" element={<ComingSoon page="Notifications" />} />
          <Route path="profile" element={<ComingSoon page="Profile" />} />
          <Route path="help" element={<ComingSoon page="Help & Support" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;