import axiosInstance from './axios';

// axiosInstance interceptor already does: return response.data
// So every call returns: { success, data, pagination? } directly

export const mantraApi = {
    // Returns: { success, data: [...], pagination }
    getAll: (params = {}) => axiosInstance.get('/mantras', { params }),

    // Returns: { success, data: [...] }  →  extract .data for array
    getFeatured: async () => {
        const res = await axiosInstance.get('/mantras/featured');
        return Array.isArray(res?.data) ? res.data : [];
    },

    // Returns: { success, data: [...] }  →  extract .data for array
    getPopular: async () => {
        const res = await axiosInstance.get('/mantras/popular');
        return Array.isArray(res?.data) ? res.data : [];
    },

    // Returns: { success, data: {...} }  →  extract .data for object
    getDaily: async () => {
        const res = await axiosInstance.get('/mantras/daily');
        return res?.data || null;
    },

    // Returns: { success, data: {...} }
    getBySlug: async (slug) => {
        const res = await axiosInstance.get(`/mantras/slug/${slug}`);
        return res?.data || null;
    },

    // Returns: { success, data: [...], pagination }
    getByCategory: (categoryId, params = {}) =>
        axiosInstance.get(`/mantras/category/${categoryId}`, { params }),

    // CRUD
    create: (data) => axiosInstance.post('/mantras', data),
    update: (id, data) => axiosInstance.put(`/mantras/${id}`, data),
    delete: (id) => axiosInstance.delete(`/mantras/${id}`),
    incrementViews: (id) => axiosInstance.post(`/mantras/${id}/views`),
};