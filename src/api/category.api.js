import axiosInstance from './axios';

// axiosInstance interceptor: return response.data
// Backend returns: { success, data: [...], pagination: { page, limit, total, pages } }

export const categoryApi = {
    // Returns: { success, data: [...], pagination }
    getAll: (params) => axiosInstance.get('/categories', { params }),

    // Returns: { success, data: {...} }
    getById: (id) => axiosInstance.get(`/categories/${id}`),

    // Returns: { success, data: {...} }
    getBySlug: async (slug) => {
        const res = await axiosInstance.get(`/categories/slug/${slug}`);
        return res?.data || null;
    },

    create: (data) => axiosInstance.post('/categories', data),
    update: (id, data) => axiosInstance.put(`/categories/${id}`, data),
    delete: (id) => axiosInstance.delete(`/categories/${id}`),
};