import React, { useState, useEffect } from 'react';
import { analyticsAPI, meetingAPI } from '../services/api';
import ReopenModal from '../components/ReopenModal';
import { Users, RefreshCw } from 'lucide-react';

const TeamActivity = () => {
  const [data, setData] = useState(null);
  const [completedMeetings, setCompletedMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeetingToReopen, setSelectedMeetingToReopen] = useState(null);

  const fetchData = async () => {
    try {
      const [activityRes, meetingsRes] = await Promise.all([
        analyticsAPI.getTeamActivity(),
        meetingAPI.getMeetings({ status: 'Completed' })
      ]);
      if (activityRes.success) setData(activityRes.data);
      if (meetingsRes.success) setCompletedMeetings(meetingsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReopenSubmit = async (reason) => {
    if (!selectedMeetingToReopen) return;
    try {
      const res = await meetingAPI.reopen(selectedMeetingToReopen._id, reason);
      if (res.success) { setSelectedMeetingToReopen(null); fetchData(); }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="page-container empty-state">Loading team activity metrics...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Team Activity &amp; Oversight</h1>
          <p className="page-subtitle">
            Manager-level dashboard monitoring representative visits, outcomes, and meeting reopening privileges.
          </p>
        </div>
      </div>

      {/* Rep Performance Summary */}
      <div className="card mb-6">
        <h3 className="card-title mb-4">
          <Users size={18} className="text-blue-500" />
          Representative Activity Breakdown
        </h3>
        <div className="table-responsive">
          <table className="table text-xs sm:text-sm">
            <thead>
              <tr>
                <th>Sales Representative</th>
                <th>Role</th>
                <th>Total Assigned Meetings</th>
                <th>In Progress Visits</th>
                <th>Completed Visits</th>
              </tr>
            </thead>
            <tbody>
              {data?.repActivity?.map((rep) => (
                <tr key={rep._id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{rep.name}</strong>{' '}
                    <span style={{ color: 'var(--text-muted)' }}>({rep.email})</span>
                  </td>
                  <td><span className="badge badge-scheduled">{rep.role}</span></td>
                  <td>{rep.totalMeetings}</td>
                  <td><span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{rep.inProgressMeetings}</span></td>
                  <td><span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{rep.completedMeetings}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Meetings – Manager Reopening */}
      <div className="card">
        <h3 className="card-title mb-2" style={{ color: 'var(--accent-purple)' }}>
          <RefreshCw size={18} /> Completed Meetings (Manager Reopening Access)
        </h3>
        <p className="page-subtitle mb-4">
          As a Sales Manager or Admin, you possess authority to reopen completed meetings for secondary visits or outcome revision.
        </p>

        <div className="table-responsive">
          <table className="table text-xs sm:text-sm">
            <thead>
              <tr>
                <th>Customer &amp; Purpose</th>
                <th>Sales Rep</th>
                <th>Recorded Outcome</th>
                <th>Completed Time</th>
                <th>Manager Action</th>
              </tr>
            </thead>
            <tbody>
              {completedMeetings.map((m) => (
                <tr key={m._id}>
                  <td>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{m.purpose}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>🏢 {m.customer?.companyName}</div>
                  </td>
                  <td>{m.assignedTo?.name}</td>
                  <td><span className="badge badge-completed">{m.outcome?.result || 'Completed'}</span></td>
                  <td className="text-xs" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {m.outcome?.recordedAt ? new Date(m.outcome.recordedAt).toLocaleString() : 'N/A'}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedMeetingToReopen(m)}
                      className="btn btn-secondary btn-sm"
                      style={{ borderColor: 'rgba(168,85,247,0.4)', color: 'var(--accent-purple)' }}
                    >
                      <RefreshCw size={14} /> Reopen Meeting
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMeetingToReopen && (
        <ReopenModal
          meeting={selectedMeetingToReopen}
          onClose={() => setSelectedMeetingToReopen(null)}
          onConfirm={handleReopenSubmit}
        />
      )}
    </div>
  );
};

export default TeamActivity;
