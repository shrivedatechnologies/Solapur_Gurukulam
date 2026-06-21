import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Play, Pause, ArrowLeft, Star, Sparkles } from "lucide-react";
import { shotramApi } from "../../api/shotram.api";
import Loader from "../../components/common/Loader";
import FavouriteButton from "../../components/common/FavouriteButton";

const ShotramDetails = () => {
  const { slug } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), {
    stiffness: 100,
    damping: 30,
  });

  // ✅ Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ Get language from Redux with fallback
  const languageState = useSelector((state) => state.language);
  const currentLanguage = languageState?.currentLanguage || "sanskrit";

  const { data: response, isLoading } = useQuery({
    queryKey: ["shotram", slug],
    queryFn: () => shotramApi.getBySlug(slug),
  });

  const shotram = response || null;

  useEffect(() => {
    if (audio) {
      isPlaying ? audio.play() : audio.pause();
    }
    return () => {
      if (audio) audio.pause();
    };
  }, [audio, isPlaying]);

  const handlePlayAudio = () => {
    if (!audio && shotram?.audioUrl) {
      const newAudio = new Audio(shotram.audioUrl);
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // ✅ Language mapping
  const languageMap = {
    sanskrit: { label: "Sanskrit / संस्कृत", icon: "🕉️" },
    kannada: { label: "ಕನ್ನಡ (Kannada)", icon: "🇮🇳" },
    marathi: { label: "मराठी (Marathi)", icon: "🇮🇳" },
    tamil: { label: "తెలుగు (Telugu)", icon: "🇮🇳" },
    hindi: { label: "हिन्दी (Hindi)", icon: "🇮🇳" },
    english: { label: "English Translation", icon: "📖" },
  };

  // ✅ Get content based on language
  const getLanguageContent = () => {
    if (!shotram) return { text: "", label: "", icon: "", isSanskrit: true };

    if (currentLanguage === "sanskrit") {
      return {
        text: shotram.sanskrit || "",
        label: languageMap.sanskrit.label,
        icon: languageMap.sanskrit.icon,
        isSanskrit: true,
      };
    }

    const content = shotram[currentLanguage];
    if (content) {
      return {
        text: content,
        label: languageMap[currentLanguage]?.label || currentLanguage,
        icon: languageMap[currentLanguage]?.icon || "📝",
        isSanskrit: false,
      };
    }

    return {
      text: shotram.sanskrit || "",
      label: "Sanskrit / संस्कृत",
      icon: "🕉️",
      isSanskrit: true,
    };
  };

  if (isLoading) return <Loader fullScreen />;

  if (!shotram) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Shotram not found
          </h1>
          <Link
            to="/"
            className="text-amber-600 mt-4 inline-block hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = shotram.category?.name;
  const languageContent = getLanguageContent();
  const availableLanguages = [
    "kannada",
    "marathi",
    "tamil",
    "hindi",
    "english",
  ].filter((lang) => shotram[lang]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
      {/* ─── HERO ─── REDUCED HEIGHT (same as list pages) ─── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-7 pb-8 md:pt-9 md:pb-11"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FDF3E0] to-[#FEF5E8] dark:from-gray-950 dark:via-[#1F132E] dark:to-gray-950" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -25, 0], opacity: [0, 0.5, 0] }}
              transition={{
                duration: 3.5 + Math.random() * 3.5,
                repeat: Infinity,
                delay: Math.random() * 3.5,
              }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: yParallax }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Mobile: Top row */}
          <div className="flex items-center justify-between mb-3 sm:hidden">
            <Link
              to="/shotrams"
              className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors text-xs font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1.5 rounded-full shadow-md"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Link>
            <FavouriteButton
              itemId={shotram._id}
              itemType="shotram"
              size={18}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-full p-1.5"
            />
          </div>

          {/* Desktop: Absolute positioned buttons */}
          <div className="relative hidden sm:block">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <Link
                to="/shotrams"
                className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Shotrams</span>
              </Link>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <FavouriteButton
                itemId={shotram._id}
                itemType="shotram"
                size={24}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-full p-2 hover:shadow-xl transition-shadow"
              />
            </div>
            <div className="text-center px-24">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-lg mb-3"
              >
                <motion.span
                  animate={{
                    scale: [1, 1.06, 1],
                    textShadow: [
                      "0px 0px 0px #E8890A",
                      "0px 0px 10px #E8890A",
                      "0px 0px 0px #E8890A",
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-3xl text-amber-700 font-serif"
                >
                  ॐ
                </motion.span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
              >
                {shotram.name}
              </motion.h1>
              {categoryName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-2"
                >
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full">
                    <Star className="h-3 w-3" />
                    {categoryName}
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile: Centered title */}
          <div className="text-center sm:hidden px-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-lg mb-2"
            >
              <motion.span
                animate={{
                  scale: [1, 1.06, 1],
                  textShadow: [
                    "0px 0px 0px #E8890A",
                    "0px 0px 10px #E8890A",
                    "0px 0px 0px #E8890A",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-3xl text-amber-700 font-serif"
              >
                ॐ
              </motion.span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              {shotram.name}
            </motion.h1>
            {categoryName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-1"
              >
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full">
                  <Star className="h-2.5 w-2.5" />
                  {categoryName}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-4 h-6 rounded-full border border-amber-400 flex justify-center">
            <div className="w-0.5 h-1.5 bg-amber-400 rounded-full mt-1.5" />
          </div>
        </motion.div>
      </section>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {shotram.audioUrl && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-amber-200/40 shadow-sm">
              <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">
                Listen to Chant
              </h3>
              <button
                onClick={handlePlayAudio}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg mx-auto"
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7" />
                ) : (
                  <Play className="h-7 w-7 ml-1" />
                )}
              </button>
            </div>
          )}

          {/* ✅ Selected Language Content */}
          <div className="bg-amber-50/60 dark:bg-amber-900/10 rounded-2xl p-6 border border-amber-200/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> {languageContent.icon}{" "}
                {languageContent.label}
              </h3>
              {availableLanguages.length > 0 && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {availableLanguages.length} languages available
                </span>
              )}
            </div>
            <p
              className={`text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line ${languageContent.isSanskrit ? "font-devanagari" : ""}`}
            >
              {languageContent.text}
            </p>
          </div>

          {/* ✅ All Translations */}
          {availableLanguages.length > 0 && (
            <div className="mt-4">
              <details className="group">
                <summary className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 cursor-pointer hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                  <span className="text-xs">📚</span> View all translations
                  <span className="ml-auto text-xs text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 space-y-4">
                  {["kannada", "marathi", "tamil", "hindi", "english"].map(
                    (lang) => {
                      if (!shotram[lang]) return null;
                      return (
                        <div
                          key={lang}
                          className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-5 border border-amber-200/30"
                        >
                          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
                            {languageMap[lang]?.icon}{" "}
                            {languageMap[lang]?.label || lang}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {shotram[lang]}
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              </details>
            </div>
          )}

          {shotram.meaning && (
            <div className="bg-blue-50/60 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-200/40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Meaning / अर्थ
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {shotram.meaning}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShotramDetails;