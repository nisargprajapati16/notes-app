import axios from 'axios';
import { store } from '../store';
import { showSnackbar } from '../store/uiSlice';
import { refreshToken } from './auth';
import { setUser } from '../store/authSlice';

const instance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for global error handling
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const state = store.getState();
    const hasUser = !!state.auth.user;
    if (error.response && error.response.status === 401 && !originalRequest._retry && hasUser) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(() => instance(originalRequest))
        .catch(err => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await refreshToken();
        processQueue(null);
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(showSnackbar({ message: 'Session expired. Please login again.', severity: 'error' }));
        // window.location.href = '/login';
        store.dispatch(setUser(null))
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    // Show global error for other cases
    if (error.response && error.response.data && typeof error.response.data.message === 'string') {
      store.dispatch(showSnackbar({ message: error.response.data.message, severity: 'error' }));
    } else if (error.message) {
      store.dispatch(showSnackbar({ message: error.message, severity: 'error' }));
    }
    return Promise.reject(error);
  }
);

export default instance; 