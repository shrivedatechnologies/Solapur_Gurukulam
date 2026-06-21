import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Public pages
const Home = lazy(() => import('../pages/public/Home'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));
const Categories = lazy(() => import('../pages/public/Categories'));
const CategoryDetails = lazy(() => import('../pages/public/CategoryDetails'));
const Mantras = lazy(() => import('../pages/public/Mantras'));
const Shlokas = lazy(() => import('../pages/public/Shlokas'));
const Shotrams = lazy(() => import('../pages/public/Shotrams'));
const MantraDetails = lazy(() => import('../pages/public/MantraDetails'));
const ShlokaDetails = lazy(() => import('../pages/public/ShlokaDetails'));
const ShotramDetails = lazy(() => import('../pages/public/ShotramDetails'));
const Search = lazy(() => import('../pages/public/Search'));
const NotFound = lazy(() => import('../pages/public/NotFound'));
const ContactUs = lazy(() => import('../pages/public/ContactUs'));

// Dashboard pages
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const ManageCategories = lazy(() => import('../pages/dashboard/ManageCategories'));
const ManageMantras = lazy(() => import('../pages/dashboard/ManageMantras'));
const ManageShlokas = lazy(() => import('../pages/dashboard/ManageShlokas'));
const ManageShotrams = lazy(() => import('../pages/dashboard/ManageShotrams'));
// ManageHomepage removed – file missing
const ManageAdmins = lazy(() => import('../pages/dashboard/ManageAdmins'));
const Analytics = lazy(() => import('../pages/dashboard/Analytics'));
const Profile = lazy(() => import('../pages/dashboard/Profile'));
const Settings = lazy(() => import('../pages/dashboard/Settings'));
// ✅ New: Favourites page
const Favourites = lazy(() => import('../pages/dashboard/Favourites'));

// Protected Route — role-based access guard
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Auth Route — already logged-in users ko redirect
const AuthRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) return children;

    if (user?.role === 'admin' || user?.role === 'super_admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
);

const AppRoutes = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <BrowserRouter>
                    <Toaster position="top-right" />
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            {/* Public Routes */}
                            <Route element={<MainLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/category/:slug" element={<CategoryDetails />} />
                                <Route path="/mantra/:slug" element={<MantraDetails />} />
                                <Route path="/shloka/:slug" element={<ShlokaDetails />} />
                                <Route path="/shotram/:slug" element={<ShotramDetails />} />
                                <Route path="/mantras" element={<Mantras />} />
                                <Route path="/shlokas" element={<Shlokas />} />
                                <Route path="/shotrams" element={<Shotrams />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/contact" element={<ContactUs />} />
                            </Route>

                            {/* Auth Routes */}
                            <Route element={<AuthLayout />}>
                                <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                                <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
                                <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
                                <Route path="/reset-password/:token" element={<ResetPassword />} />
                                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                            </Route>

                            {/* Dashboard - All authenticated users */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }>
                                <Route index element={<DashboardHome />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="favourites" element={<Favourites />} />   {/* ✅ New route */}
                            </Route>

                            {/* Dashboard - Admin & Super Admin */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }>
                                <Route path="mantras" element={<ManageMantras />} />
                                <Route path="shlokas" element={<ManageShlokas />} />
                                <Route path="shotrams" element={<ManageShotrams />} />
                                {/* ManageHomepage route removed */}
                                <Route path="analytics" element={<Analytics />} />
                            </Route>

                            {/* Dashboard - Super Admin Only */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute allowedRoles={['super_admin']}>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }>
                                <Route path="categories" element={<ManageCategories />} />
                                <Route path="admins" element={<ManageAdmins />} />
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </HelmetProvider>
        </QueryClientProvider>
    );
};

export default AppRoutes;