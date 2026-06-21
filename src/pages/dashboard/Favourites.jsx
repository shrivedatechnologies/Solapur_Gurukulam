import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  BookOpen,
  Music,
  Star,
  Grid,
  List,
  ChevronRight,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "../../api/axios";
import { optimisticRemove } from "../../store/favouriteSlice";
import { categoryApi } from "../../api/category.api";

// ─── Helpers ────────────────────────────────────────────────────
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const getCategoryColor = (categoryName) => {
  if (!categoryName) return "from-amber-100 to-orange-200";
  const name = categoryName.toLowerCase();
  if (name.includes("shiva") || name.includes("mahadev")) return "from-indigo-100 to-purple-200";
  if (name.includes("ganesh")) return "from-red-100 to-orange-200";
  if (name.includes("durga")) return "from-pink-100 to-rose-200";
  if (name.includes("vishnu")) return "from-teal-100 to-cyan-200";
  if (name.includes("lakshmi")) return "from-yellow-100 to-amber-200";
  if (name.includes("saraswati")) return "from-blue-100 to-indigo-200";
  if (name.includes("hanuman")) return "from-orange-100 to-red-200";
  return "from-amber-100 to-orange-200";
};

const getBorderColor = (categoryName) => {
  if (!categoryName) return "border-amber-200";
  const name = categoryName.toLowerCase();
  if (name.includes("shiva") || name.includes("mahadev")) return "border-indigo-300";
  if (name.includes("ganesh")) return "border-red-300";
  if (name.includes("durga")) return "border-pink-300";
  if (name.includes("vishnu")) return "border-teal-300";
  if (name.includes("lakshmi")) return "border-yellow-300";
  if (name.includes("saraswati")) return "border-blue-300";
  if (name.includes("hanuman")) return "border-orange-300";
  return "border-amber-300";
};

const getTypeIcon = (type) => {
  switch (type) {
    case "mantra":
      return <BookOpen className="h-4 w-4" />;
    case "shloka":
      return <Music className="h-4 w-4" />;
    case "shotram":
      return <Star className="h-4 w-4" />;
    default:
      return <Heart className="h-4 w-4" />;
  }
};

