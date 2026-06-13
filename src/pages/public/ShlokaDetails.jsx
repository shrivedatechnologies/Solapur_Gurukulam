import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Pause, ArrowLeft, Sparkles } from 'lucide-react';
import { shlokaApi } from '../../api/shloka.api';
import Loader from '../../components/common/Loader';

const ShlokaDetails = () => {
    const { slug } = useParams();
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), { stiffness: 100, damping: 30 });

    const { data: response, isLoading } = useQuery({
        queryKey: ['shloka', slug],
        queryFn: () => shlokaApi.getBySlug(slug),
    });

    const shloka = response || null;

    useEffect(() => {
        if (audio) {
            isPlaying ? audio.play() : audio.pause();
        }
        return () => { if (audio) audio.pause(); };
    }, [audio, isPlaying]);

    const handlePlayAudio = () => {
        if (!audio && shloka?.audioUrl) {
            const newAudio = new Audio(shloka.audioUrl);
            newAudio.onended = () => setIsPlaying(false);
            setAudio(newAudio);
            setIsPlaying(true);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    if (isLoading) return <Loader fullScreen />;

    if (!shloka) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shloka not found</h1>
                    <Link to="/" className="text-amber-600 mt-4 inline-block hover:underline">Back to Home</Link>
                </div>
            </div>
        );
    }

    const categorySlug = shloka.category?.slug;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
            <section ref={heroRef} className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-28">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FDF3E0] to-[#FEF5E8] dark:from-gray-950 dark:via-[#1F132E] dark:to-gray-950" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-amber-400/30" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -30, 0], opacity: [0, 0.5, 0] }} transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }} />
                    ))}
                </div>

                <motion.div style={{ y: yParallax }} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.3 }} className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-xl mb-6">
                        <motion.span animate={{ scale: [1, 1.08, 1], textShadow: ["0px 0px 0px #E8890A", "0px 0px 12px #E8890A", "0px 0px 0px #E8890A"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="text-5xl text-amber-700 font-serif">ॐ</motion.span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">{shloka.name}</motion.h1>
                    {shloka.category?.name && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-3"><span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">{shloka.category.name}</span></motion.div>)}
                </motion.div>

                <motion.div className="absolute bottom-6 left-1/2 transform -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <div className="w-5 h-8 rounded-full border border-amber-400 flex justify-center"><div className="w-0.5 h-1.5 bg-amber-400 rounded-full mt-2" /></div>
                </motion.div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {categorySlug && (
                    <Link to={`/category/${categorySlug}`} className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors mb-6 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> Back to {shloka.category?.name || 'Category'}
                    </Link>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                    {shloka.audioUrl && (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-amber-200/40 shadow-sm">
                            <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">Listen to Chant</h3>
                            <button onClick={handlePlayAudio} className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg mx-auto">
                                {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
                            </button>
                        </div>
                    )}

                    <div className="bg-amber-50/60 dark:bg-amber-900/10 rounded-2xl p-6 border border-amber-200/40">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Sanskrit / संस्कृत</h3>
                        <p className="font-devanagari text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">{shloka.sanskrit}</p>
                    </div>

                    <div className="grid gap-5">
                        {[
                            { key: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
                            { key: 'marathi', label: 'मराठी (Marathi)' },
                            { key: 'tamil', label: 'தமிழ் (Tamil)' },
                            { key: 'hindi', label: 'हिन्दी (Hindi)' },
                            { key: 'english', label: 'English Translation' },
                        ].map(({ key, label }) => shloka[key] ? (
                            <div key={key} className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-5 border border-amber-200/30">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">{label}</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">{shloka[key]}</p>
                            </div>
                        ) : null)}
                    </div>

                    {shloka.meaning && (
                        <div className="bg-blue-50/60 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-200/40">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Meaning / अर्थ</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{shloka.meaning}</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ShlokaDetails;