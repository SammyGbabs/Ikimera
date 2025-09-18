import React, { useState, useEffect } from 'react';
import { Camera, History, Cloud, User, Upload, LogIn, UserPlus } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import DiagnoseTab from './components/DiagnoseTab';
import HistoryTab from './components/HistoryTab';
import WeatherTab from './components/WeatherTab';
import ProfileTab from './components/ProfileTab';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('diagnose');
  const { user, isAuthenticated } = useAuth();

  const tabs = [
    { id: 'diagnose', label: 'Diagnose', icon: Camera },
    { id: 'history', label: 'History', icon: History },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🌾 Ikimera</h1>
            <p>Smart Farming Assistant</p>
          </div>
          <div className="user-info">
            <span>Hello, {user?.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'diagnose' && <DiagnoseTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'weather' && <WeatherTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent size={24} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;