import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { meetingAPI, followUpAPI } from '../services/api';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { Calendar, CheckSquare, Clock, Plus, ArrowRight, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetingRes, followUpRes] = await Promise.all([
          meetingAPI.getMeetings(),
          followUpAPI.getFollowUps({ status: 'Pending' })
        ]);

        if (meetingRes.success) setMeetings(meetingRes.data);
        if (followUpRes.success) setFollowUps(followUpRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const inProgressCount = meetings.filter((m) => m.status === 'In Progress' || m.status === 'Checked In').length;
  const completedCount  = meetings.filter((m) => m.status === 'Completed').length;
  const scheduledCount  = meetings.filter((m) => m.status === 'Scheduled' || m.status === 'Confirmed').length;

  if (loading) {
    return <div className="page-container empty-state">Loading Dashboard...</div>;
  }

  return (
    <div className="page-container">
      {/* Top Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name}</h1>
          <p className="page-subtitle">
            {user?.role} Workspace • Optronix Sales &amp; Visit Management
          </p>
        </div>
        <Link to="/meetings/new" className="btn btn-primary self-start sm:self-auto">
          <Plus size={18} />
          Schedule New Visit
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <div className="card">
          <div className="flex justify-between items-center">
            <span className="section-label">IN-PROGRESS VISITS</span>
            <Clock size={20} className="text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold my-2 text-amber-500">{inProgressCount}</div>
          <div className="page-subtitle">Active customer check-ins</div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center">
            <span className="section-label">UPCOMING SCHEDULED</span>
            <Calendar size={20} className="text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold my-2 text-blue-500">{scheduledCount}</div>
          <div className="page-subtitle">Scheduled / Confirmed visits</div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center">
            <span className="section-label">COMPLETED VISITS</span>
            <UserCheck size={20} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold my-2 text-emerald-500">{completedCount}</div>
          <div className="page-subtitle">With recorded outcomes</div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center">
            <span className="section-label">PENDING FOLLOW-UPS</span>
            <CheckSquare size={20} className="text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold my-2 text-purple-500">{followUps.length}</div>
          <div className="page-subtitle">Action items assigned</div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Meetings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={18} className="text-blue-500" />
              Recent Meetings &amp; Visits
            </h3>
            <Link to="/meetings" className="card-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {meetings.length === 0 ? (
            <div className="empty-state">No meetings scheduled yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {meetings.slice(0, 4).map((m) => (
                <div key={m._id} className="list-item">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>{m.purpose}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      🏢 {m.customer?.companyName || 'Customer'} • 👤 {m.contact?.name || 'Contact'}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                      📅 {new Date(m.scheduledStartTime).toLocaleString()}
                    </div>
                  </div>
                  <div className="item-actions">
                    <StatusBadge status={m.status} subStatus={m.subStatus} />
                    <Link to={`/meetings/${m._id}`} className="btn btn-secondary btn-sm">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Follow-ups */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <CheckSquare size={18} className="text-purple-500" />
              Pending Follow-up Tasks
            </h3>
            <Link to="/followups" className="card-link">
              Manage <ArrowRight size={14} />
            </Link>
          </div>

          {followUps.length === 0 ? (
            <div className="empty-state">No pending follow-ups assigned.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {followUps.slice(0, 4).map((f) => (
                <div key={f._id} className="list-item">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Priority:{' '}
                      <span
                        className="font-semibold"
                        style={{ color: f.priority === 'Urgent' ? '#f43f5e' : f.priority === 'High' ? '#f59e0b' : '#3b82f6' }}
                      >
                        {f.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Due: {new Date(f.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge ${f.status === 'Completed' ? 'badge-completed' : f.status === 'In Progress' ? 'badge-in-progress' : 'badge-scheduled'} self-start sm:self-auto`}>
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
