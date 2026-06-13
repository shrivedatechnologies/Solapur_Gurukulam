import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { searchApi } from '../../api/search.api';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const debouncedQuery = useDebounce(query, 400);
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (debouncedQuery.length >= 2) {
            fetchResults(debouncedQuery);
        } else {
            setResults(null);
            setIsOpen(false);
        }
    }, [debouncedQuery]);

    const fetchResults = async (q) => {
        setIsLoading(true);
        try {
            const res = await searchApi.global(q);
            // res = { success, data: { mantras, shlokas, shotrams, categories } }
            setResults(res?.data || res || null);
            setIsOpen(true);
        } catch (error) {
            console.error('Search error:', error);
            setResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResultClick = (type, slug) => {
        setIsOpen(false);
        setQuery('');
        setResults(null);
        if (type === 'mantra') navigate(`/mantra/${slug}`);
        else if (type === 'shloka') navigate(`/shloka/${slug}`);
        else if (type === 'shotram') navigate(`/shotram/${slug}`);
        else if (type === 'category') navigate(`/category/${slug}`);
    };

    const handleViewAll = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const hasResults = results && (
        results.mantras?.length > 0 ||
        results.shlokas?.length > 0 ||
        results.shotrams?.length > 0 ||
        results.categories?.length > 0
    );

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => hasResults && setIsOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleViewAll(e)}
                    placeholder="Search mantras, shlokas, shotrams..."
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults(null); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>

            {/* Loading shimmer */}
            {isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 z-50">
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16" />
                                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Results dropdown */}
            {!isLoading && isOpen && results && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 max-h-[420px] overflow-y-auto">
                    {!hasResults ? (
                        <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <>
                            {/* Mantras */}
                            {results.mantras?.length > 0 && (
                                <div className="p-2">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-1.5">
                                        🔱 Mantras
                                    </p>
                                    {results.mantras.map((item) => (
                                        <button
                                            key={item._id}
                                            onClick={() => handleResultClick('mantra', item.slug)}
                                            className="w-full text-left px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                        >
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
                                            {item.category?.name && (
                                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{item.category.name}</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Shlokas */}
                            {results.shlokas?.length > 0 && (
                                <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-1.5">
                                        📜 Shlokas
                                    </p>
                                    {results.shlokas.map((item) => (
                                        <button
                                            key={item._id}
                                            onClick={() => handleResultClick('shloka', item.slug)}
                                            className="w-full text-left px-3 py-2.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                        >
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
                                            {item.sanskrit && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-devanagari line-clamp-1">{item.sanskrit.slice(0, 60)}</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Shotrams */}
                            {results.shotrams?.length > 0 && (
                                <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-1.5">
                                        🙏 Shotrams
                                    </p>
                                    {results.shotrams.map((item) => (
                                        <button
                                            key={item._id}
                                            onClick={() => handleResultClick('shotram', item.slug)}
                                            className="w-full text-left px-3 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                        >
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
                                            {item.category?.name && (
                                                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">{item.category.name}</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Categories */}
                            {results.categories?.length > 0 && (
                                <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-1.5">
                                        📂 Categories
                                    </p>
                                    {results.categories.map((item) => (
                                        <button
                                            key={item._id}
                                            onClick={() => handleResultClick('category', item.slug)}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
                                            {item.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* View all results */}
                            <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={handleViewAll}
                                    className="w-full text-center px-3 py-2.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                >
                                    View all results for "{query}" →
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;