import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Image, Star, Globe, RefreshCw, Layout, TrendingUp, Settings, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { homepageApi } from '../../api/homepage.api';
import { mantraApi } from '../../api/mantra.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';

const ManageHomepage = () => {
    const queryClient = useQueryClient();
    const [heroData, setHeroData] = useState({
        title: 'Pandit Ji Mantra Platform',
        subtitle: 'Discover the divine power of ancient mantras',
        backgroundImage: '',
        showSearch: true,
    });
    const [dailyMantraId, setDailyMantraId] = useState('');
    const [featuredMantrasIds, setFeaturedMantrasIds] = useState([]);
    const [seoData, setSeoData] = useState({
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        ogImage: '',
    });
    const [mantrasList, setMantrasList] = useState([]);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const fetchMantras = async () => {
            try {
                const res = await mantraApi.getAll({ limit: 100 });
                setMantrasList(res?.mantras || []);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchMantras();
    }, []);

    const { isLoading } = useQuery({
        queryKey: ['homepage-data'],
        queryFn: async () => {
            try {
                const [hero, daily, featured, seo] = await Promise.all([
                    homepageApi.getHero(),
                    homepageApi.getDailyMantra(),
                    homepageApi.getFeaturedMantras(),
                    homepageApi.getSEO(),
                ]);
                if (hero) setHeroData(hero);
                if (daily?._id) setDailyMantraId(daily._id);
                if (featured) setFeaturedMantrasIds(featured.map(m => m._id));
                if (seo) setSeoData(seo);
                return { hero, daily, featured, seo };
            } catch (error) {
                console.error('Error fetching homepage:', error);
                return null;
            }
        },
    });

    const updateHeroMutation = useMutation({
        mutationFn: homepageApi.updateHero,
        onSuccess: () => {
            toast.success('Hero section updated');
            queryClient.invalidateQueries(['homepage-data']);
        },
        onError: () => toast.error('Failed to update hero'),
    });

    const updateDailyMutation = useMutation({
        mutationFn: homepageApi.updateDailyMantra,
        onSuccess: () => {
            toast.success('Daily mantra updated');
            queryClient.invalidateQueries(['homepage-data']);
        },
        onError: () => toast.error('Failed to update daily mantra'),
    });

    const updateFeaturedMutation = useMutation({
        mutationFn: homepageApi.updateFeaturedMantras,
        onSuccess: () => {
            toast.success('Featured mantras updated');
            queryClient.invalidateQueries(['homepage-data']);
        },
        onError: () => toast.error('Failed to update featured mantras'),
    });

    const updateSEOMutation = useMutation({
        mutationFn: homepageApi.updateSEO,
        onSuccess: () => {
            toast.success('SEO settings updated');
            queryClient.invalidateQueries(['homepage-data']);
        },
        onError: () => toast.error('Failed to update SEO'),
    });

    const handleHeroSubmit = (e) => {
        e.preventDefault();
        updateHeroMutation.mutate(heroData);
    };

    const handleDailySubmit = (e) => {
        e.preventDefault();
        const mantra = mantrasList.find(m => m._id === dailyMantraId);
        if (mantra) updateDailyMutation.mutate(mantra);
        else toast.error('Please select a mantra');
    };

    const handleFeaturedChange = (mantraId) => {
        setFeaturedMantrasIds(prev =>
            prev.includes(mantraId)
                ? prev.filter(id => id !== mantraId)
                : [...prev, mantraId]
        );
    };

    const handleFeaturedSubmit = (e) => {
        e.preventDefault();
        const selectedMantras = mantrasList.filter(m => featuredMantrasIds.includes(m._id));
        updateFeaturedMutation.mutate(selectedMantras);
    };

    const handleSEOSubmit = (e) => {
        e.preventDefault();
        updateSEOMutation.mutate(seoData);
    };

    if (isLoading) return <Loader />;

    const sections = [
        { id: 'hero', label: 'Hero Section', icon: Layout, color: 'amber' },
        { id: 'daily', label: 'Daily Mantra', icon: RefreshCw, color: 'blue' },
        { id: 'featured', label: 'Featured Mantras', icon: Star, color: 'purple' },
        { id: 'seo', label: 'SEO Settings', icon: Globe, color: 'green' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium mb-3">
                        <Settings className="h-3.5 w-3.5" />
                        Content Management
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Homepage CMS</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage hero, daily mantra, featured content & SEO</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
                    {sections.map(section => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                                    isActive
                                        ? `bg-${section.color}-100 text-${section.color}-700 dark:bg-${section.color}-900/30 dark:text-${section.color}-300 border border-${section.color}-200`
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {section.label}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {activeSection === 'hero' && (
                        <motion.div
                            key="hero"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 border border-amber-200/40 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800 dark:text-white">
                                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                        <Image className="h-5 w-5 text-amber-600" />
                                    </div>
                                    Hero Section
                                </h2>
                                <form onSubmit={handleHeroSubmit} className="space-y-5">
                                    <Input 
                                        label="Title" 
                                        value={heroData.title} 
                                        onChange={(e) => setHeroData({ ...heroData, title: e.target.value })} 
                                        required 
                                        className="bg-white dark:bg-gray-700"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Subtitle</label>
                                        <textarea 
                                            value={heroData.subtitle} 
                                            onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })} 
                                            rows={2} 
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                                        />
                                    </div>
                                    <Input 
                                        label="Background Image URL" 
                                        value={heroData.backgroundImage} 
                                        onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })} 
                                        placeholder="https://example.com/hero-bg.jpg"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Show Search Bar</span>
                                        <button 
                                            type="button" 
                                            onClick={() => setHeroData({ ...heroData, showSearch: !heroData.showSearch })} 
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${heroData.showSearch ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${heroData.showSearch ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" isLoading={updateHeroMutation.isLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg">
                                            <Save className="h-4 w-4 mr-2" /> Save Hero
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}

                    {activeSection === 'daily' && (
                        <motion.div
                            key="daily"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 border border-blue-200/40 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800 dark:text-white">
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <RefreshCw className="h-5 w-5 text-blue-600" />
                                    </div>
                                    Daily Mantra
                                </h2>
                                <form onSubmit={handleDailySubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Mantra</label>
                                        <select 
                                            value={dailyMantraId} 
                                            onChange={(e) => setDailyMantraId(e.target.value)} 
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                        >
                                            <option value="">-- Choose a mantra --</option>
                                            {mantrasList.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                        </select>
                                        <p className="text-xs text-gray-400 mt-1">This mantra will appear as "Mantra of the Day" on the homepage.</p>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" isLoading={updateDailyMutation.isLoading} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg">
                                            <Save className="h-4 w-4 mr-2" /> Save Daily Mantra
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}

                    {activeSection === 'featured' && (
                        <motion.div
                            key="featured"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 border border-purple-200/40 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800 dark:text-white">
                                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                        <Star className="h-5 w-5 text-purple-600" />
                                    </div>
                                    Featured Mantras
                                </h2>
                                <form onSubmit={handleFeaturedSubmit} className="space-y-5">
                                    <div className="max-h-72 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 p-2 space-y-1">
                                        {mantrasList.map(m => (
                                            <label key={m._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition">
                                                <input 
                                                    type="checkbox" 
                                                    checked={featuredMantrasIds.includes(m._id)} 
                                                    onChange={() => handleFeaturedChange(m._id)} 
                                                    className="w-4 h-4 text-purple-500 rounded focus:ring-purple-400"
                                                />
                                                <span className="text-gray-700 dark:text-gray-200 text-sm">{m.name}</span>
                                            </label>
                                        ))}
                                        {mantrasList.length === 0 && <p className="text-gray-500 text-center py-6">No mantras available</p>}
                                    </div>
                                    <p className="text-xs text-gray-400">Selected mantras will appear in the "Featured Mantras" section on the homepage.</p>
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" isLoading={updateFeaturedMutation.isLoading} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg">
                                            <Save className="h-4 w-4 mr-2" /> Save Featured
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}

                    {activeSection === 'seo' && (
                        <motion.div
                            key="seo"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 border border-green-200/40 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800 dark:text-white">
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                        <Globe className="h-5 w-5 text-green-600" />
                                    </div>
                                    SEO Settings
                                </h2>
                                <form onSubmit={handleSEOSubmit} className="space-y-5">
                                    <Input 
                                        label="Meta Title" 
                                        value={seoData.metaTitle} 
                                        onChange={(e) => setSeoData({ ...seoData, metaTitle: e.target.value })} 
                                        placeholder="Solapur Gurukulam - Sacred Mantras & Shlokas"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Meta Description</label>
                                        <textarea 
                                            value={seoData.metaDescription} 
                                            onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })} 
                                            rows={3} 
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                            placeholder="Discover sacred mantras, shlokas, and shotrams for spiritual growth."
                                        />
                                    </div>
                                    <Input 
                                        label="Meta Keywords" 
                                        value={seoData.metaKeywords} 
                                        onChange={(e) => setSeoData({ ...seoData, metaKeywords: e.target.value })} 
                                        placeholder="mantras, shlokas, spirituality, meditation"
                                    />
                                    <Input 
                                        label="OG Image URL" 
                                        value={seoData.ogImage} 
                                        onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })} 
                                        placeholder="https://example.com/og-image.jpg"
                                    />
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" isLoading={updateSEOMutation.isLoading} className="bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg">
                                            <Save className="h-4 w-4 mr-2" /> Save SEO
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageHomepage;