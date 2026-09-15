import React, { useState, useEffect } from 'react';
import { meetingAPI } from '../services/api';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { Plus, Search, Filter, MapPin, ArrowRight } from 'lucide-react';

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await meetingAPI.getMeetings({ search, status: statusFilter });
      if (res.success) setMeetings(res.data);
    } catch (err) {
      console.error('Failed to fetch meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [search, statusFilter]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Meetings &amp; Visits</h1>
          <p className="page-subtitle">
            Manage lifecycle transitions, visit check-ins, outcomes, and audit logs.
          </p>
        </div>
        <Link to="/meetings/new" className="btn btn-primary self-start sm:self-auto">
          <Plus size={18} />
          Schedule Visit
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="card mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              className="form-control pl-10"
              placeholder="Search by meeting purpose or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400 flex-shrink-0" />
            <select
              className="form-control w-full sm:w-56"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Lifecycle States</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress / Checked In</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meetings Table */}
      <div className="card p-0 sm:p-2">
        {loading ? (
          <div className="empty-state">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="empty-state">No meetings found matching current filters.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer &amp; Contact</th>
                  <th>Purpose</th>
                  <th>Scheduled Time</th>
                  <th>Assigned Rep</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{m.customer?.companyName}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Contact: {m.contact?.name}</div>
                    </td>
                    <td>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{m.purpose}</div>
                      <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <MapPin size={13} /> {m.location?.address}
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {new Date(m.scheduledStartTime).toLocaleDateString()}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(m.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' – '}
                        {new Date(m.scheduledEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{m.assignedTo?.name}</div>
                    </td>
                    <td>
                      <StatusBadge status={m.status} subStatus={m.subStatus} />
                    </td>
                    <td>
                      <Link to={`/meetings/${m._id}`} className="btn btn-secondary btn-sm">
                        Details <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingList;
