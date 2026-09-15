import React, { useState } from 'react';
import { Flag, CheckSquare, X, AlertCircle } from 'lucide-react';

const OutcomeModal = ({ meeting, users = [], onClose, onConfirm }) => {
  const [result, setResult] = useState('Interested');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  
  // Follow-up state
  const [createFollowUp, setCreateFollowUp] = useState(false);
  const [followUpTitle, setFollowUpTitle] = useState('');
  const [followUpDesc, setFollowUpDesc] = useState('');
  const [followUpOwner, setFollowUpOwner] = useState(meeting.assignedTo?._id || '');
  const [followUpDueDate, setFollowUpDueDate] = useState('');
  const [priority, setPriority] = useState('High');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const outcomes = [
    { value: 'Interested', label: 'Interested - High Potential' },
    { value: 'Follow-up Required', label: 'Follow-up Required (Requires Task)' },
    { value: 'Proposal Requested', label: 'Proposal / Quote Requested' },
    { value: 'Not Interested', label: 'Not Interested' },
    { value: 'Unable to Meet', label: 'Unable to Meet / Cancelled on Arrival' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Business Rule Check: Follow-up Required requires followUp fields
    if (result === 'Follow-up Required' || createFollowUp) {
      if (!followUpTitle || !followUpDueDate) {
        setError("When outcome is 'Follow-up Required', follow-up title and due date are MANDATORY.");
        return;
      }
    }

    setLoading(true);

    const completionPayload = {
      outcome: {
        result,
        notes: outcomeNotes
      },
      followUp: (result === 'Follow-up Required' || createFollowUp) ? {
        title: followUpTitle,
        description: followUpDesc,
        ownerId: followUpOwner,
        dueDate: followUpDueDate,
        priority
      } : null
    };

    await onConfirm(completionPayload);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Flag size={20} />
            Record Outcome & Complete Visit
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Outcome Selection */}
          <div className="form-group mb-0">
            <label className="form-label">Mandatory Meeting Outcome *</label>
            <select
              className="form-control"
              value={result}
              onChange={(e) => {
                setResult(e.target.value);
                if (e.target.value === 'Follow-up Required') {
                  setCreateFollowUp(true);
                }
              }}
              required
            >
              {outcomes.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Meeting Outcome Notes / Key Takeaways</label>
            <textarea
              className="form-control"
              rows={3}
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              placeholder="Summary of client discussion, budget discussed, products presented..."
              required
            />
          </div>

          {/* Follow-Up Section */}
          {(result === 'Follow-up Required' || createFollowUp) && (
            <div className="border border-blue-500/40 rounded-xl p-4 bg-blue-500/10 space-y-3">
              <h4 className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <CheckSquare size={16} />
                Mandatory Follow-Up Task Details
              </h4>

              <div className="form-group mb-0">
                <label className="form-label">Follow-up Action Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={followUpTitle}
                  onChange={(e) => setFollowUpTitle(e.target.value)}
                  placeholder="e.g., Send 400G Transceiver proposal & schedule trial demo"
                  required={result === 'Follow-up Required'}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-group mb-0">
                  <label className="form-label">Task Owner</label>
                  <select
                    className="form-control"
                    value={followUpOwner}
                    onChange={(e) => setFollowUpOwner(e.target.value)}
                  >
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={followUpDueDate}
                    onChange={(e) => setFollowUpDueDate(e.target.value)}
                    required={result === 'Follow-up Required'}
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Priority</label>
                <select
                  className="form-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Completing...' : 'Check-Out & Save Outcome'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutcomeModal;
