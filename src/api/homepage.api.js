import axiosInstance from './axios';

export const homepageApi = {
    getHero: () => axiosInstance.get('/homepage/hero'),
    updateHero: (data) => axiosInstance.put('/homepage/hero', data),
    getDailyMantra: () => axiosInstance.get('/homepage/daily-mantra'),
    updateDailyMantra: (data) => axiosInstance.put('/homepage/daily-mantra', data),
    getFeaturedMantras: () => axiosInstance.get('/homepage/featured-mantras'),
    updateFeaturedMantras: (data) => axiosInstance.put('/homepage/featured-mantras', data),
    getSEO: () => axiosInstance.get('/homepage/seo'),
    updateSEO: (data) => axiosInstance.put('/homepage/seo', data),
};