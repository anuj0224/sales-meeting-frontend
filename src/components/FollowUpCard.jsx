import React from 'react';
import { CheckSquare, Clock, CheckCircle2 } from 'lucide-react';

const priorityColor = (priority) => {
  switch (priority) {
    case 'Urgent': return '#f43f5e';
    case 'High':   return '#f59e0b';
    case 'Medium': return '#3b82f6';
    default:       return '#64748b';
  }
};

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Completed':   return 'badge-completed';
    case 'In Progress': return 'badge-in-progress';
    default:            return 'badge-scheduled';
  }
};

/**
 * FollowUpCard — reusable card for a single follow-up action item.
 *
 * Props:
 *   followUp    {object}   — the follow-up document
 *   compact     {boolean}  — smaller layout for dashboard previews (default false)
 *   onStart     {fn}       — called with (id) when "Start" is clicked   (optional)
 *   onComplete  {fn}       — called with (id) when "Complete" is clicked (optional)
 *   updating    {string}   — id of the item currently being saved       (optional)
 */
const FollowUpCard = ({ followUp: f, compact = false, onStart, onComplete, updating }) => {
  return (
    <div className="bg-slate-100/80 dark:bg-slate-900/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      {/* Left: info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{f.title}</span>

          {/* Priority badge */}
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

        {!compact && f.description && (
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">{f.description}</div>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          {!compact && f.owner?.name && (
            <span className="flex items-center gap-1">
              <CheckSquare size={12} /> {f.owner.name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Due: {f.dueDate ? new Date(f.dueDate).toLocaleDateString() : 'N/A'}
          </span>
          {!compact && f.meeting?.purpose && (
            <span className="text-blue-600 dark:text-blue-400 truncate">📋 {f.meeting.purpose}</span>
          )}
        </div>
      </div>

      {/* Right: status badge + actions */}
      <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
        <span className={`badge ${statusBadgeClass(f.status)}`}>{f.status}</span>

        {!compact && onStart && f.status === 'Pending' && (
          <button
            onClick={() => onStart(f._id)}
            className="btn btn-secondary btn-sm"
            disabled={updating === f._id}
          >
            Start
          </button>
        )}

        {!compact && onComplete && f.status !== 'Completed' && (
          <button
            onClick={() => onComplete(f._id)}
            className="btn btn-success btn-sm"
            disabled={updating === f._id}
          >
            <CheckCircle2 size={14} />
            {updating === f._id ? 'Saving…' : 'Complete'}
          </button>
        )}

        {!compact && f.status === 'Completed' && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 size={14} /> Done
          </span>
        )}
      </div>
    </div>
  );
};

export default FollowUpCard;
