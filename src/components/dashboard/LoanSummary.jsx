import React from 'react';

function LoanSummary({ application }) {
  if (!application) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center py-5">
          <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
          <p className="text-muted">No loan applications found. Apply for a loan to get started!</p>
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
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0"><i className="fas fa-file-invoice-dollar me-2"></i>Loan Application Summary</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="border rounded p-3 h-100">
              <small className="text-muted">Loan Type</small>
              <h6 className="mb-0 mt-1">{getLoanTypeDisplay(application.loanType)}</h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded p-3 h-100">
              <small className="text-muted">Application Status</small>
              <h6 className="mb-0 mt-1">
                <span className={`badge ${getStatusBadge(application.loanStatus)}`}>
                  {application.loanStatus}
                </span>
              </h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded p-3 h-100">
              <small className="text-muted">Requested Amount</small>
              <h6 className="mb-0 mt-1 text-primary">
                {application.requestedAmount ? `₹${application.requestedAmount.toLocaleString('en-IN')}` : 'Not specified'}
              </h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded p-3 h-100">
              <small className="text-muted">
                {application.loanStatus === 'Approved' ? 'Approved Amount' : 'Awaiting Approval'}
              </small>
              <h6 className="mb-0 mt-1 text-success">
                {application.loanStatus === 'Approved' 
                  ? `₹${application.approvedAmount?.toLocaleString('en-IN') || 0}`
                  : '—'}
              </h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded p-3 h-100">
              <small className="text-muted">Submission Date</small>
              <h6 className="mb-0 mt-1">
                {new Date(application.submittedAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </h6>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded p-3 h-100">
              <small className="text-muted">Application ID</small>
              <h6 className="mb-0 mt-1 text-truncate" style={{ fontSize: '0.9rem' }}>
                {application._id}
              </h6>
            </div>
          </div>
        </div>

        {application.message && (
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">Your Message:</small>
            <p className="mb-0 mt-1">{application.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanSummary;
