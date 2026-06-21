import { useState, useRef, useEffect } from 'react';
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

// ─── Helper: build absolute image URL ───
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// ─── Get a deity icon based on category name ───
const getDeityIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || '';
  if (name.includes('ganesh') || name.includes('ganapati')) return '🔱';
  if (name.includes('shiva') || name.includes('mahadev')) return '🕉️';
  if (name.includes('durga') || name.includes('devi') || name.includes('goddess')) return '🌺';
  if (name.includes('vishnu') || name.includes('narayan')) return '☸️';
  if (name.includes('lakshmi')) return '🌸';
  if (name.includes('saraswati')) return '📖';
  if (name.includes('hanuman')) return '🙏';
  if (name.includes('rama')) return '🏹';
  if (name.includes('krishna')) return '🪔';
  if (name.includes('gayatri')) return '🕊️';
  return '🕉️';
};

const CategoryDetails = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('mantras');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), { stiffness: 100, damping: 30 });

  // ─── Scroll to top on page load ───
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  // ─── Category image / icon to display on every card ───
  const categoryImageUrl = category ? getImageUrl(category.image) : null;
  const categoryIcon = category ? getDeityIcon(category.name) : '🕉️';

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
      {/* ─── HERO ─── REDUCED HEIGHT ─── */}
      <section ref={heroRef} className="relative overflow-hidden pt-7 pb-8 md:pt-9 md:pb-11">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FDF3E0] to-[#FEF5E8] dark:from-gray-950 dark:via-[#1F132E] dark:to-gray-950" />
        
        {categoryImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-5"
            style={{ backgroundImage: `url(${categoryImageUrl})` }}
          />
        )}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -25, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: 3.5 + Math.random() * 3.5, repeat: Infinity, delay: Math.random() * 3.5 }}
            />
          ))}
        </div>

        <motion.div style={{ y: yParallax }} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-lg mb-3 overflow-hidden"
          >
            {categoryImageUrl ? (
              <img
                src={categoryImageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span class="text-3xl text-amber-700">${categoryIcon}</span>`;
                }}
              />
            ) : (
              <span className="text-3xl text-amber-700">{categoryIcon}</span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
          >
            {category.name}
          </motion.h1>
          
          {category.description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed"
            >
              {category.description}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-4 h-6 rounded-full border border-amber-400 flex justify-center">
            <div className="w-0.5 h-1.5 bg-amber-400 rounded-full mt-1.5" />
          </div>
        </motion.div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>

        {/* Tabs */}
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

        {/* Items Grid – with category image/icon on every card and light hover effect */}
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {activeItems.map((item, idx) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                className="group cursor-pointer"
              >
                <Link to={getItemLink(item)} className="block h-full">
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-amber-200/40 dark:border-gray-700/50 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full hover:bg-amber-50/50 dark:hover:bg-gray-700/50">
                    {/* Gradient border glow on hover */}
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 group-hover:from-amber-400/50 group-hover:via-amber-400/30 group-hover:to-amber-400/50 transition-all duration-700" />
                    
                    <div className="relative p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
                      {/* Category Image / Icon on every card */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {categoryImageUrl ? (
                          <img
                            src={categoryImageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              parent.innerHTML = `<span class="text-3xl">${categoryIcon}</span>`;
                            }}
                          />
                        ) : (
                          <span className="text-3xl">{categoryIcon}</span>
                        )}
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-amber-600 transition-colors">
                          {item.name}
                        </h3>
                        {getItemDescription(item) && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                            {getItemDescription(item).slice(0, 110)}
                          </p>
                        )}
                        {item.sanskrit && (
                          <p className="font-devanagari text-xs text-gray-500 dark:text-gray-400 line-clamp-2 bg-amber-50/40 dark:bg-amber-900/10 rounded-lg px-3 py-2 mt-2">
                            {item.sanskrit.slice(0, 80)}...
                          </p>
                        )}
                        {/* Decorative progress bar (views) */}
                        <div className="mt-2 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700 group-hover:w-full w-1/3"
                            style={{ width: `${Math.min(100, (item.views || 0) * 2)}%` }}
                          />
                        </div>
                      </div>
                      {/* Action arrow */}
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          Explore <Sparkles className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                    {/* Views badge */}
                    <div className="absolute top-2 right-2">
                      <span className="inline-block text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full">
                        {item.views || 0} views
                      </span>
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