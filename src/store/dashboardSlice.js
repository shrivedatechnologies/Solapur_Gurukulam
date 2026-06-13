import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stats: null,
    topMantras: [], // Always array
    topShlokas: [], // Always array
    userAnalytics: { growth: [] },
    readAnalytics: { views: [], recent: [] },
    isLoading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setTopMantras: (state, action) => {
            state.topMantras = Array.isArray(action.payload) ? action.payload : [];
        },
        setTopShlokas: (state, action) => {
            state.topShlokas = Array.isArray(action.payload) ? action.payload : [];
        },
        setUserAnalytics: (state, action) => {
            const data = action.payload;
            state.userAnalytics = {
                growth: Array.isArray(data?.growth) ? data.growth : []
            };
        },
        setReadAnalytics: (state, action) => {
            const data = action.payload;
            state.readAnalytics = {
                views: Array.isArray(data?.views) ? data.views : [],
                recent: Array.isArray(data?.recent) ? data.recent : []
            };
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setStats,
    setTopMantras,
    setTopShlokas,
    setUserAnalytics,
    setReadAnalytics,
    setLoading,
    setError,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;