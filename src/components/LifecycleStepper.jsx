import React from 'react';
import { Calendar, CheckCircle2, MapPin, PlayCircle, Flag } from 'lucide-react';

const steps = [
  { key: 'Scheduled', label: '1. Scheduled', icon: Calendar },
  { key: 'Confirmed', label: '2. Confirmed', icon: CheckCircle2 },
  { key: 'Checked In', label: '3. Checked In', icon: MapPin },
  { key: 'In Progress', label: '4. In Progress', icon: PlayCircle },
  { key: 'Completed', label: '5. Completed', icon: Flag }
];

const LifecycleStepper = ({ currentStatus, subStatus }) => {
  const getStepStatus = (stepKey, index) => {
    const statusOrder = ['Scheduled', 'Confirmed', 'Checked In', 'In Progress', 'Completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    if (currentIndex > index) return 'completed';
    if (currentIndex === index) return 'active';
    return 'pending';
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      <div className="lifecycle-stepper">
        {steps.map((step, idx) => {
          const stepState = getStepStatus(step.key, idx);
          const Icon = step.icon;
          return (
            <div key={step.key} className={`step-item ${stepState}`}>
              <div className="step-bubble">
                <Icon size={18} />
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
      {subStatus === 'Interrupted/Rescheduled' && (
        <div className="alert alert-info" style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
          ⏱️ <strong>Visit Paused / Rescheduled:</strong> The salesperson has checked out of an earlier visit session and scheduled a return visit. Original 10:00 AM start schedule and prior check-in timestamps remain fully preserved in audit logs.
        </div>
      )}
    </div>
  );
};

export default LifecycleStepper;
