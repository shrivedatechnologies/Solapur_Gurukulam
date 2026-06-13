import axiosInstance from './axios';

export const dashboardApi = {
    getStats: () => axiosInstance.get('/dashboard/stats'),
    getTopMantras: () => axiosInstance.get('/dashboard/top-mantras'),
    getTopShlokas: () => axiosInstance.get('/dashboard/top-shlokas'),
    getUserAnalytics: () => axiosInstance.get('/dashboard/user-analytics'),
    getReadAnalytics: () => axiosInstance.get('/dashboard/read-analytics'),
};