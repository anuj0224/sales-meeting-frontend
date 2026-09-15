import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, Menu, Zap } from 'lucide-react';

const Navbar = ({ onToggleMobileMenu }) => {
  const { user, logout, quickLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="btn btn-secondary btn-sm md:hidden"
          style={{ padding: '0.35rem 0.5rem' }}
          aria-label="Toggle Mobile Menu"
        >
          <Menu size={18} />
        </button>

        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }} className="hidden sm:block">
          Sales Meeting & Visit Management System
        </h2>
        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }} className="sm:hidden">
          OPTRONIX
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Quick Demo Role Switcher */}
        <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-main)', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Zap size={14} color="#f59e0b" />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Demo:</span>
          <button
            onClick={() => quickLogin('Sales Employee')}
            className={`btn btn-sm ${user?.role === 'Sales Employee' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.725rem', padding: '0.15rem 0.45rem' }}
          >
            Rep
          </button>
          <button
            onClick={() => quickLogin('Sales Manager')}
            className={`btn btn-sm ${user?.role === 'Sales Manager' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.725rem', padding: '0.15rem 0.45rem' }}
          >
            Manager
          </button>
          <button
            onClick={() => quickLogin('Admin')}
            className={`btn btn-sm ${user?.role === 'Admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.725rem', padding: '0.15rem 0.45rem' }}
          >
            Admin
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.6rem' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} />}
        </button>

        {/* User Info & Logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ textAlign: 'right' }} className="hidden sm:block">
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--accent-blue)', fontWeight: 600 }}>{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              title="Logout"
              style={{ padding: '0.4rem 0.5rem' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
