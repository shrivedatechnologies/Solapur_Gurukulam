// src/store/favouriteSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axios";

const initialState = {
  ids: [],
  loading: false,
  error: null,
  count: 0,
};

export const fetchFavouriteIds = createAsyncThunk(
  "favourites/fetchIds",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ apiClient already returns response.data, so we get the data directly
      const data = await apiClient.get("/favourites/ids");
      console.log("🟢 Fetch IDs response:", data);
      return data?.data || [];
    } catch (error) {
      console.error("Fetch IDs error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch favourites",
      );
    }
  },
);

export const toggleFavourite = createAsyncThunk(
  "favourites/toggle",
  async ({ itemId, itemType }, { rejectWithValue }) => {
    try {
      console.log("🔵 Toggle API Request:", { itemId, itemType });

      // ✅ apiClient already returns response.data, so we get the data directly
      const data = await apiClient.post("/favourites/toggle", {
        itemId,
        itemType,
      });

      console.log("🟢 Toggle response data:", data);

      // Check if we have data
      if (!data) {
        throw new Error("No data received from server");
      }

      // ✅ data is already the response.data from the server
      // { success: true, isFavourited: false, message: 'Removed from favourites' }
      console.log("🟢 Result:", data);

      return {
        itemId,
        itemType,
        isFavourited: data.isFavourited,
      };
    } catch (error) {
      console.error("🔴 Toggle API Error:", error);

      if (error.response) {
        return rejectWithValue(
          error.response.data?.message ||
            `Server error: ${error.response.status}`,
        );
      } else if (error.request) {
        return rejectWithValue(
          "No response from server. Please check your connection.",
        );
      } else {
        return rejectWithValue(error.message || "Failed to toggle favourite");
      }
    }
  },
);

export const removeFavourite = createAsyncThunk(
  "favourites/remove",
  async ({ itemId, itemType }, { rejectWithValue }) => {
    try {
      // ✅ apiClient already returns response.data
      await apiClient.delete(`/favourites/${itemId}`, { data: { itemType } });
      return { itemId, itemType };
    } catch (error) {
      console.error("Remove favourite error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove favourite",
      );
    }
  },
);

export const fetchFavouriteCount = createAsyncThunk(
  "favourites/fetchCount",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ apiClient already returns response.data
      const data = await apiClient.get("/favourites/count");
      return data?.count || 0;
    } catch (error) {
      console.error("Fetch count error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch count",
      );
    }
  },
);

const favouriteSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    clearFavourites: (state) => {
      state.ids = [];
      state.count = 0;
      state.error = null;
    },
    optimisticToggle: (state, action) => {
      const { itemId, itemType } = action.payload;
      const index = state.ids.findIndex(
        (fav) => fav.itemId === itemId && fav.itemType === itemType,
      );

      if (index !== -1) {
        state.ids.splice(index, 1);
        state.count = Math.max(0, state.count - 1);
      } else {
        state.ids.push({ itemId, itemType });
        state.count += 1;
      }
    },
    optimisticRemove: (state, action) => {
      const { itemId, itemType } = action.payload;
      const index = state.ids.findIndex(
        (fav) => fav.itemId === itemId && fav.itemType === itemType,
      );

      if (index !== -1) {
        state.ids.splice(index, 1);
        state.count = Math.max(0, state.count - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavouriteIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavouriteIds.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = action.payload || [];
        state.count = action.payload?.length || 0;
      })
      .addCase(fetchFavouriteIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavourite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        state.loading = false;
        const { itemId, itemType, isFavourited } = action.payload;
        const index = state.ids.findIndex(
          (fav) => fav.itemId === itemId && fav.itemType === itemType,
        );

        if (isFavourited && index === -1) {
          state.ids.push({ itemId, itemType });
          state.count += 1;
        } else if (!isFavourited && index !== -1) {
          state.ids.splice(index, 1);
          state.count = Math.max(0, state.count - 1);
        }
        console.log("🔄 State updated:", { isFavourited, count: state.count });
      })
      .addCase(toggleFavourite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Toggle rejected:", action.payload);
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        const { itemId, itemType } = action.payload;
        const index = state.ids.findIndex(
          (fav) => fav.itemId === itemId && fav.itemType === itemType,
        );
        if (index !== -1) {
          state.ids.splice(index, 1);
          state.count = Math.max(0, state.count - 1);
        }
      })
      .addCase(removeFavourite.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchFavouriteCount.fulfilled, (state, action) => {
        state.count = action.payload || 0;
      })
      .addCase(fetchFavouriteCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectFavouriteIds = (state) => state.favourites.ids;
export const selectIsFavourited = (state, itemId, itemType) => {
  return state.favourites.ids.some(
    (fav) => fav.itemId === itemId && fav.itemType === itemType,
  );
};
export const selectFavouritesCount = (state) => state.favourites.count;

export const { clearFavourites, optimisticToggle, optimisticRemove } =
  favouriteSlice.actions;

export default favouriteSlice.reducer;
