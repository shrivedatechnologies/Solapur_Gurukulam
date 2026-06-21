// src/hooks/useFavourite.js
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  selectIsFavourited,
  toggleFavourite,
  optimisticToggle,
} from "../store/favouriteSlice";

const useFavourite = ({ itemId, itemType }) => {
  const dispatch = useDispatch();
  const isFavourited = useSelector((state) =>
    selectIsFavourited(state, itemId, itemType),
  );
  const { user } = useSelector((state) => state.auth);
  const isLoading = useSelector((state) => state.favourites.loading);

  const toggleFav = useCallback(async () => {
    // Check if user is authenticated
    if (!user) {
      toast.error("Please login to add favourites");
      return;
    }

    // Check if we have the required data
    if (!itemId || !itemType) {
      console.error("Missing required data:", { itemId, itemType });
      toast.error("Invalid item data");
      return;
    }

    console.log("🔵 Toggling favourite:", { itemId, itemType });

    // Optimistic update
    dispatch(optimisticToggle({ itemId, itemType }));

    try {
      const result = await dispatch(
        toggleFavourite({ itemId, itemType }),
      ).unwrap();
      console.log("🟢 Toggle result:", result);
      toast.success(
        result.isFavourited
          ? "Added to favourites ❤️"
          : "Removed from favourites 💔",
      );
    } catch (error) {
      console.error("🔴 Toggle error:", error);
      // Revert optimistic update on error
      dispatch(optimisticToggle({ itemId, itemType }));
      toast.error(error || "Failed to toggle favourite");
    }
  }, [dispatch, itemId, itemType, user]);

  return {
    isFavourited,
    toggleFav,
    loading: isLoading,
  };
};

export default useFavourite;