const getTypeLabel = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const Favourites = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [viewMode, setViewMode] = useState("grid");

  // ─── Fetch categories for images ─────────────────────────────
  const { data: categoriesData } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => categoryApi.getAll({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });
  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  const tabs = [
    { id: "all", label: "All", icon: Heart },
    { id: "mantra", label: "Mantras", icon: BookOpen },
    { id: "shloka", label: "Shlokas", icon: Music },
    { id: "shotram", label: "Shotrams", icon: Star },
  ];

  const fetchFavourites = async (page = 1, itemType = null) => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (itemType && itemType !== "all") {
        params.itemType = itemType;
      }

      const response = await apiClient.get("/favourites", { params });

      const favouritesData = response?.data || [];
      const total = response?.total || 0;
      const totalPages = response?.totalPages || 1;

      setFavourites(favouritesData);
      setPagination({
        page: response?.page || 1,
        total: total,
        totalPages: totalPages,
      });
    } catch (error) {
      console.error("Error fetching favourites:", error);
      toast.error(error.response?.data?.message || "Failed to load favourites");
      setFavourites([]);
      setPagination({
        page: 1,
        total: 0,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavourites(1, activeTab);
    }
  }, [user, activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setFavourites([]);
    fetchFavourites(1, tabId);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchFavourites(newPage, activeTab);
    }
  };

  const handleRemoveFavourite = async (itemId, itemType, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setFavourites((prev) =>
        prev.filter((fav) => !(fav.itemId === itemId && fav.itemType === itemType)),
      );
      dispatch(optimisticRemove({ itemId, itemType }));

      await apiClient.delete(`/favourites/${itemId}`, { data: { itemType } });

      toast.success("Removed from favourites");

      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    } catch (error) {
      console.error("Error removing favourite:", error);
      toast.error("Failed to remove from favourites");
      fetchFavourites(pagination.page, activeTab);
    }
  };

  // ─── Helpers for category data ───────────────────────────────
  const getCategory = (categoryId) => {
    return categories.find((c) => c._id === categoryId);
  };

  const getCategoryImage = (categoryId) => {
    const cat = getCategory(categoryId);
    return cat?.image ? getImageUrl(cat.image) : null;
  };

  const getCategoryName = (categoryId) => {
    const cat = getCategory(categoryId);
    return cat?.name || "";
  };

  const renderCard = (fav) => {
    if (!fav) return null;

    const item = fav.itemData || {};
    const type = fav.itemType || "";
    const itemName = item?.name || fav.itemName || "Unnamed Item";
    const itemSlug = item?.slug || fav.itemSlug || fav.itemId;
    const categoryId = item?.category?._id || item?.category || fav.categoryId;
    const categoryName = getCategoryName(categoryId);
    const catImage = getCategoryImage(categoryId);
    const gradientBg = getCategoryColor(categoryName);
    const borderColor = getBorderColor(categoryName);
    const fallbackIcon = categoryName ? categoryName.charAt(0).toUpperCase() : "?";

    const linkTo = `/${type}/${itemSlug}`;

    return (
      <Link
        key={`${fav.itemId}-${fav.itemType}`}
        to={linkTo}
        className="block group"
      >
        <div
          className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border ${borderColor} hover:border-amber-400/60`}
        >
          {/* Category accent bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${gradientBg}`} />

          <div className="p-5">
            <div className="flex items-start gap-3">
              {/* Category image / avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center shadow-inner flex-shrink-0 border-2 border-white/50 group-hover:scale-110 transition-transform duration-300">
                {catImage ? (
                  <img
                    src={catImage}
                    alt={categoryName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const parent = e.target.parentElement;
                      parent.innerHTML = `<span class="text-xl font-bold text-amber-700">${fallbackIcon}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-xl font-bold text-amber-700">{fallbackIcon}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors line-clamp-1">
                      {itemName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                        {getTypeIcon(type)} {getTypeLabel(type)}
                      </span>
                      {categoryName && (
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          {categoryName}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveFavourite(fav.itemId, fav.itemType, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                    aria-label="Remove from favourites"
                  >
                    <Heart
                      size={18}
                      className="hover:fill-red-500 transition-colors"
                    />
                  </button>
                </div>

                {/* Sanskrit preview if available */}
                {item?.sanskrit && (
                  <p className="mt-2 font-devanagari text-sm text-gray-600 dark:text-gray-300 line-clamp-2 bg-amber-50/40 dark:bg-amber-900/10 rounded-lg px-3 py-2 leading-relaxed">
                    {item.sanskrit.slice(0, 80)}...
                  </p>
                )}

                {/* Bottom row: date + view action */}
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Added{" "}
                    {fav.createdAt
                      ? new Date(fav.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                  <span className="text-amber-600 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    View <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center mb-4">
        <Heart size={40} className="text-red-400 dark:text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        No Favourites Yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        Start exploring and click the heart icon on any mantra, shloka, or
        shotram to add it to your favourites.
      </p>
    </div>
  );

  const hasFavourites = Array.isArray(favourites) && favourites.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Favourites
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total || 0} item{pagination.total !== 1 ? "s" : ""}{" "}
            saved
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === "grid"
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            aria-label="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === "list"
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Tabs with counts */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count =
            tab.id === "all"
              ? pagination.total
              : favourites.filter((f) => f.itemType === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                ${
                  activeTab === tab.id
                    ? "bg-amber-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-600" />
        </div>
      ) : !hasFavourites ? (
        renderEmptyState()
      ) : (
        <>
          <div
            className={`
            grid gap-4
            ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }
          `}
          >
            {favourites.map((fav) => renderCard(fav))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Favourites;