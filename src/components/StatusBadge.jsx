import React from 'react';

const StatusBadge = ({ status, subStatus }) => {
  let badgeClass = 'badge-scheduled';
  let label = status;

  if (subStatus === 'Interrupted/Rescheduled') {
    return (
      <span className="badge badge-interrupted">
        ⏱️ Interrupted / Rescheduled
      </span>
    );
  }

  switch (status) {
    case 'Scheduled':
      badgeClass = 'badge-scheduled';
      break;
    case 'Confirmed':
      badgeClass = 'badge-confirmed';
      break;
    case 'Checked In':
      badgeClass = 'badge-checked-in';
      break;
    case 'In Progress':
      badgeClass = 'badge-in-progress';
      break;
    case 'Completed':
      badgeClass = 'badge-completed';
      break;
    default:
      badgeClass = 'badge-scheduled';
  }

  return <span className={`badge ${badgeClass}`}>{label}</span>;
};

export default StatusBadge;
