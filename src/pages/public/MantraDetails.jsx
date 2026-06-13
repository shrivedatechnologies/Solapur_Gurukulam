import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Pause, ArrowLeft, Clock, TrendingUp, Headphones, Volume2, Star, Sparkles } from 'lucide-react';
import { mantraApi } from '../../api/mantra.api';
import Loader from '../../components/common/Loader';

const MantraDetails = () => {
  const { slug } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), { stiffness: 100, damping: 30 });

  const { data: response, isLoading } = useQuery({
    queryKey: ['mantra', slug],
    queryFn: () => mantraApi.getBySlug(slug),
  });

  const mantra = response || null;

  useEffect(() => {
    if (audio) {
      isPlaying ? audio.play() : audio.pause();
    }
    return () => { if (audio) audio.pause(); };
  }, [audio, isPlaying]);

  const handlePlayAudio = () => {
    if (!audio && mantra?.audioUrl) {
      const newAudio = new Audio(mantra.audioUrl);
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) return <Loader fullScreen />;

  if (!mantra) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mantra not found</h1>
          <Link to="/" className="text-amber-600 mt-4 inline-block hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const categorySlug = mantra.category?.slug;
  const categoryName = mantra.category?.name;

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
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">{mantra.name}</motion.h1>
          {categoryName && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-3"><span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full"><Star className="h-3 w-3" /> {categoryName}</span></motion.div>)}
        </motion.div>

        <motion.div className="absolute bottom-6 left-1/2 transform -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <div className="w-5 h-8 rounded-full border border-amber-400 flex justify-center"><div className="w-0.5 h-1.5 bg-amber-400 rounded-full mt-2" /></div>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {categorySlug && (
          <Link to={`/category/${categorySlug}`} className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors mb-6 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to {categoryName || 'Category'}
          </Link>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          {mantra.audioUrl && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-amber-200/40 shadow-sm">
              <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">Listen to Chant</h3>
              <button onClick={handlePlayAudio} className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg mx-auto">
                {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
              </button>
              {mantra.howToChant && <p className="text-xs text-gray-500 mt-3">{mantra.howToChant}</p>}
            </div>
          )}

          <div className="bg-amber-50/60 dark:bg-amber-900/10 rounded-2xl p-6 border border-amber-200/40">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Sanskrit / संस्कृत</h3>
            <p className="font-devanagari text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">{mantra.sanskrit}</p>
          </div>

          <div className="grid gap-5">
            {[
              { key: 'kannada', label: 'ಕನ್ನಡ (Kannada)', icon: '🇮🇳' },
              { key: 'marathi', label: 'मराठी (Marathi)', icon: '🇮🇳' },
              { key: 'tamil', label: 'தமிழ் (Tamil)', icon: '🇮🇳' },
              { key: 'hindi', label: 'हिन्दी (Hindi)', icon: '🇮🇳' },
              { key: 'english', label: 'English Translation', icon: '📖' },
            ].map(({ key, label, icon }) => mantra[key] ? (
              <div key={key} className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-5 border border-amber-200/30">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2"><span>{icon}</span> {label}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">{mantra[key]}</p>
              </div>
            ) : null)}
          </div>

          {mantra.meaning && (
            <div className="bg-blue-50/60 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-200/40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Meaning / अर्थ</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{mantra.meaning}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mantra.bestTime && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-5 text-center border border-amber-200/30">
                <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Best Time</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{mantra.bestTime}</p>
              </div>
            )}
            {mantra.recommendedCount && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-5 text-center border border-amber-200/30">
                <TrendingUp className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Recommended Count</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{mantra.recommendedCount} times</p>
              </div>
            )}
            {mantra.howToChant && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-5 text-center border border-amber-200/30">
                <Headphones className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">How to Chant</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">{mantra.howToChant}</p>
              </div>
            )}
          </div>

          {mantra.benefits && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-amber-200/40">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5 text-amber-500" /> Benefits / लाभ</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{mantra.benefits}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MantraDetails;