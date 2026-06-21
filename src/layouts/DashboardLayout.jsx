import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Moon,
  Sun,
  LayoutDashboard,
  BookOpen,
  Mic,
  Library,
  Home,
  Settings,
  User,
  TrendingUp,
  Shield,
  LogOut,
  Heart,
  X,
  Layers,
} from "lucide-react";
import { toggleDarkMode } from "../store/themeSlice";
import toast from "react-hot-toast";
import { logout } from "../store/authSlice";
import { selectFavouritesCount } from "../store/favouriteSlice";

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logged out successfully");
  };

  const getMenuItems = () => {
    const role = user?.role;
    const allItems = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        roles: ["user", "admin", "super_admin"],
      },
      {
        name: "Favourites",
        path: "/dashboard/favourites",
        icon: Heart,
        roles: ["user", "admin", "super_admin"],
      },
      { divider: true },
      {
        name: "━━━ CONTENT ━━━",
        path: null,
        icon: null,
        roles: ["admin", "super_admin"],
        isHeader: true,
      },
      {
        name: "Manage Mantras",
        path: "/dashboard/mantras",
        icon: Mic,
        roles: ["admin", "super_admin"],
      },
      {
        name: "Manage Shlokas",
        path: "/dashboard/shlokas",
        icon: BookOpen,
        roles: ["admin", "super_admin"],
      },
      {
        name: "Manage Shotrams",
        path: "/dashboard/shotrams",
        icon: Layers,
        roles: ["admin", "super_admin"],
      },
      {
        name: "Manage Categories",
        path: "/dashboard/categories",
        icon: Library,
        roles: ["super_admin"],
      },
      { divider: true },
      {
        name: "━━━ HOMEPAGE ━━━",
        path: null,
        icon: null,
        roles: ["admin", "super_admin"],
        isHeader: true,
      },
      // "Manage Homepage" item removed as requested
      {
        name: "Analytics",
        path: "/dashboard/analytics",
        icon: TrendingUp,
        roles: ["admin", "super_admin"],
      },
      { divider: true },
      {
        name: "━━━ ADMIN ━━━",
        path: null,
        icon: null,
        roles: ["super_admin"],
        isHeader: true,
      },
      {
        name: "Manage Admins",
        path: "/dashboard/admins",
        icon: Shield,
        roles: ["super_admin"],
      },
      { divider: true },
      {
        name: "━━━ ACCOUNT ━━━",
        path: null,
        icon: null,
        roles: ["user", "admin", "super_admin"],
        isHeader: true,
      },
      {
        name: "Profile",
        path: "/dashboard/profile",
        icon: User,
        roles: ["user", "admin", "super_admin"],
      },
      {
        name: "Settings",
        path: "/dashboard/settings",
        icon: Settings,
        roles: ["user", "admin", "super_admin"],
      },
    ];
    return allItems.filter((item) => {
      if (item.isHeader) return item.roles.includes(role);
      if (item.divider) return true;
      if (!item.roles) return false;
      return item.roles.includes(role);
    });
  };

  const menuItems = getMenuItems();

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0, transition: { type: "tween", duration: 0.3 } },
    exit: { x: -300, transition: { type: "tween", duration: 0.3 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
    exit: { opacity: 0 },
  };

  const linkVariants = {
    hover: {
      scale: 1.02,
      x: 4,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
    tap: { scale: 0.98 },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Sidebar Component
  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-r border-amber-200/50 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-amber-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm">ॐ</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Solapur Gurukulam
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-amber-50 transition"
          >
            <X className="h-5 w-5 text-amber-600" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-amber-100 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role === "super_admin"
                ? "🔱 Super Admin"
                : user?.role === "admin"
                  ? "👑 Admin"
                  : "👤 Devotee"}
            </p>
          </div>
        </div>
      </div>

      {/* Home link at top of navigation */}
      <div className="px-4 py-2">
        <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
          <Link
            to="/"
            onClick={() => onClose && onClose()}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Home className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium">Go to Homepage</span>
          </Link>
        </motion.div>
      </div>

      <div className="border-t border-amber-200/50 dark:border-gray-700 my-2"></div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            if (item.divider) {
              return (
                <li
                  key={`divider-${index}`}
                  className="my-2 border-t border-amber-200/50 dark:border-gray-700"
                ></li>
              );
            }
            if (item.isHeader) {
              return (
                <li key={item.name} className="px-3 py-2">
                  <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                    {item.name}
                  </p>
                </li>
              );
            }

            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to={item.path}
                    onClick={() => onClose && onClose()}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-amber-100 dark:border-gray-700">
        <motion.button
          onClick={() => {
            handleLogout();
            if (onClose) onClose();
          }}
          variants={linkVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden"
            >
              <SidebarContent onClose={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navbar */}
        <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-amber-200/50 dark:border-gray-700 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.button
                onClick={() => setMobileSidebarOpen(true)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="lg:hidden p-2 rounded-lg bg-amber-50 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Menu className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </motion.button>

              <div className="flex-1"></div>

              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <motion.button
                  onClick={() => dispatch(toggleDarkMode())}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="p-2 rounded-lg bg-amber-50 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-amber-600" />
                  )}
                </motion.button>

                {/* Notification Bell – REMOVED */}

                {/* User Profile */}
                <div className="flex items-center space-x-3 ml-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user?.role === "super_admin"
                        ? "Super Admin"
                        : user?.role === "admin"
                          ? "Admin"
                          : "Devotee"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;