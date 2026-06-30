import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card" 
        style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}
      >
        <h1 style={{ margin: '0 0 16px 0', fontSize: '32px' }}>
          Welcome back, <span style={{ color: 'var(--accent)' }}>{user?.firstName}</span>!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '32px' }}>
          You have successfully authenticated using the OTP flow.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)' }}>Email</h3>
            <p style={{ margin: 0, fontSize: '18px' }}>{user?.email}</p>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)' }}>Status</h3>
            <p style={{ margin: 0, fontSize: '18px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
              Verified Account
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
