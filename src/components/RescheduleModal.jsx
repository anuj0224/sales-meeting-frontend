import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';

const RescheduleModal = ({ meeting, onClose, onConfirm }) => {
  const [interruptionReason, setInterruptionReason] = useState(
    'Customer requested to pause visit and return at a later time'
  );
  const [rescheduledReturnTime, setRescheduledReturnTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm({
      interruptionReason,
      rescheduledReturnTime: rescheduledReturnTime ? new Date(rescheduledReturnTime).toISOString() : null,
      notes
    });
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-amber-500">
            <Clock size={20} />
            Pause & Reschedule Visit (Interruption Scenario)
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="alert alert-info text-xs mb-4">
          💡 <strong>Assignment Scenario Handler:</strong> Use this when a customer requests you to leave and return later (e.g. checked in at 10:02 AM, asked at 10:40 AM to return at 3:00 PM). This closes current visit session #1 and preserves all 10:02 AM arrival logs while allowing a 2nd check-in later.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group mb-0">
            <label className="form-label">Interruption Rationale / Reason</label>
            <textarea
              className="form-control"
              rows={2}
              value={interruptionReason}
              onChange={(e) => setInterruptionReason(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Requested Return Time (e.g., 3:00 PM)</label>
            <input
              type="datetime-local"
              className="form-control"
              value={rescheduledReturnTime}
              onChange={(e) => setRescheduledReturnTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Session Check-Out Notes</label>
            <textarea
              className="form-control"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Leaving customer premises, returning at 3:00 PM..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? 'Processing...' : 'Pause Visit & Schedule Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
