// API client for AutomationScout backend
import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api.automationscout.com' 
  : 'http://localhost:3003';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: (username, password) => 
    apiClient.post('/api/auth/login', { username, password }),
  logout: () => 
    apiClient.post('/api/auth/logout'),
  validate: (token) => 
    apiClient.post('/api/auth/validate', { token }),
};

// Clients API  
export const clients = {
  list: () => 
    apiClient.get('/api/clients'),
  get: (id) => 
    apiClient.get(`/api/clients/${id}`),
  create: (data) => 
    apiClient.post('/api/clients', data),
  update: (id, data) => 
    apiClient.put(`/api/clients/${id}`, data),
  delete: (id) => 
    apiClient.delete(`/api/clients/${id}`),
};

// Widgets API
export const widgets = {
  list: () => 
    apiClient.get('/api/widgets'),
  get: (id) => 
    apiClient.get(`/api/widgets/${id}`),
};

// Workflows API  
export const workflows = {
  list: () => 
    apiClient.get('/api/workflows'),
  get: (id) => 
    apiClient.get(`/api/workflows/${id}`),
};

// Compliance API
export const compliance = {
  dashboard: () => 
    apiClient.get('/api/compliance/dashboard'),
  auditLogs: (params) => 
    apiClient.get('/api/compliance/audit-logs', { params }),
  reports: () => 
    apiClient.get('/api/compliance/reports'),
};

// Health check
export const health = () => 
  apiClient.get('/api/health');

export default apiClient;