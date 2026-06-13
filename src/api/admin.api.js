import axiosInstance from './axios';

export const adminApi = {
    getAllAdmins: () => axiosInstance.get('/admin/all'),
    createAdmin: (data) => axiosInstance.post('/admin/create', data),
    updateAdmin: (id, data) => axiosInstance.put(`/admin/${id}`, data),
    deleteAdmin: (id) => axiosInstance.delete(`/admin/${id}`),
    blockAdmin: (id) => axiosInstance.post(`/admin/${id}/block`),
    unblockAdmin: (id) => axiosInstance.post(`/admin/${id}/unblock`),
};