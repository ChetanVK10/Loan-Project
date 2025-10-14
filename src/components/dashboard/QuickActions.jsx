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
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0"><i className="fas fa-bolt me-2"></i>Quick Actions</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <button
              className="btn btn-primary w-100 h-100 py-3"
              onClick={handleApplyNew}
            >
              <i className="fas fa-plus-circle fa-2x mb-2 d-block"></i>
              <span>Apply for New Loan</span>
            </button>
          </div>
          
          {canEdit && (
            <div className="col-md-4">
              <button
                className="btn btn-warning w-100 h-100 py-3"
                onClick={() => scrollToSection('emi-plan')}
              >
                <i className="fas fa-edit fa-2x mb-2 d-block"></i>
                <span>Edit Loan Request</span>
              </button>
            </div>
          )}

          {application && !['Approved', 'Rejected'].includes(application.loanStatus) && (
            <div className="col-md-4">
              <button
                className="btn btn-info w-100 h-100 py-3"
                onClick={() => scrollToSection('document-upload')}
              >
                <i className="fas fa-upload fa-2x mb-2 d-block"></i>
                <span>Upload Documents</span>
              </button>
            </div>
          )}

          <div className="col-md-4">
            <button
              className="btn btn-success w-100 h-100 py-3"
              onClick={() => scrollToSection('emi-plan')}
            >
              <i className="fas fa-calculator fa-2x mb-2 d-block"></i>
              <span>Calculate EMI</span>
            </button>
          </div>

          <div className="col-md-4">
            <button
              className="btn btn-secondary w-100 h-100 py-3"
              onClick={() => {
                if (onUpdate) onUpdate();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <i className="fas fa-sync fa-2x mb-2 d-block"></i>
              <span>Refresh Data</span>
            </button>
          </div>

          <div className="col-md-4">
            <button
              className="btn btn-outline-primary w-100 h-100 py-3"
              onClick={() => scrollToSection('loan-history')}
            >
              <i className="fas fa-history fa-2x mb-2 d-block"></i>
              <span>View History</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-light rounded">
          <h6 className="mb-2"><i className="fas fa-phone-alt me-2 text-primary"></i>Need Help?</h6>
          <p className="mb-2 small">Contact our support team for assistance:</p>
          <div className="d-flex gap-3 flex-wrap">
            <a href="tel:+919876543210" className="btn btn-sm btn-outline-primary">
              <i className="fas fa-phone me-2"></i>Call Us
            </a>
            <a href="mailto:support@myneedi.com" className="btn btn-sm btn-outline-primary">
              <i className="fas fa-envelope me-2"></i>Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;
