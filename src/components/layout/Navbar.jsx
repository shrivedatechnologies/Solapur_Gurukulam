import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { logout } from "../../store/authSlice";
import { toggleDarkMode } from "../../store/themeSlice";
import LanguageSelector from "../common/LanguageSelector";

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logged out successfully");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Mantras", path: "/mantras" },
    { name: "Shlokas", path: "/shlokas" },
    { name: "Shotrams", path: "/shotrams" },
  ];

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", bounce: 0.4, duration: 0.6 },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const profileDropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.25 } },
  };

  return (
    <motion.nav
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md border-b border-amber-200/50 dark:border-gray-700"
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 px-2 sm:px-4">
          {/* Logo – two lines */}
          <Link
            to="/"
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <motion.div
              variants={logoVariants}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all"
            >
              <span className="text-white text-base sm:text-lg">ॐ</span>
            </motion.div>
            <div className="flex flex-col leading-tight">
              <motion.span
                variants={linkVariants}
                className="font-bold bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent text-sm sm:text-lg whitespace-nowrap"
              >
                Solapur
              </motion.span>
              <motion.span
                variants={linkVariants}
                className="font-bold bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent text-sm sm:text-lg whitespace-nowrap -mt-0.5"
              >
                Gurukulam
              </motion.span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={linkVariants}>
                  <Link
                    to={link.path}
                    className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Right Section – no SearchBar */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {/* Language Selector – always visible on navbar */}
            {isAuthenticated && (
              <motion.div variants={linkVariants}>
                <LanguageSelector variant="navbar" />
              </motion.div>
            )}

            {/* Theme Toggle – hidden on mobile (only in mobile menu) */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleDarkMode())}
              className="hidden sm:flex p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 p-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <motion.div
                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:block"
                  >
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div
                        variants={profileDropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-52 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl py-2 z-50 border border-amber-100 dark:border-gray-700"
                      >
                        <div className="px-4 py-2 border-b dark:border-gray-700 mb-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {user?.role === "super_admin"
                              ? "🔱 Super Admin"
                              : user?.role === "admin"
                                ? "👑 Admin"
                                : "👤 User"}
                          </p>
                        </div>
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-sm"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span className="mr-2">📊</span>
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-sm"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-sm"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                        <div className="border-t dark:border-gray-700 mt-1 pt-1">
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsProfileOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div variants={linkVariants}>
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm font-medium"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={linkVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isAuthenticated && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Menu – SearchBar removed */}
        <AnimatePresence>
          {isAuthenticated && isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-amber-200/50 dark:border-gray-700">
                <div className="space-y-2">
                  {/* Theme toggle in mobile menu */}
                  <div className="px-2 py-2 flex items-center justify-between border-b border-amber-200/50 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Dark Mode:
                    </span>
                    <button
                      onClick={() => dispatch(toggleDarkMode())}
                      className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 transition-colors"
                    >
                      {darkMode ? (
                        <Sun className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Moon className="h-5 w-5 text-amber-600" />
                      )}
                    </button>
                  </div>

                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-amber-200/50 dark:border-gray-700">
                    <Link
                      to="/dashboard"
                      className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-amber-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;