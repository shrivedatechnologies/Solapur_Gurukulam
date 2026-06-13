import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <AdminSidebar />
            <div className="flex-1 ml-64">
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;