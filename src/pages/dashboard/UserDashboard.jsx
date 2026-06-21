// src/pages/dashboard/UserDashboard.jsx
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { User, Heart, Compass, ArrowUpRight, Sparkles, BookOpen, Mic, Library, Sun, Moon } from "lucide-react";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  // Optional: if you have favourites count from Redux, we could show it.
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), {
    stiffness: 100,
    damping: 30,
  });

  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-gray-50 to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden">
      
      {/* ─── HERO ─── with OM symbol and greeting */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-amber-50/20 dark:from-indigo-950/20 dark:to-amber-950/10" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />

        <motion.div
          style={{ y: yParallax }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-amber-200/40 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  My Dashboard
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {greeting}, {user?.name?.split(" ")[0] || "Seeker"}! 🙏
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
                Explore mantras, shlokas, and shotrams on your spiritual journey.
              </p>
            </motion.div>

            {/* OM symbol */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4, delay: 0.3 }}
              className="flex-shrink-0"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 dark:from-amber-500/10 dark:to-amber-700/10 backdrop-blur-sm border border-amber-400/30 flex items-center justify-center shadow-lg">
                <span className="text-3xl sm:text-4xl text-amber-700 dark:text-amber-400 font-serif">ॐ</span>
              </div>
            </motion.div>
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

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Card 1: Your Profile */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6 }}
            className="group"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-amber-200/40 p-6 h-full transition-all duration-300 hover:shadow-xl hover:border-amber-300/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">Your Profile</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Name:</span> {user?.name || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Email:</span> {user?.email || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 capitalize">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Role:</span> {user?.role || "user"}
                </p>
              </div>
              <Link
                to="/dashboard/profile"
                className="mt-5 inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium group-hover:gap-2 transition-all"
              >
                Edit Profile <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Favourites */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6 }}
            className="group"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-amber-200/40 p-6 h-full transition-all duration-300 hover:shadow-xl hover:border-amber-300/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">Your Favourites</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You haven't saved any favourites yet.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Start exploring and save your favourite mantras, shlokas, and shotrams.
              </p>
              <Link
                to="/dashboard/favourites"
                className="mt-5 inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium group-hover:gap-2 transition-all"
              >
                View Favourites <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3: Quick Links */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6 }}
            className="group"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-amber-200/40 p-6 h-full transition-all duration-300 hover:shadow-xl hover:border-amber-300/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                  <Compass className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">Explore</h3>
              </div>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/mantras"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group-hover:translate-x-1 transition-transform duration-200"
                  >
                    <Mic className="h-4 w-4 text-purple-500" />
                    Browse Mantras
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shlokas"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group-hover:translate-x-1 transition-transform duration-200"
                  >
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    Browse Shlokas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shotrams"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group-hover:translate-x-1 transition-transform duration-200"
                  >
                    <Library className="h-4 w-4 text-amber-500" />
                    Browse Shotrams
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group-hover:translate-x-1 transition-transform duration-200"
                  >
                    <Compass className="h-4 w-4 text-blue-500" />
                    Categories
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── INSPIRATIONAL QUOTE ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-amber-200/30 text-center max-w-3xl mx-auto"
        >
          <div className="flex justify-center mb-3">
            <span className="text-3xl">🕉️</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base italic leading-relaxed">
            "ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै ।"<br />
            <span className="text-xs text-gray-400 dark:text-gray-500 block mt-1">
              — Taittiriya Upanishad (May we all be protected, may we all enjoy, may we all work together)
            </span>
          </p>
        </motion.div>

        {/* ─── FOOTER NOTE ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-400 dark:text-gray-500 text-xs"
        >
          <p>🙏 May your spiritual journey be blessed with peace and wisdom.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;