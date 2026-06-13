import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, BookOpen, Compass, Sparkles } from 'lucide-react';
import { categoryApi } from '../../api/category.api';
import { mantraApi } from '../../api/mantra.api';
import { shlokaApi } from '../../api/shloka.api';
import { shotramApi } from '../../api/shotram.api';
import Loader from '../../components/common/Loader';

const TABS = [
    { key: 'mantras', label: 'Mantras' },
    { key: 'shlokas', label: 'Shlokas' },
    { key: 'shotrams', label: 'Shotrams' },
];

const CategoryDetails = () => {
    const { slug } = useParams();
    const [activeTab, setActiveTab] = useState('mantras');
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), { stiffness: 100, damping: 30 });

    const { data: categoryResponse, isLoading: categoryLoading } = useQuery({
        queryKey: ['category', slug],
        queryFn: () => categoryApi.getBySlug(slug),
    });
    const category = categoryResponse || null;

    const { data: mantrasResponse, isLoading: mantrasLoading } = useQuery({
        queryKey: ['category-mantras', category?._id],
        queryFn: () => mantraApi.getByCategory(category?._id),
        enabled: !!category?._id,
    });
    const { data: shlokasResponse, isLoading: shlokasLoading } = useQuery({
        queryKey: ['category-shlokas', category?._id],
        queryFn: () => shlokaApi.getByCategory(category?._id),
        enabled: !!category?._id,
    });
    const { data: shotramResponse, isLoading: shotramsLoading } = useQuery({
        queryKey: ['category-shotrams', category?._id],
        queryFn: () => shotramApi.getByCategory(category?._id),
        enabled: !!category?._id,
    });

    const mantras = Array.isArray(mantrasResponse?.data) ? mantrasResponse.data
        : Array.isArray(mantrasResponse) ? mantrasResponse : [];
    const shlokas = Array.isArray(shlokasResponse?.data) ? shlokasResponse.data
        : Array.isArray(shlokasResponse) ? shlokasResponse : [];
    const shotrams = Array.isArray(shotramResponse?.data) ? shotramResponse.data
        : Array.isArray(shotramResponse) ? shotramResponse : [];

    const isLoading = activeTab === 'mantras' ? mantrasLoading
        : activeTab === 'shlokas' ? shlokasLoading
        : shotramsLoading;

    const activeItems = activeTab === 'mantras' ? mantras
        : activeTab === 'shlokas' ? shlokas
        : shotrams;

    const getItemLink = (item) => {
        if (activeTab === 'mantras') return `/mantra/${item.slug}`;
        if (activeTab === 'shlokas') return `/shloka/${item.slug}`;
        return `/shotram/${item.slug}`;
    };

    const getItemDescription = (item) => {
        if (activeTab === 'mantras') return item.benefits;
        return item.meaning || item.sanskrit?.slice(0, 120);
    };

    if (categoryLoading) return <Loader fullScreen />;

    if (!category) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Category not found</h1>
                    <Link to="/categories" className="text-amber-600 mt-4 inline-block hover:underline">Back to Categories</Link>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
            <section ref={heroRef} className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-28">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FDF3E0] to-[#FEF5E8] dark:from-gray-950 dark:via-[#1F132E] dark:to-gray-950" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-amber-400/30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{ y: [0, -30, 0], opacity: [0, 0.5, 0] }}
                            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
                        />
                    ))}
                </div>

                <motion.div style={{ y: yParallax }} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', bounce: 0.3 }}
                        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-xl mb-6"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.08, 1], textShadow: ["0px 0px 0px #E8890A", "0px 0px 12px #E8890A", "0px 0px 0px #E8890A"] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Compass className="h-10 w-10 text-amber-700" />
                        </motion.span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
                    >
                        {category.name}
                    </motion.h1>
                    
                    {category.description && (
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed"
                        >
                            {category.description}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <div className="w-5 h-8 rounded-full border border-amber-400 flex justify-center">
                        <div className="w-0.5 h-1.5 bg-amber-400 rounded-full mt-2" />
                    </div>
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <Link
                    to="/categories"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors mb-6 text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Categories
                </Link>

                <div className="flex flex-wrap gap-2 mb-8 border-b border-amber-200/40 dark:border-gray-700">
                    {TABS.map((tab) => {
                        const count = tab.key === 'mantras' ? mantras.length
                            : tab.key === 'shlokas' ? shlokas.length
                            : shotrams.length;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-3 font-semibold text-sm transition-all duration-200 -mb-px ${
                                    activeTab === tab.key
                                        ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400'
                                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                {tab.label}
                                {(!mantrasLoading || !shlokasLoading || !shotramsLoading) && (
                                    <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full px-2 py-0.5">
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader /></div>
                ) : activeItems.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-amber-200/40">
                        <BookOpen className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No {activeTab} found in this category yet.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {activeItems.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                variants={itemVariants}
                                whileHover={{ y: -6 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            >
                                <Link to={getItemLink(item)} className="block h-full">
                                    <div className="group relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-200/40">
                                        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600" />
                                        
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors mb-2">
                                                {item.name}
                                            </h3>
                                            
                                            {getItemDescription(item) && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed mb-3">
                                                    {getItemDescription(item).slice(0, 110)}
                                                </p>
                                            )}
                                            
                                            {item.sanskrit && (
                                                <p className="font-devanagari text-xs text-gray-500 dark:text-gray-400 line-clamp-2 bg-amber-50/40 dark:bg-amber-900/10 rounded-lg px-3 py-2">
                                                    {item.sanskrit.slice(0, 80)}...
                                                </p>
                                            )}
                                            
                                            <div className="mt-4 flex justify-end">
                                                <span className="text-amber-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                                    Explore <Sparkles className="h-4 w-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CategoryDetails;