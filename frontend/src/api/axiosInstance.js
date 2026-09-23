import axios from 'axios';

const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const defaultBaseUrl = `http://${currentHost}:3003`;
const rawBaseUrl = import.meta.env.VITE_API_URL || defaultBaseUrl;

// Dynamic IP fallback: Replace localhost with local IP if accessed from external device/phone
const targetBaseUrl = (rawBaseUrl.includes('localhost') && currentHost !== 'localhost')
  ? rawBaseUrl.replace('localhost', currentHost)
  : rawBaseUrl;

const normalizedBaseUrl = targetBaseUrl.replace(/\/api\/?$/, '');

const axiosInstance = axios.create({
  baseURL: normalizedBaseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
