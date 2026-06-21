// src/components/common/FavouriteButton.jsx
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import useFavourite from "../../hooks/useFavourite";

const FavouriteButton = ({ itemId, itemType, size = 24, className = "" }) => {
  const { isFavourited, toggleFav, loading } = useFavourite({
    itemId,
    itemType,
  });
  const [localFav, setLocalFav] = useState(isFavourited);

  // Sync local state with Redux state
  useEffect(() => {
    setLocalFav(isFavourited);
  }, [isFavourited]);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Optimistic UI update
    setLocalFav(!localFav);

    try {
      await toggleFav();
    } catch (error) {
      // Revert on error
      setLocalFav(isFavourited);
    }
  };

  // ✅ Responsive sizes - larger on mobile for better touch targets
  const getSize = () => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return size + 4; // Larger on mobile
    }
    return size;
  };

  const iconSize = getSize();
  const touchTargetSize = Math.max(iconSize + 16, 44); // Minimum 44px touch target

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        relative transition-all duration-200 ease-in-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
        rounded-full
        flex items-center justify-center
        min-w-[44px] min-h-[44px] /* ✅ Minimum touch target for mobile */
        ${localFav ? "scale-110" : "scale-100"}
        ${className}
      `}
      style={{
        width: touchTargetSize,
        height: touchTargetSize,
      }}
      aria-label={localFav ? "Remove from favourites" : "Add to favourites"}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-red-500" />
      ) : (
        <Heart
          size={iconSize}
          className={`
            transition-all duration-300
            ${localFav ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"}
          `}
          strokeWidth={localFav ? 2 : 2.5}
        />
      )}
    </button>
  );
};

export default FavouriteButton;
