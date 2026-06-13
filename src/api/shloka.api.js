import axiosInstance from './axios';

// axiosInstance interceptor: return response.data
// So every call returns { success, data, pagination? } directly

export const shlokaApi = {
    // Returns: { success, data: [...], pagination }
    getAll: (params) => axiosInstance.get('/shlokas', { params }),

    // Returns: { success, data: {...} }
    getById: (id) => axiosInstance.get(`/shlokas/${id}`),

    // Returns: { success, data: {...} }
    getBySlug: async (slug) => {
        const res = await axiosInstance.get(`/shlokas/slug/${slug}`);
        return res?.data || null;
    },

    // Returns: { success, data: [...], pagination }
    getByCategory: (categoryId, params) =>
        axiosInstance.get(`/shlokas/category/${categoryId}`, { params }),

    // CRUD
    create: (data) => axiosInstance.post('/shlokas', data),
    update: (id, data) => axiosInstance.put(`/shlokas/${id}`, data),
    delete: (id) => axiosInstance.delete(`/shlokas/${id}`),
    incrementViews: (id) => axiosInstance.post(`/shlokas/${id}/views`),
};