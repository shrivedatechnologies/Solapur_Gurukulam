import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { categoryApi } from "../../api/category.api";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { Search, Compass, Sparkles, ArrowRight } from "lucide-react";

const DEITY_ICONS = ["🕉️", "🔱", "🪔", "🌺", "☸️", "🐚", "🌸", "🙏"];

// ─── Helper: construct absolute image URL ───
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const Categories = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), { stiffness: 100, damping: 30 });

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ─── Scroll to top on page load ───
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCategoryClick = (slug) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/category/${slug}`);
    } else {
      navigate(`/category/${slug}`);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["categories", page, debouncedSearch],
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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
      {/* ─── HERO ─── REDUCED + BALANCED ─── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-7 pb-8 md:pt-9 md:pb-11"
      >
        {/* Background image with reduced opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1508580017488-4d0d21e1ba9b?w=1600&q=80")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7]/80 via-[#FDF3E0]/80 to-[#FEF5E8]/80 dark:from-gray-950/90 dark:via-[#1F132E]/90 dark:to-gray-950/90" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -25, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: 3.5 + Math.random() * 3.5, repeat: Infinity, delay: Math.random() * 3.5 }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: yParallax }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
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
            className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          >
            Explore Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed"
          >
            Find mantras, shlokas, and shotrams organized by sacred traditions.
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

      {/* ─── SEARCH ─── (unchanged) */}
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

      {/* ─── CATEGORIES GRID ─── */}
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {categories.map((category, idx) => {
                const icon = DEITY_ICONS[idx % DEITY_ICONS.length];
                const imageUrl = getImageUrl(category.image);
                return (
                  <motion.div
                    key={category._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                    className="group cursor-pointer"
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-amber-200/40 dark:border-gray-700/50 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      {/* Gradient border glow on hover */}
                      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 group-hover:from-amber-400/50 group-hover:via-amber-400/30 group-hover:to-amber-400/50 transition-all duration-700" />
                      
                      <div className="relative p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Icon / Image section */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={category.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                const parent = e.target.parentElement;
                                const iconSpan = document.createElement("span");
                                iconSpan.className = "text-3xl";
                                iconSpan.textContent = icon;
                                parent.appendChild(iconSpan);
                              }}
                            />
                          ) : (
                            <span className="text-3xl">{icon}</span>
                          )}
                        </div>
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-amber-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                            {category.description || "Explore sacred mantras, shlokas and shotrams from this tradition."}
                          </p>
                          {/* Decorative progress bar */}
                          <div className="mt-2 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700 group-hover:w-full w-1/3"
                              style={{ width: `${Math.min(100, (category.mantraCount || 0) * 5)}%` }}
                            />
                          </div>
                        </div>
                        {/* Action arrow */}
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            Explore <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                      {/* Count badge */}
                      <div className="absolute top-2 right-2">
                        <span className="inline-block text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full">
                          {category.mantraCount || 0} mantras
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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