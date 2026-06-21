import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor – attach token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor – detailed error handling
axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Log everything to console (visible in remote debugger)
        console.group('🚨 API Error');
        console.error('URL:', originalRequest?.url);
        console.error('Method:', originalRequest?.method);
        console.error('Status:', error.response?.status);
        console.error('Message:', error.response?.data?.message || error.message);
        console.groupEnd();

        // If 401 – try refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }
                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                    refreshToken,
                });
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                toast.error('Session expired. Please log in again.');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // If 403 – forbidden (wrong role)
        if (error.response?.status === 403) {
            toast.error('You do not have permission to access this resource.');
            return Promise.reject(error);
        }

        // Other errors – show toast with actual message
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        toast.error(errorMessage);
        return Promise.reject(error);
    }
);

export default axiosInstance;