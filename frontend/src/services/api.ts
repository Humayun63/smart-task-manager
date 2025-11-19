import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://stm-server-liard.vercel.app/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if we're already on the login or register page, or if it's the /me endpoint
      const currentPath = window.location.pathname;
      const isAuthCheck = error.config?.url?.includes('/auth/me');
      
      if (!isAuthCheck && currentPath !== '/login' && currentPath !== '/register') {
        // Handle unauthorized access
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
