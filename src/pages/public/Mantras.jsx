import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, Filter, Sparkles, Star, Zap, ChevronDown, Check } from 'lucide-react';
import { mantraApi } from '../../api/mantra.api';
import { categoryApi } from '../../api/category.api';
import Loader from '../../components/common/Loader';

// ─── Helper: build absolute image URL ───
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// ─── Helper: get category image or fallback icon ───
const getCategoryImageOrIcon = (categoryId, categoriesList) => {
  const cat = categoriesList.find(c => c._id === categoryId);
  if (cat?.image) {
    return getImageUrl(cat.image);
  }
  return null;
};

const Mantras = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), { stiffness: 100, damping: 30 });

  // ─── Scroll to top on page load ───
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Fetch categories ───
  const { data: catResponse } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => categoryApi.getAll({ limit: 100 }),
  });
  const categories = Array.isArray(catResponse?.data) ? catResponse.data : [];

  // ─── Fetch mantras ───
  const { data: mantraResponse, isLoading } = useQuery({
    queryKey: ['mantras-list', selectedCategory],
    queryFn: () =>
      selectedCategory
        ? mantraApi.getByCategory(selectedCategory, { limit: 200 })
        : mantraApi.getAll({ limit: 200 }),
  });

  const allMantras = Array.isArray(mantraResponse?.data)
    ? mantraResponse.data
    : Array.isArray(mantraResponse)
    ? mantraResponse
    : [];

  const mantras = allMantras.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.benefits?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sanskrit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c._id === categoryId);
    return cat?.name || '';
  };

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c._id === selectedCategory)?.name || 'All Categories'
    : 'All Categories';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
      {/* ─── HERO ─── INCREASED BY +5 ─── */}
      <section ref={heroRef} className="relative overflow-hidden pt-7 pb-8 md:pt-9 md:pb-11">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FDF3E0] to-[#FEF5E8] dark:from-gray-950 dark:via-[#1F132E] dark:to-gray-950" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="absolute bottom-0 w-full h-32" preserveAspectRatio="none" viewBox="0 0 1440 200">
            <motion.path
              fill="none"
              stroke="#E8890A"
              strokeWidth="1.5"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,74.7C672,53,768,43,864,53.3C960,64,1056,96,1152,106.7C1248,117,1344,107,1392,101.3L1440,96L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
              animate={{
                d: [
                  "M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,74.7C672,53,768,43,864,53.3C960,64,1056,96,1152,106.7C1248,117,1344,107,1392,101.3L1440,96L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z",
                  "M0,32L48,58.7C96,85,192,139,288,144C384,149,480,107,576,85.3C672,64,768,64,864,74.7C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z",
                  "M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,74.7C672,53,768,43,864,53.3C960,64,1056,96,1152,106.7C1248,117,1344,107,1392,101.3L1440,96L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400/40"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-lg mb-3"
          >
            <motion.span
              animate={{ scale: [1, 1.06, 1], textShadow: ["0px 0px 0px #E8890A", "0px 0px 10px #E8890A", "0px 0px 0px #E8890A"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-3xl text-amber-700 font-serif"
            >
              ॐ
            </motion.span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Sacred Mantras
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed font-light"
          >
            Journey into the cosmic soundscape. Each mantra is a key.
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-4 h-6 rounded-full border border-amber-400 flex justify-center">
            <div className="w-0.5 h-1.5 bg-amber-400 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* ─── STICKY FILTER BAR ─── (unchanged) */}
      <div className="sticky top-0 z-20 bg-[#FDFAF5]/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-amber-200/30 py-4">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
              <input
                type="text"
                placeholder="Search by mantra name, benefit, or Sanskrit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-amber-200/50 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent outline-none transition shadow-sm text-sm sm:text-base"
              />
            </div>
            <div className="relative w-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-amber-200/50 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400/50 focus:border-transparent outline-none transition shadow-sm text-sm sm:text-base"
              >
                <span className="truncate">{selectedCategoryName}</span>
                <ChevronDown
                  className={`h-5 w-5 text-amber-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500 pointer-events-none z-10" />
              {dropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-gray-700 rounded-xl shadow-xl max-h-72 overflow-y-auto">
                  <div
                    className="px-4 py-3 cursor-pointer hover:bg-amber-50 dark:hover:bg-gray-700 flex items-center justify-between"
                    onClick={() => {
                      setSelectedCategory('');
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="text-gray-700 dark:text-gray-200">All Categories</span>
                    {selectedCategory === '' && <Check className="h-4 w-4 text-amber-600" />}
                  </div>
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="px-4 py-3 cursor-pointer hover:bg-amber-50 dark:hover:bg-gray-700 flex items-center justify-between"
                      onClick={() => {
                        setSelectedCategory(cat._id);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="text-gray-700 dark:text-gray-200">{cat.name}</span>
                      {selectedCategory === cat._id && <Check className="h-4 w-4 text-amber-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN GRID ─── with category images on cards ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!isLoading && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full break-words">
              <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span>
                {mantras.length} sacred {mantras.length === 1 ? 'mantra' : 'mantras'}
              </span>
              {selectedCategory && (
                <span className="ml-1">
                  in <span className="font-medium text-amber-600">{categories.find((c) => c._id === selectedCategory)?.name}</span>
                </span>
              )}
              {searchTerm && <span className="ml-1">for “{searchTerm}”</span>}
            </div>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium transition flex-shrink-0"
              >
                Clear filters ✕
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : mantras.length === 0 ? (
          <div className="text-center py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-amber-200/40">
            <Zap className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No mantras found</p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="mt-3 text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
          >
            {mantras.map((mantra) => {
              const categoryId = mantra.category?._id || mantra.category;
              const catImage = categoryId ? getCategoryImageOrIcon(categoryId, categories) : null;
              // Fallback to OM if no category image
              const avatarContent = catImage ? (
                <img
                  src={catImage}
                  alt={mantra.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    parent.innerHTML = `<span class="text-lg sm:text-xl text-amber-700">ॐ</span>`;
                  }}
                />
              ) : (
                <span className="text-lg sm:text-xl text-amber-700">ॐ</span>
              );

              return (
                <motion.div
                  key={mantra._id}
                  variants={itemVariants}
                  whileHover={{ rotate: 1, scale: 1.02 }}
                  className="group"
                >
                  <Link to={`/mantra/${mantra.slug}`} className="block h-full">
                    <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border border-amber-200/50 hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-amber-500/0 to-amber-600/0 group-hover:from-amber-400/5 group-hover:via-amber-500/5 transition-all duration-500" />
                      <div className="p-4 sm:p-5">
                        <div className="flex justify-between items-start gap-2">
                          {/* Avatar – now displays category image or OM fallback */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-tr from-amber-100 to-amber-200 flex items-center justify-center shadow-inner flex-shrink-0">
                            {avatarContent}
                          </div>
                          <span className="text-xs font-mono text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full flex-shrink-0">
                            #{mantra.views?.toLocaleString() || 0}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors mt-3 mb-1 break-words">
                          {mantra.name}
                        </h3>
                        {mantra.category?._id && (
                          <span className="inline-block text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full mb-2 break-words">
                            {getCategoryName(mantra.category._id)}
                          </span>
                        )}
                        {mantra.sanskrit && (
                          <p className="font-devanagari text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2 mb-2 break-words">
                            {mantra.sanskrit.slice(0, 70)}
                          </p>
                        )}
                        {mantra.benefits && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed break-words">
                            {mantra.benefits.slice(0, 80)}
                          </p>
                        )}
                        <div className="mt-4 flex flex-wrap justify-between items-center text-[11px] text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 gap-2">
                          <div className="flex flex-wrap gap-2">
                            {mantra.bestTime && <span>🕘 {mantra.bestTime}</span>}
                            {mantra.recommendedCount && <span>🔁 {mantra.recommendedCount}</span>}
                          </div>
                          <span className="text-amber-600 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            Read <Star className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Mantras;