const Skeleton = ({ className = '' }) => {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
    );
};

export const SkeletonCard = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <Skeleton className="h-48 w-full rounded-lg mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    );
};

export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="space-y-3">
            <div className="flex gap-4">
                {Array(columns).fill().map((_, i) => (
                    <Skeleton key={i} className="h-10 flex-1" />
                ))}
            </div>
            {Array(rows).fill().map((_, i) => (
                <div key={i} className="flex gap-4">
                    {Array(columns).fill().map((_, j) => (
                        <Skeleton key={j} className="h-12 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Skeleton;