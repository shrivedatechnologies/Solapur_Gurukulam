import { useSelector } from 'react-redux';

export const useAuth = () => {
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

    const hasRole = (roles) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    const isAdmin = hasRole(['admin', 'super_admin']);
    const isSuperAdmin = hasRole(['super_admin']);
    const isUser = hasRole(['user']);

    return {
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        isSuperAdmin,
        isUser,
        hasRole,
    };
};