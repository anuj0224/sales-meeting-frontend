import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MeetingList from './pages/MeetingList';
import MeetingDetail from './pages/MeetingDetail';
import MeetingCreateEdit from './pages/MeetingCreateEdit';
import CustomerManagement from './pages/CustomerManagement';
import TeamActivity from './pages/TeamActivity';
import AdminPanel from './pages/AdminPanel';
import FollowUps from './pages/FollowUps';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <div className="main-content">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings"
              element={
                <ProtectedRoute>
                  <MeetingList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings/new"
              element={
                <ProtectedRoute>
                  <MeetingCreateEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings/:id"
              element={
                <ProtectedRoute>
                  <MeetingDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <CustomerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/followups"
              element={
                <ProtectedRoute>
                  <FollowUps />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team-activity"
              element={
                <ProtectedRoute allowedRoles={['Sales Manager', 'Admin']}>
                  <TeamActivity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
