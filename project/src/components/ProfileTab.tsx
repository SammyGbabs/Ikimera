import React from 'react';
import { User, LogOut, Settings, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileTab = () => {
  const { user, logout } = useAuth();

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <User size={24} />
          <h2>Profile</h2>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3>{user?.name}</h3>
          <p style={{ color: 'var(--neutral-600)', textTransform: 'capitalize' }}>
            {user?.role}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Mail size={16} style={{ marginRight: '8px' }} />
            Email
          </label>
          <p>{user?.email}</p>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Phone size={16} style={{ marginRight: '8px' }} />
            Phone
          </label>
          <p>{user?.phone}</p>
        </div>

        <div style={{ marginTop: '32px' }}>
          <button
            onClick={logout}
            className="btn btn-danger"
            style={{ width: '100%' }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', color: 'var(--neutral-700)' }}>About Ikimera</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: '1.6' }}>
          Ikimera is a smart farming assistant that helps farmers diagnose crop diseases using AI technology. 
          Upload photos of your crops to get instant analysis and recommendations for better farming practices.
        </p>
        
        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Features</h4>
          <ul style={{ fontSize: '0.875rem', color: 'var(--neutral-700)', paddingLeft: '16px' }}>
            <li>AI-powered crop disease diagnosis</li>
            <li>Weather forecasting for farming</li>
            <li>History tracking of all diagnoses</li>
            <li>Offline support for rural areas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;