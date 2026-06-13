
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
    const spinner = (
        <div className="flex items-center justify-center">
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <div className="animate-pulse absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                </div>
            </div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Loader;