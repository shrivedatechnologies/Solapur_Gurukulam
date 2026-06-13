import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
            {/* Animated gradient orbs (same as home page) */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-amber-300/20 dark:bg-amber-500/10 blur-3xl"
                    animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-400/20 dark:bg-amber-600/10 blur-3xl"
                    animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
                    transition={{ duration: 18, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-amber-200/15 dark:bg-amber-700/5 blur-2xl"
                    animate={{ scale: [1, 1.4, 1], x: [0, -20, 0], y: [0, 20, 0] }}
                    transition={{ duration: 22, repeat: Infinity }}
                />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-amber-400/40"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
                        transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
                    />
                ))}
            </div>

            {/* Subtle rotating OM watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    className="text-9xl font-serif text-amber-500/5 dark:text-amber-400/5 select-none"
                >
                    ॐ
                </motion.div>
            </div>

            {/* Main container - glassmorphic with animation */}
            <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full max-w-md"
                >
                    <Outlet />
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;