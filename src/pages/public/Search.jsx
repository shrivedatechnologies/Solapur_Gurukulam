import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, BookOpen } from 'lucide-react';
import { searchApi } from '../../api/search.api';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const ResultSection = ({ icon, title, count, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary-500 rounded-full" />
            {icon} {title} ({count})
        </h3>
        {children}
    </div>
);

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [inputValue, setInputValue] = useState(query);

    const { data: response, isLoading } = useQuery({
        queryKey: ['search', query],
        queryFn: () => searchApi.global(query),
        enabled: query.trim().length >= 2,
    });

    const results = response?.data || response || null;

    const handleSearch = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setSearchParams({ q: inputValue.trim() });
        }
    };

    const totalResults = results
        ? (results.mantras?.length || 0) +
          (results.shlokas?.length || 0) +
          (results.shotrams?.length || 0) +
          (results.categories?.length || 0)
        : 0;

    const noResults = query && !isLoading && results && totalResults === 0;

    return (
        <div className="py-12">
            <div className="container-custom">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Search</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Search across all mantras, shlokas, shotrams and categories
                    </p>
                </div>

                <div className="max-w-2xl mx-auto mb-10">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Search mantras, shlokas, shotrams..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all font-semibold shadow-md hover:shadow-lg"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {query && (
                    <>
                        {isLoading ? (
                            <Loader />
                        ) : noResults ? (
                            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                    No results found for "{query}"
                                </p>
                                <p className="text-gray-400 mt-2 text-sm">Try different keywords</p>
                            </div>
                        ) : results ? (
                            <div className="space-y-10">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Found <span className="font-semibold text-gray-700 dark:text-gray-200">{totalResults}</span> results for "{query}"
                                </p>

                                {results.mantras?.length > 0 && (
                                    <ResultSection icon="🔱" title="Mantras" count={results.mantras.length}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {results.mantras.map((item) => (
                                                <Link key={item._id} to={`/mantra/${item.slug}`}>
                                                    <Card className="p-5 hover:shadow-lg h-full group">
                                                        <div className="h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 -mx-5 -mt-5 mb-4 rounded-t-xl" />
                                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{item.name}</h4>
                                                        {item.category?.name && (
                                                            <span className="inline-block mt-1 text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-700">
                                                                {item.category.name}
                                                            </span>
                                                        )}
                                                        {item.benefits && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{item.benefits}</p>
                                                        )}
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </ResultSection>
                                )}

                                {results.shlokas?.length > 0 && (
                                    <ResultSection icon="📜" title="Shlokas" count={results.shlokas.length}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {results.shlokas.map((item) => (
                                                <Link key={item._id} to={`/shloka/${item.slug}`}>
                                                    <Card className="p-5 hover:shadow-lg h-full group">
                                                        <div className="h-0.5 bg-gradient-to-r from-purple-400 via-amber-400 to-orange-400 -mx-5 -mt-5 mb-4 rounded-t-xl" />
                                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{item.name}</h4>
                                                        {item.category?.name && (
                                                            <span className="inline-block mt-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-700">
                                                                {item.category.name}
                                                            </span>
                                                        )}
                                                        {item.sanskrit && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-devanagari line-clamp-2 bg-orange-50/50 dark:bg-orange-900/10 rounded px-2 py-1">
                                                                {item.sanskrit.slice(0, 120)}
                                                            </p>
                                                        )}
                                                        {item.meaning && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{item.meaning}</p>
                                                        )}
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </ResultSection>
                                )}

                                {results.shotrams?.length > 0 && (
                                    <ResultSection icon="🙏" title="Shotrams" count={results.shotrams.length}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {results.shotrams.map((item) => (
                                                <Link key={item._id} to={`/shotram/${item.slug}`}>
                                                    <Card className="p-5 hover:shadow-lg h-full group">
                                                        <div className="h-0.5 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 -mx-5 -mt-5 mb-4 rounded-t-xl" />
                                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{item.name}</h4>
                                                        {item.category?.name && (
                                                            <span className="inline-block mt-1 text-xs bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-700">
                                                                {item.category.name}
                                                            </span>
                                                        )}
                                                        {item.sanskrit && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-devanagari line-clamp-2 bg-orange-50/50 dark:bg-orange-900/10 rounded px-2 py-1">
                                                                {item.sanskrit.slice(0, 120)}
                                                            </p>
                                                        )}
                                                        {item.meaning && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{item.meaning}</p>
                                                        )}
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </ResultSection>
                                )}

                                {results.categories?.length > 0 && (
                                    <ResultSection icon="📂" title="Categories" count={results.categories.length}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {results.categories.map((item) => (
                                                <Link key={item._id} to={`/category/${item.slug}`}>
                                                    <Card className="p-5 hover:shadow-lg flex items-center gap-4 group h-full">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/40 dark:to-secondary-900/40 flex items-center justify-center flex-shrink-0 text-xl">📂</div>
                                                        )}
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{item.name}</h4>
                                                            {item.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>}
                                                        </div>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </ResultSection>
                                )}
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;