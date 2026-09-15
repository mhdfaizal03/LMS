import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Automatically normalize base URL whether user inputs domain, domain with trailing slash, or full /api/v1 path
const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!envUrl) return '/api/v1';
  if (envUrl.endsWith('/api/v1')) return envUrl;
  if (envUrl.endsWith('/')) return `${envUrl}api/v1`;
  return `${envUrl}/api/v1`;
};

export const API_BASE_URL = getBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s timeout for live cloud endpoints
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized & expired tokens
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // If current window is not on login or register, redirect
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register') &&
          !window.location.pathname.startsWith('/forgot-password')
        ) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
