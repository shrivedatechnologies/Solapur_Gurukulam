import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  BookOpen,
  Mic,
  Library,
  Home,
  Settings,
  User,
  TrendingUp,
  Shield,
  Users,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../store/authSlice";
import { selectFavouritesCount } from "../../store/favouriteSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
    onClose();
  };

  // Get menu items based on user role
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
        name: "Manage Homepage",
        path: "/dashboard/homepage",
        icon: Home,
        roles: ["admin", "super_admin"],
      },
      {
        name: "Analytics",
        path: "/dashboard/analytics",
        icon: TrendingUp,
        roles: ["admin", "super_admin"],
      },
      {
        name: "Manage Categories",
        path: "/dashboard/categories",
        icon: Library,
        roles: ["super_admin"],
      },
      {
        name: "Manage Admins",
        path: "/dashboard/admins",
        icon: Shield,
        roles: ["super_admin"],
      },
      {
        name: "Favourites",
        path: "/dashboard/favourites",
        icon: Heart,
        roles: ["user", "admin", "super_admin"],
      },
    ];

    return allItems.filter((item) => item.roles.includes(role));
  };

  const menuItems = getMenuItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />

          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "tween" }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 lg:translate-x-0 lg:static lg:z-auto flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">ॐ</span>
                </div>
                <h2 className="text-xl font-bold text-primary-600">
                  Dashboard
                </h2>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 py-3 border-b dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role?.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${isActive ? "text-white" : ""}`}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-4 border-t dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
