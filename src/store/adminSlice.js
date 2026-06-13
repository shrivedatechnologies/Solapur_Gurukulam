import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    admins: [],
    isLoading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdmins: (state, action) => {
            state.admins = action.payload;
        },
        addAdmin: (state, action) => {
            state.admins.push(action.payload);
        },
        updateAdmin: (state, action) => {
            const index = state.admins.findIndex(a => a._id === action.payload._id);
            if (index !== -1) {
                state.admins[index] = action.payload;
            }
        },
        deleteAdmin: (state, action) => {
            state.admins = state.admins.filter(a => a._id !== action.payload);
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
    setAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    setLoading,
    setError,
} = adminSlice.actions;
export default adminSlice.reducer;