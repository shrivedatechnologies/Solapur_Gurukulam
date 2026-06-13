import { Menu, Bell, User, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../../store/themeSlice';

const DashboardNavbar = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40 lg:ml-64">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex-1"></div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => dispatch(toggleDarkMode())}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;