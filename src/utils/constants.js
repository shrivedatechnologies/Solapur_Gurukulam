export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh-token',
        VERIFY_EMAIL: '/auth/verify-email',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        PROFILE: '/auth/profile',
    },
    CATEGORIES: '/categories',
    MANTRAS: '/mantras',
    SHLOKAS: '/shlokas',
    DASHBOARD: '/dashboard',
    HOMEPAGE: '/homepage',
    SEARCH: '/search',
};

export const APP_CONFIG = {
    APP_NAME: 'Pandit Ji Mantra Platform',
    APP_VERSION: '1.0.0',
    DEFAULT_PAGINATION_LIMIT: 10,
    DEBOUNCE_DELAY: 500,
    TOAST_DURATION: 4000,
};