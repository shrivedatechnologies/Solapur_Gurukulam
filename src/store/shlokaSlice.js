import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    shlokas: [],
    currentShloka: null,
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
};

const shlokaSlice = createSlice({
    name: 'shlokas',
    initialState,
    reducers: {
        setShlokas: (state, action) => {
            state.shlokas = action.payload;
        },
        setCurrentShloka: (state, action) => {
            state.currentShloka = action.payload;
        },
        addShloka: (state, action) => {
            state.shlokas.unshift(action.payload);
        },
        updateShloka: (state, action) => {
            const index = state.shlokas.findIndex(s => s._id === action.payload._id);
            if (index !== -1) {
                state.shlokas[index] = action.payload;
            }
            if (state.currentShloka?._id === action.payload._id) {
                state.currentShloka = action.payload;
            }
        },
        deleteShloka: (state, action) => {
            state.shlokas = state.shlokas.filter(s => s._id !== action.payload);
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
    setShlokas,
    setCurrentShloka,
    addShloka,
    updateShloka,
    deleteShloka,
    setLoading,
    setError,
    setPagination,
} = shlokaSlice.actions;
export default shlokaSlice.reducer;