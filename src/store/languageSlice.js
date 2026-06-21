// src/store/languageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLanguage: localStorage.getItem("preferredLanguage") || "sanskrit",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      localStorage.setItem("preferredLanguage", action.payload);
    },
    resetLanguage: (state) => {
      state.currentLanguage = "sanskrit";
      localStorage.setItem("preferredLanguage", "sanskrit");
    },
  },
});

export const { setLanguage, resetLanguage } = languageSlice.actions;
export default languageSlice.reducer;
