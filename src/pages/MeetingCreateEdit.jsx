import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { meetingAPI, customerAPI, userAPI } from '../services/api';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const MeetingCreateEdit = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  const [customerId, setCustomerId] = useState('');
  const [contactId, setContactId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [scheduledStartTime, setScheduledStartTime] = useState('');
  const [scheduledEndTime, setScheduledEndTime] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load customers and users
    customerAPI.getCustomers().then(res => {
      if (res.success) setCustomers(res.data);
    }).catch(err => console.error(err));

    userAPI.getUsers().then(res => {
      if (res.success) setUsers(res.data);
    }).catch(err => console.error(err));
  }, []);

  // When customer changes, load contacts for customer
  useEffect(() => {
    if (customerId) {
      customerAPI.getContacts(customerId).then(res => {
        if (res.success) {
          setContacts(res.data);
          if (res.data.length > 0) {
            setContactId(res.data[0]._id);
          } else {
            setContactId('');
          }
        }
      });
    } else {
      setContacts([]);
    }
  }, [customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!customerId || !contactId || !purpose || !locationAddress || !scheduledStartTime || !scheduledEndTime) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (new Date(scheduledEndTime) <= new Date(scheduledStartTime)) {
      setError('Scheduled end time must be after scheduled start time.');
      return;
    }

    setLoading(true);

    try {
      const res = await meetingAPI.create({
        customerId,
        contactId,
        purpose,
        location: locationAddress,
        scheduledStartTime,
        scheduledEndTime,
        assignedToId: assignedToId || undefined,
        notes
      });

      if (res.success) {
        navigate(`/meetings/${res.data._id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/meetings" className="card-link mb-2" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Meetings
        </Link>
        <h1 className="page-title mt-1">Schedule New Customer Visit</h1>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer & Contact Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Customer / Account *</label>
              <select
                className="form-control"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              >
                <option value="">Select Customer Account...</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.companyName} ({c.accountTier})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Contact Person *</label>
              <select
                className="form-control"
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                required
                disabled={!customerId}
              >
                <option value="">Select Contact Person...</option>
                {contacts.map((ct) => (
                  <option key={ct._id} value={ct._id}>
                    {ct.name} - {ct.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Meeting Purpose *</label>
            <input
              type="text"
              className="form-control"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Annual Fiber Hardware Renewal & Product Demo"
              required
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Visit Location Address *</label>
            <input
              type="text"
              className="form-control"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="e.g. 100 Tech Park, Electronic City, Bengaluru"
              required
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Scheduled Start Time *</label>
              <input
                type="datetime-local"
                className="form-control"
                value={scheduledStartTime}
                onChange={(e) => setScheduledStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Scheduled End Time *</label>
              <input
                type="datetime-local"
                className="form-control"
                value={scheduledEndTime}
                onChange={(e) => setScheduledEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Assigned Sales Employee</label>
            <select
              className="form-control"
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
            >
              <option value="">Assign to Me (Current User)</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Pre-Meeting Notes</label>
            <textarea
              className="form-control"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add key context or client requirement notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Link to="/meetings" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Schedule...' : 'Schedule Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingCreateEdit;
