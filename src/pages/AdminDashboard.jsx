import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // 'approve', 'reject', or 'view'
  
  // Approval form state
  const [approvedAmount, setApprovedAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch statistics
      const statsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/statistics`);
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.statistics);

      // Fetch applications with filter
      const appsUrl = filterStatus 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/admin/applications?status=${filterStatus}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/admin/applications`;
      
      const appsRes = await fetch(appsUrl);
      const appsData = await appsRes.json();
      if (appsData.success) setApplications(appsData.applications);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openApproveModal = (app) => {
    setSelectedApp(app);
    setApprovedAmount(app.requestedAmount);
    setTenure(app.tenure || 12);
    setInterestRate(app.loanType === 'personal' ? 12.5 : app.loanType === 'home' ? 8.5 : 11.0);
    setModalAction('approve');
    setShowModal(true);
  };

  const openRejectModal = (app) => {
    setSelectedApp(app);
    setRejectionReason('');
    setModalAction('reject');
    setShowModal(true);
  };

  const openViewModal = (app) => {
    setSelectedApp(app);
    setModalAction('view');
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!approvedAmount || !tenure || !interestRate) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/application/${selectedApp._id}/approve`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            approvedAmount: Number(approvedAmount),
            tenure: Number(tenure),
            interestRate: Number(interestRate)
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('✅ Loan approved successfully!');
        setShowModal(false);
        fetchData();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error approving loan:', error);
      alert('⚠️ Failed to approve. Please try again.');
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/application/${selectedApp._id}/reject`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: rejectionReason })
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('✅ Loan rejected');
        setShowModal(false);
        fetchData();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error rejecting loan:', error);
      alert('⚠️ Failed to reject. Please try again.');
    }
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

  const getStatusBadge = (status) => {
    const classes = {
      'Pending': 'badge bg-warning text-dark',
      'Under Review': 'badge bg-info',
      'Approved': 'badge bg-success',
      'Rejected': 'badge bg-danger',
      'Documents Required': 'badge bg-warning text-dark'
    };
    return classes[status] || 'badge bg-secondary';
  };

  if (loading && !applications.length) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold"><i className="fas fa-shield-alt me-2 text-primary"></i>Admin Dashboard</h2>
          <p className="text-muted">Manage and review loan applications</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-danger" onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}>
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-file-alt fa-2x text-primary mb-2"></i>
                <h4 className="mb-0">{stats.totalApplications}</h4>
                <small className="text-muted">Total Applications</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                <h4 className="mb-0">{stats.pendingApplications}</h4>
                <small className="text-muted">Pending Review</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                <h4 className="mb-0">{stats.approvedApplications}</h4>
                <small className="text-muted">Approved</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-rupee-sign fa-2x text-info mb-2"></i>
                <h4 className="mb-0">₹{stats.totalApprovedAmount?.toLocaleString('en-IN') || 0}</h4>
                <small className="text-muted">Total Approved Amount</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <label className="form-label fw-bold">Filter by Status:</label>
              <select 
                className="form-select" 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Applications</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Documents Required">Documents Required</option>
              </select>
            </div>
            <div className="col-md-6 text-end">
              <button className="btn btn-primary" onClick={fetchData}>
                <i className="fas fa-sync me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Loan Applications ({applications.length})</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Applicant</th>
                  <th>Contact</th>
                  <th>Loan Type</th>
                  <th>Requested</th>
                  <th>Approved</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.name}</strong>
                      </td>
                      <td>
                        <small>{app.email}</small><br/>
                        <small className="text-muted">{app.phone}</small>
                      </td>
                      <td>{getLoanTypeDisplay(app.loanType)}</td>
                      <td className="text-primary">₹{app.requestedAmount?.toLocaleString('en-IN')}</td>
                      <td className="text-success">
                        {app.loanStatus === 'Approved' 
                          ? `₹${app.approvedAmount?.toLocaleString('en-IN')}`
                          : '—'}
                      </td>
                      <td>
                        <span className={getStatusBadge(app.loanStatus)}>{app.loanStatus}</span>
                      </td>
                      <td>
                        <small>
                          {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-info"
                            onClick={() => openViewModal(app)}
                            title="View Details & Documents"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {(app.loanStatus === 'Pending' || app.loanStatus === 'Under Review') && (
                            <>
                              <button 
                                className="btn btn-success"
                                onClick={() => openApproveModal(app)}
                                title="Approve"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button 
                                className="btn btn-danger"
                                onClick={() => openRejectModal(app)}
                                title="Reject"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalAction === 'approve' ? 'Approve Loan Application' : 
                   modalAction === 'reject' ? 'Reject Loan Application' :
                   'Application Details'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Applicant:</strong> {selectedApp.name}<br/>
                  <strong>Email:</strong> {selectedApp.email}<br/>
                  <strong>Phone:</strong> {selectedApp.phone}<br/>
                  <strong>Loan Type:</strong> {getLoanTypeDisplay(selectedApp.loanType)}<br/>
                  <strong>Requested Amount:</strong> ₹{selectedApp.requestedAmount?.toLocaleString('en-IN')}<br/>
                  <strong>Status:</strong> <span className={getStatusBadge(selectedApp.loanStatus)}>{selectedApp.loanStatus}</span>
                </div>

                {modalAction === 'view' ? (
                  <>
                    {selectedApp.message && (
                      <div className="mb-3">
                        <strong>Message:</strong>
                        <p className="text-muted">{selectedApp.message}</p>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <strong>📎 Uploaded Documents ({selectedApp.documents?.length || 0})</strong>
                      {selectedApp.documents && selectedApp.documents.length > 0 ? (
                        <div className="list-group mt-2">
                          {selectedApp.documents.map((doc, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <i className="fas fa-file-alt text-primary me-2"></i>
                                <strong>{doc.documentType}</strong><br/>
                                <small className="text-muted">{doc.fileName}</small>
                              </div>
                              <div>
                                <small className="text-muted">
                                  {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                                </small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-warning mt-2">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          No documents uploaded yet.
                        </div>
                      )}
                    </div>

                    {selectedApp.notifications && selectedApp.notifications.length > 0 && (
                      <div className="mb-3">
                        <strong>📢 Notifications</strong>
                        <div className="list-group mt-2">
                          {selectedApp.notifications.slice(0, 3).map((notif, index) => (
                            <div key={index} className="list-group-item">
                              <small>{notif.message}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : modalAction === 'approve' ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Approved Amount (₹)</label>
                      <input 
                        type="number"
                        className="form-control"
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Tenure (months)</label>
                      <input 
                        type="number"
                        className="form-control"
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Interest Rate (% per annum)</label>
                      <input 
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    <label className="form-label">Rejection Reason</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                    ></textarea>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {modalAction === 'view' ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    {modalAction === 'approve' ? (
                      <button className="btn btn-success" onClick={handleApprove}>
                        <i className="fas fa-check me-2"></i>Approve Loan
                      </button>
                    ) : (
                      <button className="btn btn-danger" onClick={handleReject}>
                        <i className="fas fa-times me-2"></i>Reject Loan
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
