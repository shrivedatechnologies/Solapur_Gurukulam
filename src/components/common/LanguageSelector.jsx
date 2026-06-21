import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, Globe } from "lucide-react";
import { setLanguage } from "../../store/languageSlice";

const languages = [
  { code: "sanskrit", label: "संस्कृत", nativeLabel: "Sanskrit", icon: "🕉️" },
  { code: "kannada", label: "ಕನ್ನಡ", nativeLabel: "Kannada", icon: "🇮🇳" },
  { code: "marathi", label: "मराठी", nativeLabel: "Marathi", icon: "🇮🇳" },
  { code: "tamil", label: "తెలుగు", nativeLabel: "Telugu", icon: "🇮🇳" },
  { code: "hindi", label: "हिन्दी", nativeLabel: "Hindi", icon: "🇮🇳" },
  { code: "english", label: "English", nativeLabel: "English", icon: "📖" },
];

const LanguageSelector = ({ variant = "navbar" }) => {
  const dispatch = useDispatch();
  const languageState = useSelector((state) => state.language);
  const currentLanguage = languageState?.currentLanguage || "sanskrit";

  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (langCode) => {
    dispatch(setLanguage(langCode));
    setIsOpen(false);
    // Optional: Reload page to refresh content
    // window.location.reload();
  };

  const getCurrentLanguage = () => {
    return languages.find((l) => l.code === currentLanguage) || languages[0];
  };

  const currentLang = getCurrentLanguage();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".language-selector")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Navbar variant - compact
  if (variant === "navbar") {
    return (
      <div className="relative language-selector">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all duration-200 border border-transparent hover:border-amber-200 dark:hover:border-amber-700"
        >
          <span className="text-sm">{currentLang.icon}</span>
          <span className="hidden sm:inline">{currentLang.nativeLabel}</span>
          <span className="sm:hidden">{currentLang.label}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 z-50 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors flex items-center justify-between ${
                  currentLanguage === lang.code
                    ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {lang.nativeLabel}
                  </span>
                  {currentLanguage === lang.code && (
                    <span className="text-amber-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Details page variant - larger
  return (
    <div className="relative language-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-amber-200/40 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <Globe className="h-4 w-4 text-amber-500" />
        <span className="hidden sm:inline">{currentLang.nativeLabel}</span>
        <span className="sm:hidden">{currentLang.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors flex items-center justify-between ${
                  currentLanguage === lang.code
                    ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {lang.nativeLabel}
                  </span>
                  {currentLanguage === lang.code && (
                    <span className="text-amber-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
