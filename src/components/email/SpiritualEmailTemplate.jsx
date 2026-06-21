// src/components/email/SpiritualEmailTemplate.jsx
import React from "react";
import { Link } from "react-router-dom";

const SpiritualEmailTemplate = ({
  title,
  greeting,
  message,
  buttonText,
  buttonLink,
  footerMessage,
  type = "verification", // 'verification', 'reset', 'welcome', 'newsletter'
  userName = "Devotee",
}) => {
  const getEmoji = () => {
    switch (type) {
      case "verification":
        return "🕉️";
      case "reset":
        return "🔱";
      case "welcome":
        return "🙏";
      case "newsletter":
        return "📿";
      default:
        return "🕉️";
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "verification":
        return "from-amber-500 to-orange-600";
      case "reset":
        return "from-red-500 to-rose-600";
      case "welcome":
        return "from-emerald-500 to-teal-600";
      case "newsletter":
        return "from-purple-500 to-indigo-600";
      default:
        return "from-amber-500 to-orange-600";
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#fdfaf5",
        borderRadius: "16px",
        border: "1px solid #fde68a",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header with Om Symbol */}
      <div
        style={{
          textAlign: "center",
          padding: "30px 0 20px 0",
          borderBottom: "2px solid #fde68a",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #ea580c)",
            boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            ॐ
          </span>
        </div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#1f2937",
            marginTop: "12px",
            marginBottom: "4px",
          }}
        >
          Solapur Gurukulam
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
            margin: "0",
          }}
        >
          🙏 Where Spirituality Meets Wisdom
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: "30px 20px",
          backgroundColor: "white",
          borderRadius: "12px",
          margin: "20px 0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        {/* Decorative Element */}
        <div
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "16px",
          }}
        >
          {getEmoji()}
        </div>

        {/* Greeting */}
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "12px",
          }}
        >
          {greeting || `Namaste ${userName}! 🙏`}
        </h2>

        {/* Title */}
        {title && (
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#d97706",
              marginBottom: "16px",
            }}
          >
            {title}
          </h3>
        )}

        {/* Message */}
        <div
          style={{
            color: "#4b5563",
            fontSize: "16px",
            lineHeight: "1.8",
          }}
        >
          {message}
        </div>

        {/* Button */}
        {buttonText && buttonLink && (
          <div
            style={{
              textAlign: "center",
              margin: "30px 0 20px 0",
            }}
          >
            <a
              href={buttonLink}
              style={{
                display: "inline-block",
                padding: "14px 36px",
                background: `linear-gradient(135deg, ${getBgColor()})`,
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              {buttonText}
            </a>
          </div>
        )}

        {/* Footer Message */}
        {footerMessage && (
          <div
            style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid #f3f4f6",
              color: "#6b7280",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {footerMessage}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "20px 0 10px 0",
          borderTop: "2px solid #fde68a",
          color: "#6b7280",
          fontSize: "13px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "12px",
            fontSize: "20px",
          }}
        >
          <span>🕉️</span>
          <span>🙏</span>
          <span>🪷</span>
          <span>📿</span>
          <span>🔱</span>
        </div>
        <p style={{ margin: "4px 0" }}>
          © 2024 Solapur Gurukulam. All rights reserved.
        </p>
        <p style={{ margin: "4px 0", fontSize: "12px" }}>
          🌿 May the divine light guide you always 🌿
        </p>
        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "#9ca3af",
          }}
        >
          <span>📧 Contact: gurukulam@solapur.org</span>
          <br />
          <span>📍 Solapur, Maharashtra, India</span>
        </div>
      </div>
    </div>
  );
};

export default SpiritualEmailTemplate;
