import React, { useState } from 'react';
import { Search, Bell, Menu, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface AdminNavbarProps {
  onMenuClick?: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuClick }) => {
  const { user, setUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="h-20 bg-neutral-950/80 backdrop-blur-xl border-b border-red-500/20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
      
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-white hover:text-red-400 transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center relative max-w-md w-full">
          <Search size={18} className="absolute left-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search system logs, users, or UUIDs..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Icons */}
        <div className="hidden sm:flex items-center gap-4">
          <button className="text-neutral-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>
        </div>

        <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-900 to-red-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                <Shield className="text-red-500" size={16} />
              </div>
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                {user?.firstName || 'Admin'}
              </span>
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                God Mode
              </span>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 bg-neutral-900 border border-red-500/40 rounded-xl shadow-2xl overflow-hidden py-2"
              >
                <div className="px-4 py-2 border-b border-white/5 mb-2">
                  <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut size={16} />
                  System Exit
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
};
