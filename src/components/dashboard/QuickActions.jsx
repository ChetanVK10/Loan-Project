import React from 'react';
import { useNavigate } from 'react-router-dom';

function QuickActions({ application, onUpdate }) {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleApplyNew = () => {
    navigate('/', { state: { scrollTo: 'contact' } });
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const canEdit = application && 
    !['Approved', 'Rejected'].includes(application.loanStatus);

  return (
    <div className="card border-0 mb-4" style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", overflow: "hidden" }}>
      <div className="card-header text-white p-4" style={{
        background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
        borderBottom: "none"
      }}>
        <h5 className="mb-0 fw-bold" style={{ fontSize: "1.3rem" }}>
          <i className="fas fa-bolt me-2" style={{ color: "#FFD700" }}></i>Quick Actions
        </h5>
      </div>
      <div className="card-body p-4">
        <div className="row g-3">
          <div className="col-md-6">
            <button
              className="btn w-100 py-3"
              onClick={handleApplyNew}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontWeight: "600",
                boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="fas fa-plus-circle fa-2x mb-2 d-block"></i>
              <span>Apply for New Loan</span>
            </button>
          </div>
          
          {canEdit && (
            <div className="col-md-6">
              <button
                className="btn w-100 py-3"
                onClick={() => scrollToSection('emi-plan')}
                style={{
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  fontWeight: "600",
                  boxShadow: "0 8px 20px rgba(240, 147, 251, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <i className="fas fa-edit fa-2x mb-2 d-block"></i>
                <span>Edit Loan Request</span>
              </button>
            </div>
          )}

          {application && !['Approved', 'Rejected'].includes(application.loanStatus) && (
            <div className="col-md-6">
              <button
                className="btn w-100 py-3"
                onClick={() => scrollToSection('document-upload')}
                style={{
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  fontWeight: "600",
                  boxShadow: "0 8px 20px rgba(79, 172, 254, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <i className="fas fa-upload fa-2x mb-2 d-block"></i>
                <span>Upload Documents</span>
              </button>
            </div>
          )}

          <div className="col-md-6">
            <button
              className="btn w-100 py-3"
              onClick={() => scrollToSection('emi-plan')}
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                color: "#2C2C2C",
                border: "none",
                borderRadius: "16px",
                fontWeight: "600",
                boxShadow: "0 8px 20px rgba(255, 215, 0, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="fas fa-calculator fa-2x mb-2 d-block"></i>
              <span>Calculate EMI</span>
            </button>
          </div>

          <div className="col-md-6">
            <button
              className="btn w-100 py-3"
              onClick={() => {
                if (onUpdate) onUpdate();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontWeight: "600",
                boxShadow: "0 8px 20px rgba(250, 112, 154, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="fas fa-sync fa-2x mb-2 d-block"></i>
              <span>Refresh Data</span>
            </button>
          </div>

          <div className="col-md-6">
            <button
              className="btn w-100 py-3"
              onClick={() => scrollToSection('loan-history')}
              style={{
                background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                color: "#2C2C2C",
                border: "none",
                borderRadius: "16px",
                fontWeight: "600",
                boxShadow: "0 8px 20px rgba(168, 237, 234, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="fas fa-history fa-2x mb-2 d-block"></i>
              <span>View History</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-3" style={{ background: "#f8f9fa", borderRadius: "12px", borderLeft: "4px solid #FFD700" }}>
          <h6 className="mb-2 fw-bold" style={{ color: "#2C2C2C" }}>
            <i className="fas fa-phone-alt me-2" style={{ color: "#FFD700" }}></i>Need Help?
          </h6>
          <p className="mb-3 small text-muted">Contact our support team for assistance:</p>
          <div className="d-flex gap-3 flex-wrap">
            <a href="tel:+919876543210" className="btn btn-sm" style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "8px 20px",
              fontWeight: "600"
            }}>
              <i className="fas fa-phone me-2"></i>Call Us
            </a>
            <a href="mailto:support@myneedi.com" className="btn btn-sm" style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "8px 20px",
              fontWeight: "600"
            }}>
              <i className="fas fa-envelope me-2"></i>Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;
