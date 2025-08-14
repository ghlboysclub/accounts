import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);
const RoleContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // For demo, let's directly authenticate without API
      if (credentials.email === 'admin@ghlboysclub.com' && credentials.password === 'admin123') {
        const mockUser = {
          id: 1,
          email: credentials.email,
          name: 'Admin User',
          role: 'admin'
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        navigate('/dashboard');
        return true;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Role-based helper functions
  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => roles.includes(user?.role);
  const isAdmin = () => hasRole('admin');
  const isPartner = () => hasRole('partner');

  // Role context value
  const roleValue = {
    hasRole,
    hasAnyRole,
    isAdmin,
    isPartner
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      <RoleContext.Provider value={roleValue}>
        {children}
      </RoleContext.Provider>
    </AuthContext.Provider>
  );
};

// Custom hooks
export const useAuth = () => useContext(AuthContext);
export const useRole = () => useContext(RoleContext);

export default AuthProvider;