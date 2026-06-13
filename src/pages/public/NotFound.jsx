import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../../components/common/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">ॐ</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link to="/">
                    <Button variant="primary" size="lg">
                        <Home className="h-5 w-5 mr-2" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;