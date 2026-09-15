import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Users, Building2, CheckSquare, ShieldCheck, X, Zap } from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, quickLogin } = useAuth();
  const isManagerOrAdmin = ['Sales Manager', 'Admin'].includes(user?.role);
  const isAdmin = user?.role === 'Admin';

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            zIndex: 49,
            backdropFilter: 'blur(2px)'
          }}
          className="md:hidden"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#3b82f6', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>
              OP
            </div>
            <span>OPTRONIX</span>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={closeMobile}
            className="btn btn-secondary btn-sm md:hidden"
            style={{ padding: '0.3rem 0.4rem' }}
          >
            <X size={16} />
          </button>
        </div>

        <ul className="sidebar-menu" style={{ flex: 1 }}>
          <li>
            <NavLink to="/" onClick={closeMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/meetings" onClick={closeMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Calendar size={18} />
              <span>Meetings &amp; Visits</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/customers" onClick={closeMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span>Customers &amp; Accounts</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/followups" onClick={closeMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CheckSquare size={18} />
              <span>Follow-up Actions</span>
            </NavLink>
          </li>

          {isManagerOrAdmin && (
            <li>
              <NavLink to="/team-activity" onClick={closeMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Users size={18} />
                <span>Team Activity</span>
              </NavLink>
            </li>
          )}

          {isAdmin && (
            <li>
              <NavLink to="/admin" onClick={closeMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <ShieldCheck size={18} />
                <span>Admin Panel</span>
              </NavLink>
            </li>
          )}
        </ul>

        {/* Mobile-only Quick Role Switcher at bottom of sidebar */}
        <div className="lg:hidden" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Zap size={12} color="#f59e0b" /> Quick Demo Role:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button onClick={() => { quickLogin('Sales Employee'); closeMobile(); }}
              className={`btn btn-sm ${user?.role === 'Sales Employee' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}>
              Sales Employee
            </button>
            <button onClick={() => { quickLogin('Sales Manager'); closeMobile(); }}
              className={`btn btn-sm ${user?.role === 'Sales Manager' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}>
              Sales Manager
            </button>
            <button onClick={() => { quickLogin('Admin'); closeMobile(); }}
              className={`btn btn-sm ${user?.role === 'Admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}>
              Admin
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
