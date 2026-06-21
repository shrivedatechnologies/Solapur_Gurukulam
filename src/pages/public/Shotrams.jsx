import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, Filter, Sparkles, Flame, ChevronDown, Check, Heart } from 'lucide-react';
import { shotramApi } from '../../api/shotram.api';
import { categoryApi } from '../../api/category.api';
import Loader from '../../components/common/Loader';

// ─── Helper: build absolute image URL ───
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// ─── Deity icons for fallback ───
const DEITY_ICONS = {
  shiva: '🕉️',
  durga: '🌺',
  ganesh: '🔱',
  vishnu: '☸️',
  lakshmi: '🌸',
  saraswati: '📖',
  hanuman: '🙏',
  rama: '🏹',
  krishna: '🪔',
  gayatri: '🕊️',
  default: '🕉️',
};

const getDeityIcon = (categoryName) => {
  if (!categoryName) return DEITY_ICONS.default;
  const name = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(DEITY_ICONS)) {
    if (name.includes(key)) return icon;
  }
  return DEITY_ICONS.default;
};

const Shotrams = () => {
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

  // ─── Handle click outside dropdown ───
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

  // ─── Fetch shotrams ───
  const { data: shotramResponse, isLoading } = useQuery({
    queryKey: ['shotrams-list', selectedCategory],
    queryFn: () =>
      selectedCategory
        ? shotramApi.getByCategory(selectedCategory, { limit: 200 })
        : shotramApi.getAll({ limit: 200 }),
  });

  const allShotrams = Array.isArray(shotramResponse?.data)
    ? shotramResponse.data
    : Array.isArray(shotramResponse)
    ? shotramResponse
    : [];

  const shotrams = allShotrams.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sanskrit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c._id === categoryId);
    return cat?.name || '';
  };

  // ─── Get category image or fallback icon ───
  const getCategoryImage = (categoryId) => {
    const cat = categories.find((c) => c._id === categoryId);
    if (cat?.image) {
      return getImageUrl(cat.image);
    }
    return null;
  };

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c._id === selectedCategory)?.name || 'All Categories'
    : 'All Categories';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
      {/* ─── HERO ─── REDUCED + BALANCED (same as Shlokas +5) ─── */}
      <section ref={heroRef} className="relative overflow-hidden pt-7 pb-8 md:pt-9 md:pb-11">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FDF3E0] to-[#FEF5E8] dark:from-gray-950 dark:via-[#1F132E] dark:to-gray-950" />
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
              transition={{
                duration: 3.5 + Math.random() * 3.5,
                repeat: Infinity,
                delay: Math.random() * 3.5,
              }}
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
            >
              <Flame className="h-7 w-7 text-amber-700" />
            </motion.span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          >
            Sacred Shotrams
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed"
          >
            Devotional hymns in praise of deities – chanting brings divine grace.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
              <input
                type="text"
                placeholder="Search by name, Sanskrit, or meaning..."
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
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-1.5 rounded-full">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>
                {shotrams.length} sacred {shotrams.length === 1 ? 'shotram' : 'shotrams'}
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
                className="text-xs text-amber-600 hover:text-amber-700 font-medium transition"
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
        ) : shotrams.length === 0 ? (
          <div className="text-center py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-amber-200/40">
            <Heart className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No shotrams found</p>
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {shotrams.map((shotram) => {
              const categoryId = shotram.category?._id || shotram.category;
              const cat = categories.find((c) => c._id === categoryId);
              const catImage = cat?.image ? getImageUrl(cat.image) : null;
              const deityIcon = cat?.name ? getDeityIcon(cat.name) : '🕉️';

              return (
                <motion.div
                  key={shotram._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="group"
                >
                  <Link to={`/shotram/${shotram.slug}`} className="block h-full">
                    <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-200/40">
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
                      <div className="p-5 pb-6">
                        <div className="flex items-start gap-3 mb-3">
                          {/* ── Category Image / Avatar ── */}
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                            {catImage ? (
                              <img
                                src={catImage}
                                alt={shotram.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to deity icon if image fails
                                  e.target.style.display = 'none';
                                  const parent = e.target.parentElement;
                                  parent.innerHTML = `<span class="text-xl">${deityIcon}</span>`;
                                }}
                              />
                            ) : (
                              <span className="text-xl">{deityIcon}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                              {shotram.name}
                            </h3>
                            {shotram.category?.name && (
                              <span className="inline-block mt-1 text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full px-2 py-0.5">
                                {shotram.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                        {shotram.sanskrit && (
                          <div className="mt-3 font-devanagari text-sm text-gray-600 dark:text-gray-300 line-clamp-3 bg-amber-50/40 dark:bg-amber-900/10 rounded-xl px-3 py-2 leading-relaxed">
                            {shotram.sanskrit.slice(0, 180)}
                          </div>
                        )}
                        {shotram.meaning && (
                          <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                            {shotram.meaning.slice(0, 100)}
                          </p>
                        )}
                        <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-xs text-gray-400 mr-1">Translations:</span>
                          {shotram.kannada && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                              ಕನ್ನಡ
                            </span>
                          )}
                          {shotram.marathi && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300">
                              मराठी
                            </span>
                          )}
                          {shotram.tamil && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300">
                              தமிழ்
                            </span>
                          )}
                          {shotram.hindi && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                              हिन्दी
                            </span>
                          )}
                          {shotram.english && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              English
                            </span>
                          )}
                          <div className="flex-1" />
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            👁 {shotram.views?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <span className="text-amber-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                            Explore <Heart className="h-4 w-4" />
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

export default Shotrams;