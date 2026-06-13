import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Users, BookOpen, Mic, Library, TrendingUp, Eye, Calendar, ArrowUp, ArrowDown, Sparkles, Compass } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard.api';
import { setStats, setTopMantras, setTopShlokas, setUserAnalytics, setReadAnalytics, setLoading, setError } from '../../store/dashboardSlice';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardHome = () => {
    const dispatch = useDispatch();
    const { stats, topMantras, topShlokas, userAnalytics, readAnalytics, isLoading } = useSelector((state) => state.dashboard);
    const { user } = useSelector((state) => state.auth);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), { stiffness: 100, damping: 30 });

    const safeTopMantras = Array.isArray(topMantras) ? topMantras : [];
    const safeTopShlokas = Array.isArray(topShlokas) ? topShlokas : [];
    const safeUserAnalytics = Array.isArray(userAnalytics?.growth) ? userAnalytics.growth : [];
    const safeReadAnalytics = Array.isArray(readAnalytics?.views) ? readAnalytics.views : [];

    const { isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            try {
                const data = await dashboardApi.getStats();
                dispatch(setStats(data));
                return data;
            } catch (error) {
                console.error('Error fetching stats:', error);
                return null;
            }
        },
    });

    const { isLoading: topMantrasLoading } = useQuery({
        queryKey: ['top-mantras'],
        queryFn: async () => {
            try {
                const data = await dashboardApi.getTopMantras();
                const mantrasArray = Array.isArray(data) ? data : (data?.data || data?.mantras || []);
                dispatch(setTopMantras(mantrasArray));
                return mantrasArray;
            } catch (error) {
                console.error('Error fetching top mantras:', error);
                dispatch(setTopMantras([]));
                return [];
            }
        },
    });

    const { isLoading: analyticsLoading } = useQuery({
        queryKey: ['dashboard-analytics'],
        queryFn: async () => {
            try {
                const [userData, readData] = await Promise.all([
                    dashboardApi.getUserAnalytics(),
                    dashboardApi.getReadAnalytics(),
                ]);
                dispatch(setUserAnalytics(userData || { growth: [] }));
                dispatch(setReadAnalytics(readData || { views: [] }));
                return { userData, readData };
            } catch (error) {
                console.error('Error fetching analytics:', error);
                dispatch(setUserAnalytics({ growth: [] }));
                dispatch(setReadAnalytics({ views: [] }));
                return null;
            }
        },
    });

    const statCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', textLight: 'text-blue-600', change: '+12%', trend: 'up' },
        { title: 'Total Categories', value: stats?.totalCategories || 0, icon: Library, color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50', textLight: 'text-emerald-600', change: '+5%', trend: 'up' },
        { title: 'Total Mantras', value: stats?.totalMantras || 0, icon: Mic, color: 'from-purple-500 to-pink-600', bgLight: 'bg-purple-50', textLight: 'text-purple-600', change: '+8%', trend: 'up' },
        { title: 'Total Shlokas', value: stats?.totalShlokas || 0, icon: BookOpen, color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', textLight: 'text-amber-600', change: '+15%', trend: 'up' },
    ];

    const COLORS = ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#3b82f6'];
    const pieData = [
        { name: 'Mantras', value: stats?.totalMantras || 0 },
        { name: 'Shlokas', value: stats?.totalShlokas || 0 },
        { name: 'Categories', value: stats?.totalCategories || 0 },
        { name: 'Users', value: stats?.totalUsers || 0 },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    if (statsLoading || topMantrasLoading || analyticsLoading) return <Loader fullScreen />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 overflow-x-hidden pb-10">
            <section ref={heroRef} className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-amber-50/20 dark:from-indigo-950/20 dark:to-amber-950/10" />
                <div className="absolute top-20 right-0 w-72 h-72 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />

                <motion.div style={{ y: yParallax }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-amber-200/40 mb-4">
                                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Dashboard</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Here's what's happening with your platform today.</p>
                        </motion.div>

                        {user?.role === 'super_admin' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <Compass className="h-5 w-5" />
                                    <span className="font-semibold">Super Admin Access</span>
                                </div>
                                <p className="text-xs text-white/80 mt-1">Full control over all content</p>
                            </motion.div>
                        )}
                        {user?.role === 'admin' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span className="font-semibold">Admin Access</span>
                                </div>
                                <p className="text-xs text-white/80 mt-1">Manage mantras, shlokas & content</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <div className="w-4 h-6 rounded-full border border-amber-400 flex justify-center">
                        <div className="w-0.5 h-1.5 bg-amber-400 rounded-full mt-1.5" />
                    </div>
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
                >
                    {statCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <motion.div key={card.title} variants={itemVariants} whileHover={{ y: -4 }}>
                                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-gray-200/50 dark:border-gray-700 overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition`} />
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-3 rounded-xl ${card.bgLight} dark:bg-opacity-20`}>
                                            <Icon className={`h-6 w-6 ${card.textLight}`} />
                                        </div>
                                        <span className={`flex items-center gap-0.5 text-sm font-medium ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {card.trend === 'up' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                                            {card.change}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{card.value.toLocaleString()}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{card.title}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 p-5"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                            User Growth
                        </h3>
                        <div className="h-80">
                            {safeUserAnalytics.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={safeUserAnalytics}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 p-5"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Eye className="h-5 w-5 text-amber-500" />
                            Content Views
                        </h3>
                        <div className="h-80">
                            {safeReadAnalytics.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={safeReadAnalytics}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
                                        <Legend />
                                        <Bar dataKey="mantras" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="shlokas" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                            )}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 p-5"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Content Distribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''} outerRadius={90} fill="#8884d8" dataKey="value">
                                        {pieData.map((entry, idx) => (
                                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 p-5"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-amber-500" />
                            Recent Activity
                        </h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {readAnalytics?.recent?.slice(0, 5).map((activity, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white">{activity?.content || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{activity?.type || 'view'} activity</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <Eye className="h-4 w-4" />
                                        <span>{activity?.views || 0} views</span>
                                    </div>
                                </motion.div>
                            ))}
                            {(!readAnalytics?.recent || readAnalytics.recent.length === 0) && (
                                <div className="text-center py-8 text-gray-400">No recent activity</div>
                            )}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 p-5"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Mic className="h-5 w-5 text-purple-500" />
                            Most Popular Mantras
                        </h3>
                        <div className="space-y-3">
                            {safeTopMantras.length > 0 ? (
                                safeTopMantras.slice(0, 5).map((mantra, idx) => (
                                    <motion.div
                                        key={mantra?._id || idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">{mantra?.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500">{mantra?.totalShlokas || 0} shlokas</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <Eye className="h-4 w-4" />
                                            <span>{(mantra?.views || 0).toLocaleString()} views</span>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">No mantras data available</div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 p-5"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-emerald-500" />
                            Most Read Shlokas
                        </h3>
                        <div className="space-y-3">
                            {safeTopShlokas.length > 0 ? (
                                safeTopShlokas.slice(0, 5).map((shloka, idx) => (
                                    <motion.div
                                        key={shloka?._id || idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">{shloka?.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1">{shloka?.sanskrit?.substring(0, 50) || ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <Eye className="h-4 w-4" />
                                            <span>{(shloka?.views || 0).toLocaleString()} views</span>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">No shlokas data available</div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;