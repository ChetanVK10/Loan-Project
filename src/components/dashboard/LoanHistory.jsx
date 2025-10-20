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
      <div className="card border-0 mb-4" style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", overflow: "hidden" }}>
        <div className="card-header text-white p-4" style={{
          background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
          borderBottom: "none"
        }}>
          <h5 className="mb-0 fw-bold" style={{ fontSize: "1.3rem" }}>
            <i className="fas fa-history me-2" style={{ color: "#FFD700" }}></i>Loan History
          </h5>
        </div>
        <div className="card-body text-center py-5">
          <i className="fas fa-clipboard-list fa-4x mb-3" style={{ color: "#FFD700", opacity: "0.5" }}></i>
          <p className="text-muted" style={{ fontSize: "1.1rem" }}>No loan history found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 mb-4" style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", overflow: "hidden" }}>
      <div className="card-header text-white p-4" style={{
        background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
        borderBottom: "none"
      }}>
        <h5 className="mb-0 fw-bold" style={{ fontSize: "1.3rem" }}>
          <i className="fas fa-history me-2" style={{ color: "#FFD700" }}></i>Loan History
        </h5>
      </div>
      <div className="card-body p-4">
        <div className="table-responsive">
          <table className="table table-hover" style={{ fontSize: "0.95rem" }}>
            <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
              <tr>
                <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>Application ID</th>
                <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>Loan Type</th>
                <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>Requested Amount</th>
                <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>Approved Amount</th>
                <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>Status</th>
                <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>Submitted Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} style={{ borderBottom: "1px solid #f1f3f5" }}>
                  <td className="py-3">
                    <small className="text-muted">{app._id.substring(0, 8)}...</small>
                  </td>
                  <td className="py-3"><strong style={{ color: "#2C2C2C" }}>{getLoanTypeDisplay(app.loanType)}</strong></td>
                  <td className="py-3 fw-semibold" style={{ color: "#667eea" }}>₹{app.requestedAmount?.toLocaleString('en-IN') || 0}</td>
                  <td className="py-3 fw-semibold" style={{ color: "#10b981" }}>
                    {app.loanStatus === 'Approved' 
                      ? `₹${app.approvedAmount?.toLocaleString('en-IN') || 0}`
                      : '—'}
                  </td>
                  <td className="py-3">
                    <span className={`badge ${getStatusBadge(app.loanStatus)}`} style={{ borderRadius: "20px", padding: "5px 12px" }}>
                      {app.loanStatus}
                    </span>
                  </td>
                  <td className="py-3">
                    <small>
                      {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3" style={{ background: "#f8f9fa", borderRadius: "12px", borderLeft: "4px solid #FFD700" }}>
          <small style={{ color: "#2C2C2C" }}>
            <i className="fas fa-chart-pie me-2" style={{ color: "#FFD700" }}></i>
            <strong>Total Applications:</strong> {applications.length} | 
            <strong className="ms-2">Approved:</strong> {applications.filter(a => a.loanStatus === 'Approved').length} | 
            <strong className="ms-2">Pending:</strong> {applications.filter(a => a.loanStatus === 'Pending').length}
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoanHistory;
