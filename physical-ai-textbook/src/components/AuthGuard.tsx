import React, { useState, useEffect } from 'react';
import { FEATURES, getBackendUrl } from '../utils/featureFlags';

interface User {
  id: string;
  email: string;
  level?: string;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('userId', data.id);
      }
    } catch {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const response = await fetch(`${getBackendUrl()}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        await fetchUser(data.token);
        setShowLoginForm(false);
        setEmail('');
        setPassword('');
      } else {
        setError(data.detail || 'Authentication failed');
      }
    } catch {
      setError('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUser(null);
  };

  // If auth feature is disabled, just render children
  if (!FEATURES.AUTH) {
    return <>{children}</>;
  }

  if (loading) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Auth button in navbar area */}
      <div className="auth-container">
        {user ? (
          <div className="auth-user-info">
            <span className="auth-email">{user.email}</span>
            {user.level && <span className="auth-level">{user.level}</span>}
            <button onClick={handleLogout} className="auth-logout-btn">Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowLoginForm(true)} className="auth-login-btn">
            🔐 Login / Register
          </button>
        )}
      </div>

      {/* Login Modal */}
      {showLoginForm && (
        <div className="auth-modal-overlay" onClick={() => setShowLoginForm(false)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <h3>{isRegister ? 'Create Account' : 'Login'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
              {error && <p className="auth-error">{error}</p>}
              <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
            </form>
            <p className="auth-toggle">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Login' : 'Register'}
              </button>
            </p>
            <button className="auth-close" onClick={() => setShowLoginForm(false)}>×</button>
          </div>
        </div>
      )}

      {children}

      <style>{`
        .auth-container {
          position: fixed;
          top: 70px;
          right: 1rem;
          z-index: 999;
        }
        .auth-login-btn {
          padding: 0.5rem 1rem;
          background: var(--ifm-color-primary);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        .auth-user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--ifm-background-color);
          padding: 0.5rem;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .auth-email { font-size: 0.8rem; }
        .auth-level {
          background: #dbeafe;
          color: #1e40af;
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.7rem;
        }
        .auth-logout-btn {
          padding: 0.25rem 0.5rem;
          background: #fee2e2;
          color: #991b1b;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
        }
        .auth-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .auth-modal {
          background: var(--ifm-background-color);
          padding: 2rem;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          position: relative;
        }
        .auth-modal h3 {
          margin: 0 0 1rem;
        }
        .auth-modal form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .auth-modal input {
          padding: 0.75rem;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 6px;
          font-size: 1rem;
        }
        .auth-modal button[type="submit"] {
          padding: 0.75rem;
          background: var(--ifm-color-primary);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }
        .auth-error {
          color: #dc2626;
          font-size: 0.875rem;
          margin: 0;
        }
        .auth-toggle {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.875rem;
        }
        .auth-toggle button {
          background: none;
          border: none;
          color: var(--ifm-color-primary);
          cursor: pointer;
          text-decoration: underline;
        }
        .auth-close {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--ifm-color-emphasis-600);
        }
      `}</style>
    </>
  );
}
