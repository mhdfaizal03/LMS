import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Automatically normalize base URL whether user inputs domain, domain with trailing slash, or full /api/v1 path
export const normalizeApiUrl = (rawUrl?: string | null): string => {
  if (!rawUrl) return '/api/v1';
  let clean = rawUrl.trim();
  if (clean.endsWith('/api/v1')) return clean;
  if (clean.endsWith('/')) return `${clean}api/v1`;
  return `${clean}/api/v1`;
};

export const getApiBaseUrl = (): string => {
  const custom = typeof window !== 'undefined' ? localStorage.getItem('custom_api_url') : null;
  if (custom && custom.trim()) {
    return normalizeApiUrl(custom);
  }
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return normalizeApiUrl(envUrl);
  }
  // Default production Render backend
  return 'https://lms-backend-w9za.onrender.com/api/v1';
};


export const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45s timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth bearer token and dynamic runtime baseURL
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiBaseUrl();
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
