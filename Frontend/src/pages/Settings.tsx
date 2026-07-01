import React from 'react';

const Settings: React.FC = () => {
  return (
    <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>Settings</h2>
        <p style={{ color: '#666' }}>Manage your account settings and preferences here.</p>
        
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#444' }}>Notifications</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked />
            <span>Receive email updates</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
