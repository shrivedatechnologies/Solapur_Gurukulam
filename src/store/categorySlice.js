import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [],
    currentCategory: null,
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload || [];
        },
        setCurrentCategory: (state, action) => {
            state.currentCategory = action.payload;
        },
        addCategory: (state, action) => {
            state.categories = [action.payload, ...(state.categories || [])];
        },
        updateCategory: (state, action) => {
            const index = (state.categories || []).findIndex(cat => cat._id === action.payload._id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        deleteCategory: (state, action) => {
            state.categories = (state.categories || []).filter(cat => cat._id !== action.payload);
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
    setCategories,
    setCurrentCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    setLoading,
    setError,
    setPagination,
} = categorySlice.actions;
export default categorySlice.reducer;