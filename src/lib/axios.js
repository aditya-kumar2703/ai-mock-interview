import axios from 'axios';

/**
 * Pre-configured Axios instance for API calls.
 * Base URL and interceptors will be configured when backend is ready.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('amie_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 globally — redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('amie_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
