import React from 'react';

function LoanHistory({ applications }) {
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

  if (!applications || applications.length === 0) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0"><i className="fas fa-history me-2"></i>Loan History</h5>
        </div>
        <div className="card-body text-center py-5">
          <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
          <p className="text-muted">No loan history found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-secondary text-white">
        <h5 className="mb-0"><i className="fas fa-history me-2"></i>Loan History</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Application ID</th>
                <th>Loan Type</th>
                <th>Requested Amount</th>
                <th>Approved Amount</th>
                <th>Status</th>
                <th>Submitted Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <small className="text-muted">{app._id.substring(0, 8)}...</small>
                  </td>
                  <td>{getLoanTypeDisplay(app.loanType)}</td>
                  <td className="text-primary">₹{app.requestedAmount?.toLocaleString('en-IN') || 0}</td>
                  <td className="text-success">
                    {app.loanStatus === 'Approved' 
                      ? `₹${app.approvedAmount?.toLocaleString('en-IN') || 0}`
                      : '—'}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(app.loanStatus)}`}>
                      {app.loanStatus}
                    </span>
                  </td>
                  <td>
                    {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3">
          <small className="text-muted">
            <i className="fas fa-info-circle me-2"></i>
            Total Applications: <strong>{applications.length}</strong> | 
            Approved: <strong>{applications.filter(a => a.loanStatus === 'Approved').length}</strong> | 
            Pending: <strong>{applications.filter(a => a.loanStatus === 'Pending').length}</strong>
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoanHistory;
