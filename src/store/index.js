// ===================================================================
// FIX 2: frontend/src/store/index.js
// PROBLEM: loadState() dispatches 'auth/setCredentials' action jo exist
//          nahi karta authSlice me. isliye isAuthenticated false reh jaata hai
//          login ke baad page refresh karne pe.
// SOLUTION: Preloaded state use karo configureStore me
// ===================================================================

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import categoryReducer from "./categorySlice";
import mantraReducer from "./mantraSlice";
import shlokaReducer from "./shlokaSlice";
import dashboardReducer from "./dashboardSlice";
import homepageReducer from "./homepageSlice";
import languageReducer from "./languageSlice";
import adminReducer from "./adminSlice";
import themeReducer from "./themeSlice";
import favouriteReducer from "./favouriteSlice";

// Load persisted auth state from localStorage
const loadAuthState = () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");

    if (accessToken && userStr) {
      const user = JSON.parse(userStr);
      return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
  } catch (err) {
    console.error("Error loading auth state:", err);
  }
  return undefined; // will use slice's initialState
};

const loadThemeState = () => {
  try {
    const theme = localStorage.getItem("theme");
    if (theme !== null) {
      return { darkMode: JSON.parse(theme) };
    }
  } catch (err) {}
  return undefined;
};

const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoryReducer,
  favourites: favouriteReducer,
  mantras: mantraReducer,
  shlokas: shlokaReducer,
  dashboard: dashboardReducer,
  homepage: homepageReducer,
  language: languageReducer,
  admin: adminReducer,
  theme: themeReducer,
});

// Pre-load state from localStorage so auth persists across page refresh
const preloadedState = {
  auth: loadAuthState(),
  theme: loadThemeState(),
};

// Remove undefined keys so reducers use their own initialState
Object.keys(preloadedState).forEach(
  (key) => preloadedState[key] === undefined && delete preloadedState[key],
);

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

// Persist auth and theme to localStorage on every state change
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem("theme", JSON.stringify(state.theme.darkMode));
    // Auth is persisted directly in authSlice reducers (setCredentials, logout)
  } catch (err) {
    console.error("Error saving state:", err);
  }
});

export default store;
