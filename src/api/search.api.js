import axiosInstance from './axios';

export const searchApi = {
    global: (query) => axiosInstance.get('/search/global', { params: { q: query } }),
    searchMantras: (query) => axiosInstance.get('/search/mantras', { params: { q: query } }),
    searchShlokas: (query) => axiosInstance.get('/search/shlokas', { params: { q: query } }),
    searchCategories: (query) => axiosInstance.get('/search/categories', { params: { q: query } }),
};