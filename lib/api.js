// API client for AutomationScout backend using native fetch
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api.automationscout.com' 
  : 'http://localhost:3003';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    return { data, status: response.status, ok: response.ok };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const auth = {
  login: (username, password) => 
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: { username, password }
    }),
  logout: () => 
    apiRequest('/api/auth/logout', { method: 'POST' }),
  validate: (token) => 
    apiRequest('/api/auth/validate', {
      method: 'POST',
      body: { token }
    }),
};

// Clients API  
export const clients = {
  list: () => 
    apiRequest('/api/clients'),
  get: (id) => 
    apiRequest(`/api/clients/${id}`),
  create: (data) => 
    apiRequest('/api/clients', {
      method: 'POST',
      body: data
    }),
  update: (id, data) => 
    apiRequest(`/api/clients/${id}`, {
      method: 'PUT',
      body: data
    }),
  delete: (id) => 
    apiRequest(`/api/clients/${id}`, { method: 'DELETE' }),
};

// Widgets API
export const widgets = {
  list: () => 
    apiRequest('/api/widgets'),
  get: (id) => 
    apiRequest(`/api/widgets/${id}`),
};

// Workflows API  
export const workflows = {
  list: () => 
    apiRequest('/api/workflows'),
  get: (id) => 
    apiRequest(`/api/workflows/${id}`),
};

// Compliance API
export const compliance = {
  dashboard: () => 
    apiRequest('/api/compliance/dashboard'),
  auditLogs: (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(`/api/compliance/audit-logs${query}`);
  },
  reports: () => 
    apiRequest('/api/compliance/reports'),
};

// Health check
export const health = () => 
  apiRequest('/api/health');

export default { auth, clients, widgets, workflows, compliance, health };