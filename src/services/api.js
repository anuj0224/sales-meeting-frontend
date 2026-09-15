const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const jwt = token || localStorage.getItem('optronix_jwt');
  if (jwt) {
    headers['Authorization'] = `Bearer ${jwt}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.error?.message || res.statusText || 'API Request Failed';
    throw new Error(errorMsg);
  }
  return data;
};

export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },
  getMe: async (token) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(token)
    });
    return handleResponse(res);
  }
};

export const meetingAPI = {
  getMeetings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/meetings?${queryString}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE}/meetings/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  create: async (meetingData) => {
    const res = await fetch(`${API_BASE}/meetings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(meetingData)
    });
    return handleResponse(res);
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/meetings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  confirm: async (id) => {
    const res = await fetch(`${API_BASE}/meetings/${id}/confirm`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  checkIn: async (id, checkInData) => {
    const res = await fetch(`${API_BASE}/meetings/${id}/check-in`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(checkInData)
    });
    return handleResponse(res);
  },
  pauseReschedule: async (id, data) => {
    const res = await fetch(`${API_BASE}/meetings/${id}/pause-reschedule`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  checkOutComplete: async (id, completionData) => {
    const res = await fetch(`${API_BASE}/meetings/${id}/check-out-complete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(completionData)
    });
    return handleResponse(res);
  },
  reopen: async (id, reason) => {
    const res = await fetch(`${API_BASE}/meetings/${id}/reopen`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse(res);
  }
};

export const customerAPI = {
  getCustomers: async () => {
    const res = await fetch(`${API_BASE}/customers`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  createCustomer: async (customerData) => {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(customerData)
    });
    return handleResponse(res);
  },
  getContacts: async (customerId) => {
    const res = await fetch(`${API_BASE}/customers/${customerId}/contacts`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  createContact: async (customerId, contactData) => {
    const res = await fetch(`${API_BASE}/customers/${customerId}/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contactData)
    });
    return handleResponse(res);
  }
};

export const userAPI = {
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/users?${queryString}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getTeam: async () => {
    const res = await fetch(`${API_BASE}/users/team`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};

export const followUpAPI = {
  getFollowUps: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/followups?${queryString}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/followups`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/followups/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  }
};

export const analyticsAPI = {
  getTeamActivity: async () => {
    const res = await fetch(`${API_BASE}/analytics/team-activity`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/analytics/admin-stats`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
