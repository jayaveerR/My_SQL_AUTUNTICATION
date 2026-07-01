import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../ux/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Search, Heart, ShoppingCart, Bell, User, LogOut, 
  Settings, ShoppingBag, LayoutDashboard, Menu, X
} from 'lucide-react';
import { Button } from '../ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Navbar: React.FC = () => {
  const { user, setUser, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setIsMobileMenuOpen(false);
      setIsDropdownOpen(false);
      addToast('Logged out successfully', 'info');
      navigate('/');
    } catch (error) {
      setUser(null);
      navigate('/auth');
    }
  };

  return (
    <>
      
      <nav className="sticky top-0 z-50 w-full border-b border-[#076653]/30 bg-brand-darkest/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between gap-6">
          
          {/* Left: Logo */}
          <Link to="/" className="text-2xl font-bold text-white tracking-tight flex-shrink-0">
            Ecomm<span className="text-[#E3EF26]">Hub</span>
          </Link>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#E3EF26] transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for products, categories, or sellers..." 
              className="w-full bg-black/40 border border-[#076653]/40 rounded-full py-3 pl-12 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#E3EF26]/50 focus:border-[#E3EF26]/50 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button className="bg-[#076653]/30 hover:bg-[#076653]/50 text-[#E3EF26] px-4 py-1.5 rounded-full text-sm font-semibold transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Right: Icons & Profile */}
          <div className="flex items-center gap-4 md:gap-6">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-4 text-neutral-400">
                  <Link to="/wishlist" className="hover:text-[#E3EF26] transition-colors relative">
                    <Heart size={24} />
                  </Link>
                  <Link to="/cart" className="hover:text-[#E3EF26] transition-colors relative">
                    <ShoppingCart size={24} />
                    <span className="absolute -top-1 -right-2 bg-[#E3EF26] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                  </Link>
                  <button className="hover:text-[#E3EF26] transition-colors relative">
                    <Bell size={24} />
                  </button>
                </div>

                {/* Profile Avatar Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-full bg-[#076653]/30 border border-[#E3EF26]/30 flex items-center justify-center text-[#E3EF26] hover:bg-[#076653]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E3EF26]"
                  >
                    <span className="font-bold text-lg">{user?.firstName?.[0] || 'U'}</span>
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-14 w-64 glass-panel border-[#076653]/40 shadow-2xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10 bg-black/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#076653]/30 flex items-center justify-center text-[#E3EF26] text-xl font-bold">
                              {user?.firstName?.[0]}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-white font-semibold truncate">{user?.firstName} {user?.lastName}</span>
                              <span className="text-neutral-400 text-xs truncate">{user?.email}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="px-2 py-1 bg-[#E3EF26]/20 text-[#E3EF26] rounded-md font-medium">{user?.role}</span>
                            <span className="text-neutral-500">Member since 2026</span>
                          </div>
                        </div>

                        <div className="p-2 flex flex-col">
                          <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <User size={16} /> My Profile
                          </Link>
                          <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <ShoppingBag size={16} /> My Orders
                          </Link>
                          <Link to="/wishlist" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Heart size={16} /> Wishlist
                          </Link>
                          <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                          <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Settings size={16} /> Settings
                          </Link>
                        </div>

                        <div className="p-2 border-t border-white/10">
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/auth" className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors">Log In</Link>
                <Link to="/auth">
                  <Button className="!px-6 !py-2 text-sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[116px] left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex flex-col gap-4 text-base font-medium text-neutral-400">
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Shop</Link>
              <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Categories</Link>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Cart</Link>
            </div>
            
            <div className="h-px bg-white/10 w-full" />
            
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-full bg-[#076653]/30 border border-[#E3EF26]/30 flex items-center justify-center text-[#E3EF26] font-bold">
                    {user?.firstName?.[0]}
                  </div>
                  <span>{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="flex flex-col gap-3 pl-7 text-neutral-400">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">
                    {user?.role === 'ADMIN' ? 'Admin Panel' : user?.role === 'SELLER' ? 'Seller Portal' : 'My Dashboard'}
                  </Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Profile</Link>
                  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Settings</Link>
                </div>
                <Button variant="danger" fullWidth onClick={handleLogout} className="mt-2">
                  <LogOut size={16} className="mr-2" /> Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <Button fullWidth>Login / Sign-in</Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
