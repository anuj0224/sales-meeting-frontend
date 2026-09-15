import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';

const CheckInModal = ({ meeting, onClose, onConfirm }) => {
  const [address, setAddress] = useState(meeting.location?.address || '');
  const [latitude, setLatitude] = useState('12.9716');
  const [longitude, setLongitude] = useState('77.5946');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm({
      location: {
        address,
        latitude: parseFloat(latitude) || null,
        longitude: parseFloat(longitude) || null
      },
      notes
    });
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <MapPin size={20} />
            Meeting Check-In (Visit Session)
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Check-in logs your live arrival timestamp and geolocation metadata for audit compliance.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group mb-0">
            <label className="form-label">Check-In Location Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">GPS Latitude</label>
              <input
                type="text"
                className="form-control"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">GPS Longitude</label>
              <input
                type="text"
                className="form-control"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Check-In Notes / Arrival Observations</label>
            <textarea
              className="form-control"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Met with receptionist, waiting in lobby..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Logging Check-In...' : 'Confirm Check-In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInModal;
