import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play, Pause, ArrowLeft } from 'lucide-react';
import { shotramApi } from '../../api/shotram.api';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const ShotramDetails = () => {
    const { slug } = useParams();
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);

    const { data: response, isLoading } = useQuery({
        queryKey: ['shotram', slug],
        queryFn: () => shotramApi.getBySlug(slug),
    });

    const shotram = response || null;

    useEffect(() => {
        if (audio) {
            isPlaying ? audio.play() : audio.pause();
        }
        return () => { if (audio) audio.pause(); };
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

    if (isLoading) return <Loader fullScreen />;

    if (!shotram) {
        return (
            <div className="container-custom py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shotram not found</h1>
                <Link to="/" className="text-primary-600 mt-4 inline-block">Back to Home</Link>
            </div>
        );
    }

    const categorySlug = shotram.category?.slug;

    return (
        <div className="py-8">
            <div className="container-custom max-w-3xl mx-auto">
                {/* Back */}
                {categorySlug && (
                    <Link
                        to={`/category/${categorySlug}`}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to {shotram.category?.name || 'Category'}
                    </Link>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-6 md:p-10">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                {shotram.name}
                            </h1>
                            {shotram.category?.name && (
                                <span className="inline-block text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">
                                    {shotram.category.name}
                                </span>
                            )}
                        </div>

                        {/* Audio Player */}
                        {shotram.audioUrl && (
                            <div className="flex justify-center mb-8">
                                <button
                                    onClick={handlePlayAudio}
                                    className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                >
                                    {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
                                </button>
                            </div>
                        )}

                        {/* Sanskrit */}
                        <div className="mb-6 p-5 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
                                Sanskrit / संस्कृत
                            </h3>
                            <p className="font-devanagari text-xl md:text-2xl leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
                                {shotram.sanskrit}
                            </p>
                        </div>

                        {/* Translations */}
                        {[
                            { key: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
                            { key: 'marathi', label: 'मराठी (Marathi)' },
                            { key: 'tamil', label: 'தமிழ் (Tamil)' },
                            { key: 'hindi', label: 'हिन्दी (Hindi)' },
                            { key: 'english', label: 'English Translation' },
                        ].map(({ key, label }) =>
                            shotram[key] ? (
                                <div key={key} className="mb-5">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">
                                        {label}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                        {shotram[key]}
                                    </p>
                                </div>
                            ) : null
                        )}

                        {/* Meaning */}
                        {shotram.meaning && (
                            <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                                    Meaning / अर्थ
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{shotram.meaning}</p>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ShotramDetails;