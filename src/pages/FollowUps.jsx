import React, { useState, useEffect } from 'react';
import { followUpAPI } from '../services/api';
import { CheckSquare, Clock, CheckCircle2, Filter } from 'lucide-react';

const priorityColor = (priority) => {
  switch (priority) {
    case 'Urgent': return '#f43f5e';
    case 'High':   return '#f59e0b';
    case 'Medium': return '#3b82f6';
    default:       return '#64748b';
  }
};

const FollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const res = await followUpAPI.getFollowUps(statusFilter ? { status: statusFilter } : {});
      if (res.success) setFollowUps(res.data);
    } catch (err) {
      console.error('Failed to fetch follow-ups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFollowUps(); }, [statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(id);
    try {
      const res = await followUpAPI.updateStatus(id, newStatus);
      if (res.success) fetchFollowUps();
    } catch (err) {
      console.error('Failed to update follow-up status:', err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Follow-up Action Items</h1>
          <p className="page-subtitle">
            Track and manage post-meeting tasks, proposals, and commitments.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card mb-6 p-4">
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-slate-400 flex-shrink-0" />
          <select
            className="form-control w-full sm:w-56"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Follow-up Tasks</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="card p-0 sm:p-2">
        {loading ? (
          <div className="empty-state">Loading follow-up tasks...</div>
        ) : followUps.length === 0 ? (
          <div className="empty-state">No follow-up tasks found.</div>
        ) : (
          <div className="flex flex-col gap-3 p-4">
            {followUps.map((f) => (
              <div key={f._id} className="list-item">
                <div className="flex-1 min-w-0">
                  {/* Title + priority badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${priorityColor(f.priority)}22`,
                        color: priorityColor(f.priority),
                        border: `1px solid ${priorityColor(f.priority)}44`,
                      }}
                    >
                      {f.priority}
                    </span>
                  </div>

                  {f.description && (
                    <div className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>{f.description}</div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {f.owner?.name && (
                      <span className="flex items-center gap-1"><CheckSquare size={12} /> {f.owner.name}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Due: {f.dueDate ? new Date(f.dueDate).toLocaleDateString() : 'N/A'}
                    </span>
                    {f.meeting?.purpose && (
                      <span style={{ color: 'var(--accent-blue)' }} className="truncate">📋 {f.meeting.purpose}</span>
                    )}
                  </div>
                </div>

                {/* Status badge + action buttons */}
                <div className="item-actions">
                  <span className={`badge ${f.status === 'Completed' ? 'badge-completed' : f.status === 'In Progress' ? 'badge-in-progress' : 'badge-scheduled'}`}>
                    {f.status}
                  </span>
                  {f.status === 'Pending' && (
                    <button onClick={() => handleStatusUpdate(f._id, 'In Progress')} className="btn btn-secondary btn-sm" disabled={updating === f._id}>
                      Start
                    </button>
                  )}
                  {f.status !== 'Completed' && (
                    <button onClick={() => handleStatusUpdate(f._id, 'Completed')} className="btn btn-success btn-sm" disabled={updating === f._id}>
                      <CheckCircle2 size={14} />
                      {updating === f._id ? 'Saving…' : 'Complete'}
                    </button>
                  )}
                  {f.status === 'Completed' && (
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--accent-emerald)' }}>
                      <CheckCircle2 size={14} /> Done
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUps;
