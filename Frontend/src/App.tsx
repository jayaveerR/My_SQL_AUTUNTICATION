import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './ux/ToastProvider';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { SEO } from './components/shared/SEO';

import Auth from './pages/Auth';

import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CustomerDashboard from './pages/CustomerDashboard';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import { AdminLayout } from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import { SellerLayout } from './layouts/SellerLayout';
import SellerDashboard from './pages/seller/Dashboard';
import { CustomerLayout } from './layouts/CustomerLayout';
import { ROUTES } from './constants';

const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} />;
  }
  if (allowedRoles && user) {
    const normalizedRole = user.role?.trim().toUpperCase() || 'CUSTOMER';
    if (!allowedRoles.includes(normalizedRole)) {
      return <Navigate to="/" replace />;
    }
  }
  return <>{children}</>;
};

const RootRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH} replace />;
  
  const normalizedRole = user?.role?.trim().toUpperCase() || 'CUSTOMER';
  if (normalizedRole === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
  if (normalizedRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  
  return <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SEO />
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Route */}
              <Route path={ROUTES.AUTH} element={
                <div className="min-h-screen flex flex-col relative z-10 overflow-hidden bg-brand-darkest text-brand-lightest">
                  <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#076653]/10 blur-[120px] pointer-events-none" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E3EF26]/5 blur-[120px] pointer-events-none" />
                  <Auth />
                </div>
              } />

              {/* Seller Protected Routes */}
              <Route path="/seller" element={
                <ProtectedRoute allowedRoles={['SELLER']}>
                  <SellerLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<SellerDashboard />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Global Entry Router */}
              <Route path="/" element={<RootRouter />} />

              {/* Layout Routes */}
              <Route element={<CustomerLayout />}>
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:slug" element={<ProductDetails />} />
                




                {/* Shared Protected Pages */}
                <Route path={ROUTES.PROFILE} element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path={ROUTES.SETTINGS} element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
