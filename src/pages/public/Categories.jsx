import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { categoryApi } from '../../api/category.api';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import { Search, Compass, Sparkles } from 'lucide-react';

const Categories = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), { stiffness: 100, damping: 30 });

    const { data, isLoading } = useQuery({
        queryKey: ['categories', page, debouncedSearch],
        queryFn: () => categoryApi.getAll({ page, limit: 12, search: debouncedSearch }),
    });

    const categories = Array.isArray(data?.data) ? data.data : [];
    const totalPages = data?.pagination?.pages || 1;

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setTimeout(() => {
            setDebouncedSearch(e.target.value);
            setPage(1);
        }, 500);
    };

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
                    {[...Array(8)].map((_, i) => (
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
                        className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                    >
                        Explore Categories
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed"
                    >
                        Find mantras, shlokas, and shotrams organized by sacred traditions.
                    </motion.p>
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

            <div className="sticky top-0 z-20 bg-[#FDFAF5]/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-amber-200/30 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search categories..."
                                className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-amber-200/50 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent outline-none transition shadow-sm text-sm sm:text-base"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader /></div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-amber-200/40">
                        <Compass className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No categories found</p>
                    </div>
                ) : (
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {categories.map((category, idx) => (
                                <motion.div
                                    key={category._id}
                                    variants={itemVariants}
                                    whileHover={{ y: -6 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                >
                                    <Link to={`/category/${category.slug}`} className="block h-full">
                                        <div className="group relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-200/40">
                                            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600" />
                                            
                                            <div className="relative h-44 overflow-hidden">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                    />
                                                ) : null}
                                                <div className={`w-full h-full ${category.image ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200`}>
                                                    <span className="text-5xl">🕉️</span>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{category.name}</h3>
                                                    <span className="inline-block text-xs font-semibold bg-amber-600/90 text-white px-2 py-0.5 rounded-full">
                                                        {category.mantraCount || 0} Mantras
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                                    {category.description || 'Explore sacred mantras, shlokas and shotrams from this tradition.'}
                                                </p>
                                                <div className="mt-3 flex justify-end">
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

                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Categories;