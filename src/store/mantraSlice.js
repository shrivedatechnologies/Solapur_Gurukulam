import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mantras: [],
    currentMantra: null,
    featuredMantras: [],
    popularMantras: [],
    dailyMantra: null,
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
};

const mantraSlice = createSlice({
    name: 'mantras',
    initialState,
    reducers: {
        setMantras: (state, action) => {
            state.mantras = action.payload || [];
        },
        setCurrentMantra: (state, action) => {
            state.currentMantra = action.payload;
        },
        setFeaturedMantras: (state, action) => {
            state.featuredMantras = action.payload || [];
        },
        setPopularMantras: (state, action) => {
            state.popularMantras = action.payload || [];
        },
        setDailyMantra: (state, action) => {
            state.dailyMantra = action.payload;
        },
        addMantra: (state, action) => {
            state.mantras = [action.payload, ...(state.mantras || [])];
        },
        updateMantra: (state, action) => {
            const index = (state.mantras || []).findIndex(m => m._id === action.payload._id);
            if (index !== -1) {
                state.mantras[index] = action.payload;
            }
            if (state.currentMantra?._id === action.payload._id) {
                state.currentMantra = action.payload;
            }
        },
        deleteMantra: (state, action) => {
            state.mantras = (state.mantras || []).filter(m => m._id !== action.payload);
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setPagination: (state, action) => {
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
    },
});

export const {
    setMantras,
    setCurrentMantra,
    setFeaturedMantras,
    setPopularMantras,
    setDailyMantra,
    addMantra,
    updateMantra,
    deleteMantra,
    setLoading,
    setError,
    setPagination,
} = mantraSlice.actions;
export default mantraSlice.reducer;