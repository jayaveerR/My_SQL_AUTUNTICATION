import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      {/* Required CSS for responsive layout */}
      <style>{`
        .nav-links {
          display: flex;
          gap: 24px;
          font-size: 15px;
          color: var(--text-muted);
          align-items: center;
        }
        .desktop-only {
          display: flex;
        }
        .mobile-only {
          display: none;
        }
        
        /* Mobile & Tablet */
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
          .navbar-container {
            padding: 16px 20px !important;
          }
        }
      `}</style>
      
      <nav className="navbar-container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(9, 9, 11, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', letterSpacing: '-0.5px' }}>
            Auth<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div className="nav-links desktop-only">
            <Link to="/">Home</Link>
            <Link to="#">How it's Working</Link>
            <Link to="#">Help</Link>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '16px' }}>
          {isAuthenticated ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <User size={18} />
                <span>{user?.firstName} {user?.lastName}</span>
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--error)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ width: 'auto', padding: '8px 24px' }}>
              Login / Sign-in
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="mobile-only">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '4px' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mobile-only"
            style={{
              position: 'fixed',
              top: '65px', // approx height of navbar on mobile
              left: 0,
              right: 0,
              background: 'rgba(9, 9, 11, 0.98)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid var(--border)',
              zIndex: 99,
              flexDirection: 'column',
              padding: '24px',
              gap: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '16px', color: 'var(--text-muted)' }}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="#" onClick={() => setIsMobileMenuOpen(false)}>How it's Working</Link>
              <Link to="#" onClick={() => setIsMobileMenuOpen(false)}>Help</Link>
            </div>
            
            <div style={{ height: '1px', background: 'var(--border)', width: '100%' }} />
            
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
                  <User size={18} />
                  <span>{user?.firstName} {user?.lastName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: 'var(--error)',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    transition: 'all 0.2s',
                    fontWeight: 500
                  }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary" style={{ width: '100%', padding: '12px', textAlign: 'center' }}>
                Login / Sign-in
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
