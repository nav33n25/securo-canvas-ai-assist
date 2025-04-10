
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthenticationGuard from '@/components/auth/AuthenticationGuard';
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import ForgotPasswordPage from '@/pages/auth/forgot-password';
import ResetPasswordPage from '@/pages/auth/reset-password';
import ProfilePage from '@/pages/auth/profile';
import AdminPage from '@/pages/admin';
import TicketsPage from '@/pages/tickets';
import CreateTicketPage from '@/pages/tickets/create';
import EditTicketPage from '@/pages/tickets/[id]/edit';
import TicketPage from '@/pages/tickets/[id]';
import TicketsAnalyticsPage from '@/pages/tickets/analytics';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<AuthenticationGuard><ProfilePage /></AuthenticationGuard>} />
          <Route path="/profile" element={<AuthenticationGuard><ProfilePage /></AuthenticationGuard>} />
          <Route path="/admin" element={<AuthenticationGuard><AdminPage /></AuthenticationGuard>} />
          
          {/* Ticket Routes */}
          <Route path="/tickets" element={<AuthenticationGuard><TicketsPage /></AuthenticationGuard>} />
          <Route path="/tickets/create" element={<AuthenticationGuard><CreateTicketPage /></AuthenticationGuard>} />
          <Route path="/tickets/:id" element={<AuthenticationGuard><TicketPage /></AuthenticationGuard>} />
          <Route path="/tickets/:id/edit" element={<AuthenticationGuard><EditTicketPage /></AuthenticationGuard>} />
          
          {/* New route for ticket analytics */}
          <Route path="/tickets/analytics" element={<AuthenticationGuard><TicketsAnalyticsPage /></AuthenticationGuard>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
