import React, { useState } from 'react';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.phone, formData.password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>🌾 Ikimera</h1>
        <p>Smart Farming Assistant</p>
      </div>

      <div className="auth-card">
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            <LogIn size={20} />
            Login
          </button>
          <button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            <UserPlus size={20} />
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
              placeholder="Enter your email"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Enter your phone number"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input password-input"
                required
                placeholder="Enter your password"
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? 'Login' : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="link-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          padding: calc(var(--spacing) * 2);
          justify-content: center;
        }

        .auth-header {
          text-align: center;
          color: white;
          margin-bottom: calc(var(--spacing) * 4);
        }

        .auth-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: calc(var(--spacing) * 1);
        }

        .auth-header p {
          font-size: 1.125rem;
          opacity: 0.9;
        }

        .auth-card {
          background: white;
          border-radius: calc(var(--spacing) * 3);
          padding: calc(var(--spacing) * 4);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
        }

        .auth-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--neutral-100);
          border-radius: calc(var(--spacing) * 1.5);
          padding: calc(var(--spacing) * 0.5);
          margin-bottom: calc(var(--spacing) * 3);
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: calc(var(--spacing) * 1);
          padding: calc(var(--spacing) * 1.5);
          border: none;
          background: none;
          border-radius: calc(var(--spacing) * 1);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .auth-form {
          margin-bottom: calc(var(--spacing) * 3);
        }

        .password-input-container {
          position: relative;
        }

        .password-input {
          padding-right: calc(var(--spacing) * 6);
        }

        .password-toggle {
          position: absolute;
          right: calc(var(--spacing) * 1.5);
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--neutral-500);
          cursor: pointer;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          padding: calc(var(--spacing) * 1.5);
          border-radius: calc(var(--spacing) * 1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: calc(var(--spacing) * 2);
          text-align: center;
        }

        .auth-footer {
          text-align: center;
          color: var(--neutral-600);
        }

        .link-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;