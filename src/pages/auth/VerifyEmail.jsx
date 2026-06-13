import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import Button from '../../components/common/Button';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), { stiffness: 100, damping: 30 });

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await authApi.verifyEmail(token);
                setStatus('success');
                setMessage('Email verified successfully! You can now login.');
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Email verification failed.');
            }
        };
        verifyEmail();
    }, [token]);

    const loadingComponent = (
        <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/40 p-8 text-center"
            >
                <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-200 dark:border-gray-600"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">Verifying your email...</p>
            </motion.div>
        </div>
    );

    if (status === 'loading') return loadingComponent;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
            <section ref={heroRef} className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FDF3E0] to-[#FEF5E8] dark:from-gray-950 dark:via-[#1F132E] dark:to-gray-950" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
                </div>
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

                <motion.div style={{ y: yParallax }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.7 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-amber-400/50 shadow-lg mb-4"
                    >
                        <motion.span
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="text-4xl text-amber-700 dark:text-amber-400"
                        >
                            ॐ
                        </motion.span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        Email Verification
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 dark:text-gray-300 text-base max-w-md mx-auto mt-2"
                    >
                        {status === 'success' ? 'Your email has been verified' : 'Verification issue'}
                    </motion.p>
                </motion.div>

                <motion.div
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <div className="w-4 h-6 rounded-full border border-amber-400 flex justify-center">
                        <div className="w-0.5 h-1.5 bg-amber-400 rounded-full mt-1.5" />
                    </div>
                </motion.div>
            </section>

            <div className="flex justify-center px-4 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/40 p-6 md:p-8 text-center"
                >
                    {status === 'success' ? (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', bounce: 0.4 }}
                                className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                            >
                                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified!</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                            <Link to="/login">
                                <Button variant="primary" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg transition-all hover:-translate-y-0.5">
                                    Login Now
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', bounce: 0.4 }}
                                className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                            >
                                <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                            <Link to="/register">
                                <Button variant="primary" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg transition-all hover:-translate-y-0.5">
                                    Register Again
                                </Button>
                            </Link>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmail;