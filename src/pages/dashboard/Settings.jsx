import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { z } from 'zod';
import { Moon, Sun, Lock, Save, Eye, EyeOff, Monitor, Palette, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { setDarkMode, toggleDarkMode } from '../../store/themeSlice';

const passwordSchema = z.object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const Toggle = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        </div>
        <button
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const SectionCard = ({ icon: Icon, title, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4, ease: 'easeOut' }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-amber-200/40 overflow-hidden"
    >
        <div className="px-6 py-4 border-b border-amber-100/50 dark:border-gray-700 flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Icon className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="px-6 py-5">{children}</div>
    </motion.div>
);

const Settings = () => {
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => state.theme);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), { stiffness: 100, damping: 30 });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(passwordSchema),
    });

    const handleThemeChange = (theme) => {
        if (theme === 'dark' && !darkMode) dispatch(setDarkMode(true));
        else if (theme === 'light' && darkMode) dispatch(setDarkMode(false));
    };

    const onSubmitPassword = async (data) => {
        setIsLoading(true);
        try {
            await authApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
            toast.success('Password changed successfully');
            reset();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
            <section ref={heroRef} className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-amber-50/20 dark:from-indigo-950/20 dark:to-amber-950/10" />
                <div className="absolute top-20 right-0 w-72 h-72 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />

                <motion.div style={{ y: yParallax }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium mb-4">
                            <Sparkles className="h-3.5 w-3.5" />
                            Preferences
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Settings
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your account preferences and appearance</p>
                    </div>
                </motion.div>
            </section>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
                {/* Appearance Section */}
                <SectionCard icon={Palette} title="Appearance" delay={0.1}>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                        Choose how the dashboard looks to you. This preference is stored locally on your device.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${!darkMode ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                        >
                            {!darkMode && <Check className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />}
                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                <Sun className="h-5 w-5 text-amber-400" />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Light</span>
                        </button>
                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${darkMode ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                        >
                            {darkMode && <Check className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />}
                            <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center shadow-sm">
                                <Moon className="h-5 w-5 text-indigo-400" />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Dark</span>
                        </button>
                        <button
                            className="relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all opacity-60 cursor-not-allowed"
                            disabled
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white to-gray-900 border border-gray-200 flex items-center justify-center shadow-sm">
                                <Monitor className="h-5 w-5 text-gray-400" />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">System</span>
                        </button>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Toggle
                            checked={darkMode}
                            onChange={() => dispatch(toggleDarkMode())}
                            label="Dark Mode"
                            description="Quickly toggle between light and dark"
                        />
                    </div>
                </SectionCard>

                {/* Change Password Section */}
                <SectionCard icon={Lock} title="Change Password" delay={0.4}>
                    <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    {...register('currentPassword')}
                                    className="w-full pr-10 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    {...register('newPassword')}
                                    className="w-full pr-10 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword')}
                                    className="w-full pr-10 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="flex justify-end pt-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </SectionCard>
            </div>
        </div>
    );
};

export default Settings;