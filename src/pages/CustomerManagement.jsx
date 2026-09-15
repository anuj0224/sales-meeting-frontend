import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';
import { Building2, Plus, UserPlus, ChevronRight } from 'lucide-react';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [companyName, setCompanyName]         = useState('');
  const [industry, setIndustry]               = useState('');
  const [phone, setPhone]                     = useState('');
  const [accountTier, setAccountTier]         = useState('Enterprise');

  const [showAddContact, setShowAddContact]   = useState(false);
  const [contactName, setContactName]         = useState('');
  const [contactTitle, setContactTitle]       = useState('');
  const [contactPhone, setContactPhone]       = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await customerAPI.getCustomers();
      if (res.success) {
        setCustomers(res.data);
        if (res.data.length > 0 && !selectedCustomer) setSelectedCustomer(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  useEffect(() => {
    if (selectedCustomer) {
      customerAPI.getContacts(selectedCustomer._id).then(res => {
        if (res.success) setContacts(res.data);
      });
    }
  }, [selectedCustomer]);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    const res = await customerAPI.createCustomer({ companyName, industry, phone, accountTier });
    if (res.success) { setShowAddCustomer(false); setCompanyName(''); fetchCustomers(); }
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const res = await customerAPI.createContact(selectedCustomer._id, { name: contactName, title: contactTitle, phone: contactPhone });
    if (res.success) {
      setShowAddContact(false); setContactName('');
      customerAPI.getContacts(selectedCustomer._id).then(r => setContacts(r.data));
    }
  };

  if (loading) return <div className="page-container empty-state">Loading customer accounts...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers &amp; Account Directory</h1>
          <p className="page-subtitle">
            Manage enterprise accounts, lead profiles, and key contact stakeholders.
          </p>
        </div>
        <button onClick={() => setShowAddCustomer(true)} className="btn btn-primary self-start sm:self-auto">
          <Plus size={18} /> New Customer Account
        </button>
      </div>

      {showAddCustomer && (
        <div className="card mb-6" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
          <h3 className="card-title mb-4">Add New Customer Account</h3>
          <form onSubmit={handleCreateCustomer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Company Name</label>
              <input type="text" className="form-control" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Industry</label>
              <input type="text" className="form-control" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Telecommunications" />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Account Tier</label>
              <select className="form-control" value={accountTier} onChange={e => setAccountTier(e.target.value)}>
                <option value="Enterprise">Enterprise</option>
                <option value="Mid-Market">Mid-Market</option>
                <option value="SMB">SMB</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddCustomer(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Account</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts list */}
        <div className="card lg:col-span-1">
          <h3 className="card-title mb-4">
            <Building2 size={18} className="text-blue-500" />
            Accounts ({customers.length})
          </h3>
          <div className="flex flex-col gap-2">
            {customers.map(c => (
              <div
                key={c._id}
                onClick={() => setSelectedCustomer(c)}
                className="list-item"
                style={{
                  cursor: 'pointer',
                  ...(selectedCustomer?._id === c._id
                    ? { background: 'rgba(59,130,246,0.12)', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }
                    : {})
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'inherit' }}>{c.companyName}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{c.industry} • {c.accountTier}</div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Selected customer details */}
        <div className="card lg:col-span-2">
          {selectedCustomer ? (
            <div>
              <div className="page-header" style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h2 className="page-title">{selectedCustomer.companyName}</h2>
                  <p className="page-subtitle">
                    Industry: {selectedCustomer.industry} • Tier:{' '}
                    <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{selectedCustomer.accountTier}</span>
                  </p>
                </div>
                <button onClick={() => setShowAddContact(true)} className="btn btn-secondary btn-sm self-start sm:self-auto">
                  <UserPlus size={16} /> Add Contact
                </button>
              </div>

              {showAddContact && (
                <form onSubmit={handleCreateContact} className="list-item mb-4" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem' }}>
                  <span className="section-label">Add Contact Person</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="text" className="form-control" placeholder="Contact Name *" value={contactName} onChange={e => setContactName(e.target.value)} required />
                    <input type="text" className="form-control" placeholder="Title / Role" value={contactTitle} onChange={e => setContactTitle(e.target.value)} />
                    <input type="text" className="form-control" placeholder="Phone" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddContact(false)} className="btn btn-secondary btn-sm">Cancel</button>
                    <button type="submit" className="btn btn-success btn-sm">Save Contact</button>
                  </div>
                </form>
              )}

              <h3 className="card-title text-sm mb-3">Key Contact Stakeholders ({contacts.length})</h3>
              <div className="table-responsive">
                <table className="table text-xs">
                  <thead>
                    <tr>
                      <th>Name</th><th>Title</th><th>Phone</th><th>Primary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(ct => (
                      <tr key={ct._id}>
                        <td><strong style={{ color: 'var(--text-primary)' }}>{ct.name}</strong></td>
                        <td>{ct.title || '-'}</td>
                        <td>{ct.phone || '-'}</td>
                        <td>{ct.isPrimary ? <span className="badge badge-completed">Primary</span> : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="empty-state">Select a customer account to view details and contacts.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
