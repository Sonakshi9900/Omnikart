import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { store } from './store';
import StorefrontPage from './pages/customer/StorefrontPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import AuthPage from './pages/AuthPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#111726',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                borderRadius: '16px',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<StorefrontPage />} />
            <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}
