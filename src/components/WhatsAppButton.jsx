// src/components/WhatsAppButton.jsx
import React from "react";
import { APP_CONFIG } from "../config/app";

const WhatsAppButton = () => {
  const getApplicationData = () => {
    try {
      const savedData = localStorage.getItem("loanApplication");
      return savedData ? JSON.parse(savedData) : null;
    } catch {
      return null;
    }
  };

  const applicationData = getApplicationData();
  const hasApplication = applicationData?.applicationId;

  const message = hasApplication
    ? `Hi, I have submitted my loan application on your website.

Application ID: ${applicationData.applicationId}
Loan Type: ${applicationData.loanType || "Personal Loan"}

Please update me on the current status and next steps.`
    : `Hi, I visited your loan website and I want to know more about your loan options.

I need help with:
- Eligibility
- Interest rates
- Required documents

Please guide me.`;

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${APP_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat with us on WhatsApp"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        backgroundColor: "#25D366",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {/* WhatsApp SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M20.52 3.48A11.82 11.82 0 0 0 12.04 0C5.4 0 0 5.4 0 12.04c0 2.12.56 4.18 1.64 6L0 24l6.16-1.6a12 12 0 0 0 5.88 1.52h.04c6.64 0 12.04-5.4 12.04-12.04 0-3.22-1.26-6.24-3.56-8.4zM12.04 22c-1.8 0-3.56-.48-5.12-1.4l-.36-.2-3.64.96.96-3.52-.24-.36A9.9 9.9 0 0 1 2.12 12c0-5.44 4.44-9.88 9.92-9.88 2.64 0 5.12 1.04 7 2.92a9.84 9.84 0 0 1 2.92 7c0 5.44-4.44 9.96-9.92 9.96zm5.44-7.44c-.28-.16-1.64-.8-1.88-.88-.24-.08-.4-.12-.56.12-.16.24-.64.88-.8 1.04-.16.16-.32.2-.6.04-.28-.16-1.16-.44-2.2-1.4-.8-.72-1.36-1.6-1.52-1.88-.16-.28-.04-.44.12-.6.12-.12.28-.32.4-.48.12-.16.16-.28.24-.44.08-.16.04-.32-.04-.48-.08-.16-.56-1.36-.76-1.88-.2-.48-.4-.4-.56-.4h-.48c-.16 0-.44.08-.68.32-.24.24-.88.88-.88 2.12s.92 2.44 1.04 2.6c.12.16 1.8 2.72 4.36 3.8.6.24 1.08.4 1.44.52.6.2 1.16.16 1.6.08.48-.08 1.64-.68 1.88-1.32.24-.64.24-1.2.16-1.32-.08-.12-.24-.2-.52-.36z" />
      </svg>
    </button>
  );
};

export default WhatsAppButton;
