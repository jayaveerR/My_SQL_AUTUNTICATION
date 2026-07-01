import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ToastProvider } from '../ux/ToastProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // RBAC: Only allow ADMINS
  if (!user || user.role?.trim().toUpperCase() !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-200 flex selection:bg-red-500 selection:text-white">
      <ToastProvider>
        <ErrorBoundary>
          
          {/* Sidebar (Desktop Fixed) */}
          <AdminSidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
            <AdminNavbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            
            <main className="flex-1 p-6 lg:p-10 overflow-x-hidden relative">
              {/* Subtle Red Ambient Glow for Admin Vibe */}
              <div className="absolute top-0 left-0 w-full h-[500px] bg-red-500/5 blur-[150px] pointer-events-none -z-10" />
              <Outlet />
            </main>
          </div>

          {/* Mobile Overlay */}
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
