import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SellerNavbar } from '../components/seller/SellerNavbar';
import { SellerSidebar } from '../components/seller/SellerSidebar';
import { ToastProvider } from '../ux/ToastProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { Loader } from '../ui/Loader';

export const SellerLayout: React.FC = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // RBAC: Only allow SELLERS
  if (!user || user.role?.trim().toUpperCase() !== 'SELLER') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-200 flex selection:bg-[#E3EF26] selection:text-black">
      <ToastProvider>
        <ErrorBoundary>
          
          {/* Sidebar (Desktop Fixed) */}
          <SellerSidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
            <SellerNavbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            
            <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
              <Outlet />
            </main>
          </div>

          {/* Mobile Overlay (TBD - can be added later if needed) */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

        </ErrorBoundary>
      </ToastProvider>
    </div>
  );
};
