// src/components/WhatsAppButton.jsx
import React from 'react';
import { FaWhatsapp } from "react-icons/fa";
import { APP_CONFIG } from '../config/app';

const WhatsAppButton = () => {
  // Get application data from localStorage or context
  const getApplicationData = () => {
    try {
      const savedData = localStorage.getItem('loanApplication');
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error reading application data:', error);
      return null;
    }
  };

  const applicationData = getApplicationData();
  const hasApplication = applicationData?.applicationId;

  const getWhatsAppMessage = () => {
    if (hasApplication) {
      return `Hi, I have submitted my loan application on your website.

Application ID: ${applicationData.applicationId}
Loan Type: ${applicationData.loanType || 'Personal Loan'}

Please update me on the current status and next steps.`;
    }

    return `Hi, I visited your loan website and I want to know more about your loan options.

I need help with:
- Eligibility
- Interest rates
- Required documents

Please guide me.`;
  };

  const handleClick = () => {
    const message = encodeURIComponent(getWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${APP_CONFIG.WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const buttonStyle = {
    backgroundColor: '#25D366',
    color: 'white',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1000,
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleClick}
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </button>
  );
};

export default WhatsAppButton;