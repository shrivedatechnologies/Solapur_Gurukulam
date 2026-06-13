import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import axios from 'axios';
import { Users, Eye, TrendingUp, BookOpen, Mic, Calendar, Sparkles, ArrowUpRight } from 'lucide-react';
import Loader from '../../components/common/Loader';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const dashboardApi = {
    getStats: async () => {
        try {
            const response = await apiClient.get('/dashboard/stats');
            if (response.data.success) return response.data.data;
            return {};
        } catch (error) {
            console.error('Stats API error:', error);
            return {};
        }
    },
    getTopMantras: async () => {
        try {
            const response = await apiClient.get('/dashboard/top-mantras');
            if (response.data.success) return response.data.data || [];
            return [];
        } catch (error) {
            console.error('Top mantras API error:', error);
            return [];
        }
    },
    getTopShlokas: async () => {
        try {
            const response = await apiClient.get('/dashboard/top-shlokas');
            if (response.data.success) return response.data.data || [];
            return [];
        } catch (error) {
            console.error('Top shlokas API error:', error);
            return [];
        }
    },
    getUserAnalytics: async () => {
        try {
            const response = await apiClient.get('/dashboard/user-analytics');
            if (response.data.success) return response.data.data;
            return {};
        } catch (error) {
            console.error('User analytics API error:', error);
            return {};
        }
    },
    getReadAnalytics: async () => {
        try {
            const response = await apiClient.get('/dashboard/read-analytics');
            if (response.data.success) return response.data.data;
            return {};
        } catch (error) {
            console.error('Read analytics API error:', error);
            return {};
        }
    }
};

const Analytics = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), { stiffness: 100, damping: 30 });

    const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
        queryKey: ['analytics-stats'],
        queryFn: () => dashboardApi.getStats(),
    });

    const { data: topMantras, isLoading: mantrasLoading, error: mantrasError } = useQuery({
        queryKey: ['analytics-top-mantras'],
        queryFn: () => dashboardApi.getTopMantras(),
    });

    const { data: topShlokas, isLoading: shlokasLoading, error: shlokasError } = useQuery({
        queryKey: ['analytics-top-shlokas'],
        queryFn: () => dashboardApi.getTopShlokas(),
    });

    if (statsError) console.error('Stats error:', statsError);
    if (mantrasError) console.error('Mantras error:', mantrasError);
    if (shlokasError) console.error('Shlokas error:', shlokasError);

    if (statsLoading || mantrasLoading || shlokasLoading) {
        return <Loader fullScreen />;
    }

    const statCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', textLight: 'text-blue-600' },
        { title: 'Total Mantras', value: stats?.totalMantras || 0, icon: Mic, color: 'from-purple-500 to-pink-600', bgLight: 'bg-purple-50', textLight: 'text-purple-600' },
        { title: 'Total Shlokas', value: stats?.totalShlokas || 0, icon: BookOpen, color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50', textLight: 'text-emerald-600' },
        { title: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', textLight: 'text-amber-600' },
    ];

    const mantrasList = Array.isArray(topMantras) ? topMantras : [];
    const shlokasList = Array.isArray(topShlokas) ? topShlokas : [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
            <section ref={heroRef} className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-transparent to-amber-50/30 dark:from-indigo-950/20 dark:to-amber-950/10" />
                <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-indigo-300/10 blur-3xl animate-pulse" />
                <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-amber-300/10 blur-3xl animate-pulse" />

                <motion.div style={{ y: yParallax }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-indigo-200/40 mb-4">
                            <TrendingUp className="h-4 w-4 text-indigo-500" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Platform Analytics</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Analytics Dashboard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base mt-3 max-w-2xl mx-auto">
                            Track your platform's growth, most popular content, and user engagement.
                        </p>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <div className="w-5 h-8 rounded-full border border-indigo-400 flex justify-center">
                        <div className="w-0.5 h-1.5 bg-indigo-400 rounded-full mt-2" />
                    </div>
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
                >
                    {statCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <motion.div key={idx} variants={itemVariants} whileHover={{ y: -4 }}>
                                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-indigo-100/50 dark:border-gray-700 overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition`} />
                                    <div className="flex items-center justify-between">
                                        <div className={`p-3 rounded-xl ${card.bgLight} dark:bg-opacity-20`}>
                                            <Icon className={`h-6 w-6 ${card.textLight}`} />
                                        </div>
                                        <span className="text-3xl font-bold text-gray-800 dark:text-white">{card.value.toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">{card.title}</p>
                                    <div className="mt-2 flex items-center gap-1 text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition">
                                        <span>View details</span>
                                        <ArrowUpRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-indigo-100/50 overflow-hidden"
                    >
                        <div className="p-5 border-b border-indigo-100/50 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Mic className="h-5 w-5 text-purple-500" />
                                    <span className="text-gray-800 dark:text-white">Most Popular Mantras</span>
                                </h3>
                                <Sparkles className="h-4 w-4 text-amber-400" />
                            </div>
                        </div>
                        <div className="p-4 divide-y divide-indigo-50 dark:divide-gray-700">
                            {mantrasList.length > 0 ? (
                                mantrasList.slice(0, 5).map((m, i) => (
                                    <motion.div
                                        key={m._id || i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-indigo-50/30 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                {i + 1}
                                            </span>
                                            <span className="font-medium text-gray-700 dark:text-gray-200">{m?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>{m?.views?.toLocaleString() || 0} views</span>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <Mic className="h-10 w-10 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No mantra data available</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-indigo-100/50 overflow-hidden"
                    >
                        <div className="p-5 border-b border-indigo-100/50 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-emerald-500" />
                                    <span className="text-gray-800 dark:text-white">Most Read Shlokas</span>
                                </h3>
                                <Sparkles className="h-4 w-4 text-amber-400" />
                            </div>
                        </div>
                        <div className="p-4 divide-y divide-indigo-50 dark:divide-gray-700">
                            {shlokasList.length > 0 ? (
                                shlokasList.slice(0, 5).map((s, i) => (
                                    <motion.div
                                        key={s._id || i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-indigo-50/30 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                {i + 1}
                                            </span>
                                            <span className="font-medium text-gray-700 dark:text-gray-200">{s?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>{s?.views?.toLocaleString() || 0} reads</span>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No shloka data available</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-gray-400 border-t pt-6 mt-8">
                        <details>
                            <summary className="cursor-pointer">Debug Info (Click to expand)</summary>
                            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-auto text-xs">
                                {JSON.stringify({ stats, topMantras: mantrasList.length, topShlokas: shlokasList.length }, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;