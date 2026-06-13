import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Shield, User, Mail, Phone, Ban, CheckCircle, X, Users, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
                if (response.data.success) {
                    localStorage.setItem('accessToken', response.data.data.accessToken);
                    originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (err) {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

const Loader = () => (
    <div className="flex justify-center items-center py-20">
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-amber-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-amber-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
    </div>
);

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'admin',
    });

    useEffect(() => { fetchAdmins(); }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/all');
            if (response.data.success) setAdmins(response.data.data || []);
            else setAdmins([]);
        } catch (error) {
            console.error('Fetch admins error:', error);
            toast.error('Failed to fetch admins');
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (admin = null) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({
                name: admin.name || '',
                email: admin.email || '',
                phone: admin.phone || '',
                password: '',
                role: admin.role || 'admin',
            });
        } else {
            setEditingAdmin(null);
            setFormData({ name: '', email: '', phone: '', password: '', role: 'admin' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAdmin(null);
        setFormData({ name: '', email: '', phone: '', password: '', role: 'admin' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error('Name is required');
        if (!formData.email.trim()) return toast.error('Email is required');
        if (!editingAdmin && (!formData.password || formData.password.length < 6))
            return toast.error('Password must be at least 6 characters');

        setLoading(true);
        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone || '',
                role: formData.role,
            };
            if (!editingAdmin) payload.password = formData.password;

            if (editingAdmin) {
                const response = await apiClient.put(`/admin/${editingAdmin._id}`, payload);
                if (response.data.success) {
                    toast.success('Admin updated successfully');
                    fetchAdmins();
                    handleCloseModal();
                }
            } else {
                const response = await apiClient.post('/admin/create', payload);
                if (response.data.success) {
                    toast.success('Admin created successfully');
                    fetchAdmins();
                    handleCloseModal();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save admin');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async (admin) => {
        if (admin.role === 'super_admin') return toast.error('Cannot block Super Admin');
        const action = admin.isBlocked ? 'unblock' : 'block';
        if (!window.confirm(`Are you sure you want to ${action} this admin?`)) return;

        setLoading(true);
        try {
            const response = await apiClient.post(`/admin/${admin._id}/${action}`);
            if (response.data.success) {
                toast.success(`Admin ${action}ed successfully`);
                fetchAdmins();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (admin) => {
        if (admin.role === 'super_admin') return toast.error('Cannot delete Super Admin');
        if (!window.confirm('Are you sure you want to delete this admin?')) return;

        setLoading(true);
        try {
            const response = await apiClient.delete(`/admin/${admin._id}`);
            if (response.data.success) {
                toast.success('Admin deleted successfully');
                fetchAdmins();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete admin');
        } finally {
            setLoading(false);
        }
    };

    if (loading && admins.length === 0) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium mb-3">
                            <Shield className="h-3.5 w-3.5" />
                            Admin Management
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Manage Administrators</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Total {admins.length} admin {admins.length === 1 ? 'user' : 'users'}
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Admin
                    </button>
                </div>

                {admins.length === 0 ? (
                    <div className="text-center py-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-amber-200/40">
                        <Users className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No admins found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {admins.map((admin, idx) => (
                            <motion.div
                                key={admin._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border ${admin.isBlocked ? 'border-red-200/50 opacity-75' : 'border-amber-200/40'} overflow-hidden transition-all duration-300`}>
                                    <div className={`h-1.5 w-full ${admin.role === 'super_admin' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-amber-400 to-amber-600'}`} />

                                    {admin.isBlocked && (
                                        <div className="absolute top-4 right-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                                <Ban className="h-3 w-3" /> Blocked
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-5">
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-inner">
                                                <User className="h-10 w-10 text-amber-700" />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
                                            {admin.name}
                                        </h3>
                                        <div className="text-center mb-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                                                <Shield className="h-3 w-3" />
                                                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                                <span className="truncate">{admin.email}</span>
                                            </div>
                                            {admin.phone && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                                    <span>{admin.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <button
                                                onClick={() => handleOpenModal(admin)}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                                            >
                                                <Edit className="h-4 w-4" /> Edit
                                            </button>
                                            {admin.role !== 'super_admin' && (
                                                <>
                                                    <button
                                                        onClick={() => handleBlockToggle(admin)}
                                                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-colors text-sm font-medium ${admin.isBlocked
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                            }`}
                                                    >
                                                        {admin.isBlocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                                        {admin.isBlocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(admin)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors text-sm font-medium"
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-amber-200/50"
                            >
                                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                                    </h2>
                                    <button onClick={handleCloseModal} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="admin@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="+91 1234567890"
                                        />
                                    </div>

                                    {!editingAdmin && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                placeholder="Minimum 6 characters"
                                                minLength={6}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            disabled={editingAdmin?.role === 'super_admin'}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                        {editingAdmin?.role === 'super_admin' && (
                                            <p className="text-xs text-gray-400 mt-1">Super Admin role cannot be changed</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : (editingAdmin ? 'Update Admin' : 'Create Admin')}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageAdmins;