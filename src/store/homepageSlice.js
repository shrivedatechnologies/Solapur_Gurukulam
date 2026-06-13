import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hero: null,
    dailyMantra: null,
    featuredMantras: [],
    seo: null,
    isLoading: false,
    error: null,
};

const homepageSlice = createSlice({
    name: 'homepage',
    initialState,
    reducers: {
        setHero: (state, action) => {
            state.hero = action.payload;
        },
        setDailyMantra: (state, action) => {
            state.dailyMantra = action.payload;
        },
        setFeaturedMantras: (state, action) => {
            state.featuredMantras = action.payload;
        },
        setSEO: (state, action) => {
            state.seo = action.payload;
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
    setHero,
    setDailyMantra,
    setFeaturedMantras,
    setSEO,
    setLoading,
    setError,
} = homepageSlice.actions;
export default homepageSlice.reducer;