import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, User, Briefcase, Zap, AlertCircle, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, quickLogin, error } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    const result = await quickLogin(role);
    setLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', padding: '1rem', position: 'relative' }}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="btn btn-secondary btn-sm"
        style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontSize: '0.8rem' }}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} />}
        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', background: '#3b82f6', padding: '0.75rem', borderRadius: '14px', marginBottom: '0.75rem' }}>
            <Briefcase size={30} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>OPTRONIX</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Sales Meeting & Visit Management System
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@optronix.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In to Portal'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', letterSpacing: '0.04em' }}>
            <Zap size={14} color="#f59e0b" />
            1-CLICK DEMO LOGIN (PRE-CONFIGURED ROLES)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => handleQuickLogin('Sales Employee')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', padding: '0.65rem 0.85rem' }}
            >
              <User size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
              <span>Login as <strong>Sales Employee</strong> (employee@optronix.com)</span>
            </button>
            <button
              onClick={() => handleQuickLogin('Sales Manager')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', padding: '0.65rem 0.85rem' }}
            >
              <Briefcase size={16} color="#a855f7" style={{ flexShrink: 0 }} />
              <span>Login as <strong>Sales Manager</strong> (manager@optronix.com)</span>
            </button>
            <button
              onClick={() => handleQuickLogin('Admin')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', padding: '0.65rem 0.85rem' }}
            >
              <Shield size={16} color="#10b981" style={{ flexShrink: 0 }} />
              <span>Login as <strong>Admin</strong> (admin@optronix.com)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
