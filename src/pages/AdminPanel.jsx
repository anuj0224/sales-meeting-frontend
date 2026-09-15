import React, { useState, useEffect } from 'react';
import { analyticsAPI, userAPI } from '../services/api';
import { ShieldCheck, Users } from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.getAdminStats(), userAPI.getUsers()])
      .then(([statsRes, userRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (userRes.success) setUsers(userRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container empty-state">Loading Admin Panel...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShieldCheck size={26} className="text-emerald-500" />
            System Administration &amp; Governance
          </h1>
          <p className="page-subtitle">
            Full administrative oversight, system metric telemetry, and user access control.
          </p>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <span className="section-label">TOTAL USERS</span>
          <div className="text-2xl font-extrabold mt-1" style={{ color: 'var(--accent-blue)' }}>{stats?.totalUsers}</div>
        </div>
        <div className="card">
          <span className="section-label">ACCOUNTS / CUSTOMERS</span>
          <div className="text-2xl font-extrabold mt-1" style={{ color: 'var(--accent-cyan)' }}>{stats?.totalCustomers}</div>
        </div>
        <div className="card">
          <span className="section-label">SYSTEM MEETINGS</span>
          <div className="text-2xl font-extrabold mt-1" style={{ color: 'var(--accent-amber)' }}>{stats?.totalMeetings}</div>
        </div>
        <div className="card">
          <span className="section-label">FOLLOW-UP ACTIONS</span>
          <div className="text-2xl font-extrabold mt-1" style={{ color: 'var(--accent-purple)' }}>{stats?.totalFollowUps}</div>
        </div>
      </div>

      {/* User Directory */}
      <div className="card">
        <h3 className="card-title mb-4">
          <Users size={18} className="text-emerald-500" />
          System User Accounts ({users.length})
        </h3>
        <div className="table-responsive">
          <table className="table text-xs sm:text-sm">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Department</th>
                <th>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td><strong style={{ color: 'var(--text-primary)' }}>{u.name}</strong></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td><span className="badge badge-scheduled">{u.role}</span></td>
                  <td>{u.department}</td>
                  <td><span className="badge badge-completed">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
