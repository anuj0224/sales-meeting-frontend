import React, { useState } from 'react';
import { RefreshCw, X, AlertCircle } from 'lucide-react';

const ReopenModal = ({ meeting, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 5) {
      setError('A valid audit rationale (at least 5 characters) must be provided.');
      return;
    }
    setLoading(true);
    await onConfirm(reason);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <RefreshCw size={20} />
            Reopen Completed Meeting (Manager Action)
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Reopening transitions this meeting back to <strong>In Progress</strong> state. All manager rationale is permanently logged in the audit trail.
        </p>

        {error && (
          <div className="alert alert-danger mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group mb-0">
            <label className="form-label">Manager Reopen Rationale *</label>
            <textarea
              className="form-control"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Client requested additional pricing discussion and secondary visit session..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary bg-purple-600 hover:bg-purple-700" disabled={loading}>
              {loading ? 'Reopening...' : 'Confirm Reopen Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReopenModal;
