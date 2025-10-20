import React from 'react';

function LoanSummary({ application }) {
  if (!application) {
    return (
      <div className="card border-0 mb-4" style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}>
        <div className="card-body text-center py-5">
          <i className="fas fa-inbox fa-4x mb-3" style={{ color: "#FFD700" }}></i>
          <p className="text-muted" style={{ fontSize: "1.1rem" }}>No loan applications found. Apply for a loan to get started!</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'bg-warning text-dark',
      'Under Review': 'bg-info text-white',
      'Approved': 'bg-success text-white',
      'Rejected': 'bg-danger text-white',
      'Documents Required': 'bg-warning text-dark'
    };
    return statusClasses[status] || 'bg-secondary text-white';
  };

  const getLoanTypeDisplay = (type) => {
    const types = {
      'personal': 'Personal Loan',
      'home': 'Home Loan',
      'business': 'Business Loan',
      'consultation': 'Consultation'
    };
    return types[type] || type;
  };

  return (
    <div className="card border-0 mb-4" style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", overflow: "hidden" }}>
      <div className="card-header text-white p-4" style={{
        background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
        borderBottom: "none"
      }}>
        <h5 className="mb-0 fw-bold" style={{ fontSize: "1.3rem" }}>
          <i className="fas fa-file-invoice-dollar me-2" style={{ color: "#FFD700" }}></i>
          Loan Application Summary
        </h5>
      </div>
      <div className="card-body p-4">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="p-3 h-100" style={{ background: "#f8f9fa", borderRadius: "12px", borderLeft: "4px solid #FFD700" }}>
              <small className="text-muted d-block mb-1 fw-semibold">Loan Type</small>
              <h6 className="mb-0 fw-bold" style={{ color: "#2C2C2C", fontSize: "1.1rem" }}>{getLoanTypeDisplay(application.loanType)}</h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 h-100" style={{ background: "#f8f9fa", borderRadius: "12px", borderLeft: "4px solid #667eea" }}>
              <small className="text-muted d-block mb-1 fw-semibold">Application Status</small>
              <h6 className="mb-0 mt-1">
                <span className={`badge ${getStatusBadge(application.loanStatus)}`} style={{ borderRadius: "20px", padding: "6px 15px", fontSize: "0.9rem" }}>
                  {application.loanStatus}
                </span>
              </h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 h-100" style={{ background: "#f8f9fa", borderRadius: "12px", borderLeft: "4px solid #4facfe" }}>
              <small className="text-muted d-block mb-1 fw-semibold">Requested Amount</small>
              <h6 className="mb-0 fw-bold" style={{ color: "#4facfe", fontSize: "1.2rem" }}>
                {application.requestedAmount ? `₹${application.requestedAmount.toLocaleString('en-IN')}` : 'Not specified'}
              </h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 h-100" style={{ background: "#f8f9fa", borderRadius: "12px", borderLeft: "4px solid #10b981" }}>
              <small className="text-muted d-block mb-1 fw-semibold">
                {application.loanStatus === 'Approved' ? 'Approved Amount' : 'Awaiting Approval'}
              </small>
              <h6 className="mb-0 fw-bold" style={{ color: "#10b981", fontSize: "1.2rem" }}>
                {application.loanStatus === 'Approved' 
                  ? `₹${application.approvedAmount?.toLocaleString('en-IN') || 0}`
                  : '—'}
              </h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 h-100" style={{ background: "#f8f9fa", borderRadius: "12px", borderLeft: "4px solid #FFA500" }}>
              <small className="text-muted d-block mb-1 fw-semibold">Submission Date</small>
              <h6 className="mb-0 fw-bold" style={{ color: "#2C2C2C", fontSize: "1rem" }}>
                {new Date(application.submittedAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 h-100" style={{ background: "#f8f9fa", borderRadius: "12px", borderLeft: "4px solid #764ba2" }}>
              <small className="text-muted d-block mb-1 fw-semibold">Application ID</small>
              <h6 className="mb-0 text-truncate" style={{ fontSize: '0.85rem', color: "#6c757d" }}>
                {application._id}
              </h6>
            </div>
          </div>
        </div>

        {application.message && (
          <div className="mt-4 p-3" style={{ background: "#fff8e1", borderRadius: "12px", borderLeft: "4px solid #FFD700" }}>
            <small className="text-muted d-block mb-2 fw-semibold">
              <i className="fas fa-comment-dots me-2" style={{ color: "#FFD700" }}></i>Your Message:
            </small>
            <p className="mb-0" style={{ color: "#2C2C2C", lineHeight: "1.6" }}>{application.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanSummary;
