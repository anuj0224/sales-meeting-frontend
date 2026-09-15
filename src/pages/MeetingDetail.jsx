import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { meetingAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LifecycleStepper from '../components/LifecycleStepper';
import CheckInModal from '../components/CheckInModal';
import RescheduleModal from '../components/RescheduleModal';
import OutcomeModal from '../components/OutcomeModal';
import ReopenModal from '../components/ReopenModal';

import {
  Calendar, MapPin, CheckCircle2, PlayCircle, PauseCircle,
  Flag, RefreshCw, AlertCircle, FileText, History, CheckSquare
} from 'lucide-react';

const MeetingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [meeting, setMeeting] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCheckInModal,    setShowCheckInModal]    = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showOutcomeModal,    setShowOutcomeModal]    = useState(false);
  const [showReopenModal,     setShowReopenModal]     = useState(false);

  const fetchMeeting = async () => {
    try {
      const res = await meetingAPI.getById(id);
      if (res.success) setMeeting(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeeting();
    userAPI.getUsers().then(res => { if (res.success) setUsers(res.data); }).catch(console.error);
  }, [id]);

  const handleConfirm = async () => {
    try { const res = await meetingAPI.confirm(id); if (res.success) fetchMeeting(); }
    catch (err) { setError(err.message); }
  };
  const handleCheckInSubmit = async (data) => {
    try { const res = await meetingAPI.checkIn(id, data); if (res.success) { setShowCheckInModal(false); fetchMeeting(); } }
    catch (err) { setError(err.message); }
  };
  const handlePauseRescheduleSubmit = async (data) => {
    try { const res = await meetingAPI.pauseReschedule(id, data); if (res.success) { setShowRescheduleModal(false); fetchMeeting(); } }
    catch (err) { setError(err.message); }
  };
  const handleOutcomeSubmit = async (payload) => {
    try { const res = await meetingAPI.checkOutComplete(id, payload); if (res.success) { setShowOutcomeModal(false); fetchMeeting(); } }
    catch (err) { setError(err.message); }
  };
  const handleReopenSubmit = async (reason) => {
    try { const res = await meetingAPI.reopen(id, reason); if (res.success) { setShowReopenModal(false); fetchMeeting(); } }
    catch (err) { setError(err.message); }
  };

  if (loading) return <div className="page-container empty-state">Loading meeting details...</div>;

  if (error || !meeting) {
    return (
      <div className="page-container">
        <div className="alert alert-danger"><AlertCircle size={20} /><span>{error || 'Meeting record not found.'}</span></div>
        <Link to="/meetings" className="btn btn-secondary">Back to Meetings List</Link>
      </div>
    );
  }

  const isManagerOrAdmin = ['Sales Manager', 'Admin'].includes(user?.role);
  const isAssigned = meeting.assignedTo?._id === user?._id || isManagerOrAdmin;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="page-title">{meeting.purpose}</h1>
            <StatusBadge status={meeting.status} subStatus={meeting.subStatus} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            <span>🏢 <strong>Customer:</strong> {meeting.customer?.companyName}</span>
            <span>👤 <strong>Contact:</strong> {meeting.contact?.name} ({meeting.contact?.title})</span>
            <span>👨‍💼 <strong>Sales Rep:</strong> {meeting.assignedTo?.name}</span>
          </div>
        </div>
      </div>

      {/* Lifecycle Progress Stepper */}
      <div className="card mb-6">
        <LifecycleStepper currentStatus={meeting.status} subStatus={meeting.subStatus} />

        {/* Action Controls Bar */}
        <div className="action-bar">
          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Available Lifecycle Actions for Role <strong>({user?.role})</strong>:
          </div>

          <div className="flex flex-wrap gap-2">
            {meeting.status === 'Scheduled' && (
              <button onClick={handleConfirm} className="btn btn-primary btn-sm">
                <CheckCircle2 size={16} /> Confirm Meeting
              </button>
            )}

            {['Scheduled', 'Confirmed', 'In Progress'].includes(meeting.status)
              && meeting.subStatus !== 'Interrupted/Rescheduled'
              && !meeting.visits.some(v => v.sessionStatus === 'Active') && (
              <button onClick={() => setShowCheckInModal(true)} className="btn btn-success btn-sm" disabled={!isAssigned}>
                <MapPin size={16} /> Check In (Start Visit)
              </button>
            )}

            {meeting.subStatus === 'Interrupted/Rescheduled' && (
              <button onClick={() => setShowCheckInModal(true)} className="btn btn-success btn-sm" disabled={!isAssigned}>
                <PlayCircle size={16} /> Resume Visit (Session #2 Check-In)
              </button>
            )}

            {['In Progress', 'Checked In'].includes(meeting.status)
              && meeting.visits.some(v => v.sessionStatus === 'Active') && (
              <button onClick={() => setShowRescheduleModal(true)} className="btn btn-warning btn-sm" disabled={!isAssigned}>
                <PauseCircle size={16} /> Pause &amp; Reschedule Visit (Return Later)
              </button>
            )}

            {['In Progress', 'Checked In'].includes(meeting.status) && (
              <button onClick={() => setShowOutcomeModal(true)} className="btn btn-success btn-sm" disabled={!isAssigned}>
                <Flag size={16} /> Check-Out &amp; Complete Meeting
              </button>
            )}

            {meeting.status === 'Completed' && isManagerOrAdmin && (
              <button onClick={() => setShowReopenModal(true)} className="btn btn-secondary btn-sm" style={{ borderColor: 'rgba(168,85,247,0.4)', color: 'var(--accent-purple)' }}>
                <RefreshCw size={16} /> Reopen Meeting (Manager)
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Schedule & Location */}
        <div className="card lg:col-span-1">
          <h3 className="card-title mb-4">
            <Calendar size={18} className="text-blue-500" />
            Schedule &amp; Location
          </h3>
          <div className="flex flex-col gap-3 text-xs sm:text-sm">
            <div>
              <span className="section-label">SCHEDULED TIMEFRAME</span>
              <strong style={{ color: 'var(--text-primary)' }}>{new Date(meeting.scheduledStartTime).toLocaleString()}</strong>
              {' to '}
              <strong style={{ color: 'var(--text-primary)' }}>{new Date(meeting.scheduledEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <div>
              <span className="section-label">MEETING LOCATION</span>
              <div className="flex items-center gap-1.5 mt-1" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={15} className="text-cyan-500 flex-shrink-0" />
                <span>{meeting.location?.address}</span>
              </div>
            </div>
            <div>
              <span className="section-label">CUSTOMER &amp; ACCOUNT TIER</span>
              <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{meeting.customer?.companyName} ({meeting.customer?.accountTier})</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Industry: {meeting.customer?.industry}</div>
            </div>
            <div>
              <span className="section-label">CONTACT PERSON</span>
              <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{meeting.contact?.name}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{meeting.contact?.title} • {meeting.contact?.phone}</div>
            </div>
          </div>
        </div>

        {/* Visit Sessions History */}
        <div className="card lg:col-span-2">
          <h3 className="card-title mb-4">
            <History size={18} className="text-cyan-500" />
            Actual Visit Sessions History ({meeting.visits?.length || 0} Sessions)
          </h3>

          {(!meeting.visits || meeting.visits.length === 0) ? (
            <div className="empty-state">No visit check-ins recorded yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {meeting.visits.map((session, idx) => (
                <div key={session._id || idx} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm" style={{ color: 'var(--accent-blue)' }}>
                      Visit Session #{session.sessionIndex || idx + 1}
                    </span>
                    <span className={`badge ${session.sessionStatus === 'Completed' ? 'badge-completed' : 'badge-in-progress'}`}>
                      {session.sessionStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="section-label">CHECK-IN TIME &amp; LOCATION</span>
                      <strong style={{ color: 'var(--accent-cyan)' }}>
                        {new Date(session.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </strong>
                      {' '}({new Date(session.checkInTime).toLocaleDateString()})
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginTop: '0.2rem' }}>
                        📍 {session.checkInLocation?.address || 'Recorded Location'}
                      </div>
                    </div>

                    <div>
                      <span className="section-label">CHECK-OUT TIME</span>
                      {session.checkOutTime ? (
                        <>
                          <strong style={{ color: '#f43f5e' }}>
                            {new Date(session.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </strong>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginTop: '0.2rem' }}>
                            📍 {session.checkOutLocation?.address || 'Recorded Location'}
                          </div>
                        </>
                      ) : (
                        <span className="font-semibold text-amber-500">Active In-Progress</span>
                      )}
                    </div>
                  </div>

                  {session.interruptionReason && (
                    <div className="mt-3 p-2.5 rounded-lg text-xs"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#d97706' }}>
                      ⚠️ <strong>Interruption Note:</strong> {session.interruptionReason}
                      {session.rescheduledReturnTime && (
                        <span> | Scheduled Return: {new Date(session.rescheduledReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Outcome Section */}
      {meeting.outcome?.result && (
        <div className="card mb-6" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <h3 className="card-title" style={{ color: 'var(--accent-emerald)' }}>
            <Flag size={18} /> Recorded Meeting Outcome
          </h3>
          <div className="mt-3 text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div><strong style={{ color: 'var(--text-primary)' }}>Outcome Result:</strong> <span className="badge badge-completed ml-2">{meeting.outcome.result}</span></div>
            <div><strong style={{ color: 'var(--text-primary)' }}>Outcome Notes:</strong> {meeting.outcome.notes}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Recorded on {new Date(meeting.outcome.recordedAt).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Follow-up Action Items */}
      {meeting.followUps?.length > 0 && (
        <div className="card mb-6">
          <h3 className="card-title">
            <CheckSquare size={18} className="text-purple-500" />
            Associated Follow-Up Actions
          </h3>
          <div className="flex flex-col gap-2.5 mt-3">
            {meeting.followUps.map((f) => (
              <div key={f._id} className="list-item">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Owner: {f.owner?.name || 'Assigned Owner'} • Due: {new Date(f.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <span className="badge badge-scheduled">{f.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Trail */}
      <div className="card">
        <h3 className="card-title mb-4">
          <FileText size={18} className="text-purple-500" />
          Complete Audit Trail History ({meeting.auditLog?.length || 0} Events)
        </h3>
        <div className="table-responsive">
          <table className="table text-xs">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>State Change</th>
                <th>Performed By</th>
                <th>Reason / Rationale</th>
              </tr>
            </thead>
            <tbody>
              {meeting.auditLog?.map((audit, idx) => (
                <tr key={audit._id || idx}>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(audit.timestamp).toLocaleString()}</td>
                  <td><strong style={{ color: 'var(--text-primary)' }}>{audit.action}</strong></td>
                  <td>
                    {audit.fromStatus ? `${audit.fromStatus} → ` : ''}
                    <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{audit.toStatus}</span>
                  </td>
                  <td>{audit.performedByName || 'User'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{audit.reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showCheckInModal    && <CheckInModal    meeting={meeting} onClose={() => setShowCheckInModal(false)}    onConfirm={handleCheckInSubmit} />}
      {showRescheduleModal && <RescheduleModal meeting={meeting} onClose={() => setShowRescheduleModal(false)} onConfirm={handlePauseRescheduleSubmit} />}
      {showOutcomeModal    && <OutcomeModal    meeting={meeting} users={users} onClose={() => setShowOutcomeModal(false)} onConfirm={handleOutcomeSubmit} />}
      {showReopenModal     && <ReopenModal     meeting={meeting} onClose={() => setShowReopenModal(false)}     onConfirm={handleReopenSubmit} />}
    </div>
  );
};

export default MeetingDetail;
