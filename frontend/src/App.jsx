// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Clients from './pages/Clients';
import Partners from './pages/Partners';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import Expenses from './pages/Expenses';
import Investments from './pages/Investments';
import Distributions from './pages/Distributions';
import Calendar from './pages/Calendar';
import Banking from './pages/Banking';
import Advances from './pages/Advances';
import Users from './pages/Users';
import Payroll from './pages/Payroll';
import Documents from './pages/Documents';
import Communications from './pages/Communications';
import Audit from './pages/Audit';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/distributions" element={<Distributions />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/banking" element={<Banking />} />
            <Route path="/advances" element={<Advances />} />
            <Route path="/users" element={<Users />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/audit" element={<Audit />} />
          </Route>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;