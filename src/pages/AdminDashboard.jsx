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
    <div className="container-fluid" style={{ paddingTop: "100px", paddingBottom: "50px", background: "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h2 className="fw-bold mb-2" style={{ fontSize: "2.5rem", color: "#2C2C2C" }}>
            <i className="fas fa-shield-alt me-3" style={{ color: "#FFD700" }}></i>Admin Dashboard
          </h2>
          <p className="text-muted" style={{ fontSize: "1.1rem" }}>Manage and review loan applications with ease</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-danger" 
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            style={{
              borderRadius: "50px",
              padding: "12px 30px",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(220, 53, 69, 0.3)",
              border: "none",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card border-0 h-100" style={{
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div className="card-body text-center p-4">
                <i className="fas fa-file-alt fa-3x mb-3" style={{ opacity: "0.9" }}></i>
                <h3 className="mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>{stats.totalApplications}</h3>
                <p className="mb-0" style={{ fontSize: "0.95rem", opacity: "0.9" }}>Total Applications</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 h-100" style={{
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div className="card-body text-center p-4">
                <i className="fas fa-clock fa-3x mb-3" style={{ opacity: "0.9" }}></i>
                <h3 className="mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>{stats.pendingApplications}</h3>
                <p className="mb-0" style={{ fontSize: "0.95rem", opacity: "0.9" }}>Pending Review</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 h-100" style={{
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div className="card-body text-center p-4">
                <i className="fas fa-check-circle fa-3x mb-3" style={{ opacity: "0.9" }}></i>
                <h3 className="mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>{stats.approvedApplications}</h3>
                <p className="mb-0" style={{ fontSize: "0.95rem", opacity: "0.9" }}>Approved</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 h-100" style={{
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              color: "#2C2C2C",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div className="card-body text-center p-4">
                <i className="fas fa-rupee-sign fa-3x mb-3"></i>
                <h3 className="mb-2 fw-bold" style={{ fontSize: "1.8rem" }}>₹{stats.totalApprovedAmount?.toLocaleString('en-IN') || 0}</h3>
                <p className="mb-0 fw-semibold" style={{ fontSize: "0.95rem" }}>Total Approved Amount</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 mb-4" style={{
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
      }}>
        <div className="card-body p-4">
          <div className="row align-items-center g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold mb-2" style={{ color: "#2C2C2C", fontSize: "1.05rem" }}>
                <i className="fas fa-filter me-2" style={{ color: "#FFD700" }}></i>Filter by Status:
              </label>
              <select 
                className="form-select" 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  borderRadius: "12px",
                  border: "2px solid #e9ecef",
                  padding: "12px 15px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease"
                }}
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
              <button 
                className="btn" 
                onClick={fetchData}
                style={{
                  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                  border: "none",
                  borderRadius: "50px",
                  padding: "12px 30px",
                  fontWeight: "600",
                  color: "#2C2C2C",
                  boxShadow: "0 5px 15px rgba(255, 215, 0, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(255, 215, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 5px 15px rgba(255, 215, 0, 0.3)";
                }}
              >
                <i className="fas fa-sync me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card border-0" style={{
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        overflow: "hidden"
      }}>
        <div className="card-header text-white p-4" style={{
          background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
          borderBottom: "none"
        }}>
          <h5 className="mb-0 fw-bold" style={{ fontSize: "1.3rem" }}>
            <i className="fas fa-list-alt me-2" style={{ color: "#FFD700" }}></i>
            Loan Applications 
            <span className="badge ms-2" style={{
              background: "#FFD700",
              color: "#2C2C2C",
              borderRadius: "20px",
              padding: "5px 15px"
            }}>{applications.length}</span>
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize: "0.95rem" }}>
              <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
                <tr>
                  <th className="py-3 px-4 fw-semibold" style={{ color: "#2C2C2C" }}>Applicant</th>
                  <th className="py-3 px-4 fw-semibold" style={{ color: "#2C2C2C" }}>Contact</th>
                  <th className="py-3 px-4 fw-semibold" style={{ color: "#2C2C2C" }}>Loan Type</th>
                  <th className="py-3 px-4 fw-semibold" style={{ color: "#2C2C2C" }}>Requested</th>
                  <th className="py-3 px-4 fw-semibold" style={{ color: "#2C2C2C" }}>Approved</th>
                  <th className="py-3 px-4 fw-semibold" style={{ color: "#2C2C2C" }}>Status</th>
                  <th className="py-3 px-4 fw-semibold" style={{ color: "#2C2C2C" }}>Submitted</th>
                  <th className="py-3 px-4 fw-semibold" style={{ color: "#2C2C2C" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <i className="fas fa-inbox fa-3x text-muted mb-3 d-block"></i>
                      <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>No applications found</p>
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id} style={{ borderBottom: "1px solid #f1f3f5" }}>
                      <td className="py-3 px-4">
                        <strong style={{ color: "#2C2C2C" }}>{app.name}</strong>
                      </td>
                      <td className="py-3 px-4">
                        <small className="d-block">{app.email}</small>
                        <small className="text-muted">{app.phone}</small>
                      </td>
                      <td className="py-3 px-4">{getLoanTypeDisplay(app.loanType)}</td>
                      <td className="py-3 px-4 fw-semibold" style={{ color: "#667eea" }}>₹{app.requestedAmount?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 fw-semibold" style={{ color: "#10b981" }}>
                        {app.loanStatus === 'Approved' 
                          ? `₹${app.approvedAmount?.toLocaleString('en-IN')}`
                          : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(app.loanStatus)} style={{ borderRadius: "20px", padding: "5px 12px" }}>{app.loanStatus}</span>
                      </td>
                      <td className="py-3 px-4">
                        <small>
                          {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </small>
                      </td>
                      <td className="py-3 px-4">
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-info"
                            onClick={() => openViewModal(app)}
                            title="View Details & Documents"
                            style={{ borderRadius: "8px 0 0 8px" }}
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
                                style={{ borderRadius: "0 8px 8px 0" }}
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(44, 44, 44, 0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: "20px", border: "none", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div className="modal-header text-white p-4" style={{
                background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
                borderBottom: "none",
                borderRadius: "20px 20px 0 0"
              }}>
                <h5 className="modal-title fw-bold" style={{ fontSize: "1.4rem" }}>
                  <i className={`fas ${modalAction === 'approve' ? 'fa-check-circle' : modalAction === 'reject' ? 'fa-times-circle' : 'fa-info-circle'} me-2`} style={{ color: "#FFD700" }}></i>
                  {modalAction === 'approve' ? 'Approve Loan Application' : 
                   modalAction === 'reject' ? 'Reject Loan Application' :
                   'Application Details'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  style={{ filter: "brightness(0) invert(1)" }}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4 p-3" style={{ background: "#f8f9fa", borderRadius: "12px" }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block mb-1">Applicant</small>
                      <strong style={{ color: "#2C2C2C" }}>{selectedApp.name}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block mb-1">Email</small>
                      <strong style={{ color: "#2C2C2C" }}>{selectedApp.email}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block mb-1">Phone</small>
                      <strong style={{ color: "#2C2C2C" }}>{selectedApp.phone}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block mb-1">Loan Type</small>
                      <strong style={{ color: "#2C2C2C" }}>{getLoanTypeDisplay(selectedApp.loanType)}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block mb-1">Requested Amount</small>
                      <strong style={{ color: "#667eea", fontSize: "1.1rem" }}>₹{selectedApp.requestedAmount?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block mb-1">Status</small>
                      <span className={getStatusBadge(selectedApp.loanStatus)} style={{ borderRadius: "20px", padding: "5px 12px" }}>{selectedApp.loanStatus}</span>
                    </div>
                  </div>
                </div>

                {modalAction === 'view' ? (
                  <>
                    {selectedApp.message && (
                      <div className="mb-3 p-3" style={{ background: "#fff8e1", borderRadius: "12px", borderLeft: "4px solid #FFD700" }}>
                        <small className="text-muted d-block mb-1 fw-semibold">Message</small>
                        <p className="mb-0" style={{ color: "#2C2C2C" }}>{selectedApp.message}</p>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <h6 className="fw-bold mb-3" style={{ color: "#2C2C2C" }}>
                        <i className="fas fa-paperclip me-2" style={{ color: "#FFD700" }}></i>
                        Uploaded Documents ({selectedApp.documents?.length || 0})
                      </h6>
                      {selectedApp.documents && selectedApp.documents.length > 0 ? (
                        <div className="list-group">
                          {selectedApp.documents.map((doc, index) => (
                            <div key={index} className="list-group-item border-0 mb-2" style={{ background: "#f8f9fa", borderRadius: "12px" }}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <i className="fas fa-file-alt me-2" style={{ color: "#667eea" }}></i>
                                  <strong style={{ color: "#2C2C2C" }}>{doc.documentType}</strong>
                                  <br/>
                                  <small className="text-muted ms-4">{doc.fileName}</small>
                                </div>
                                <small className="text-muted">
                                  {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                                </small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert mb-0" style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "12px" }}>
                          <i className="fas fa-exclamation-triangle me-2" style={{ color: "#FFA500" }}></i>
                          No documents uploaded yet.
                        </div>
                      )}
                    </div>

                    {selectedApp.notifications && selectedApp.notifications.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-3" style={{ color: "#2C2C2C" }}>
                          <i className="fas fa-bell me-2" style={{ color: "#FFD700" }}></i>
                          Recent Notifications
                        </h6>
                        <div className="list-group">
                          {selectedApp.notifications.slice(0, 3).map((notif, index) => (
                            <div key={index} className="list-group-item border-0 mb-2" style={{ background: "#f8f9fa", borderRadius: "12px" }}>
                              <small style={{ color: "#2C2C2C" }}>{notif.message}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : modalAction === 'approve' ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ color: "#2C2C2C" }}>
                        <i className="fas fa-rupee-sign me-2" style={{ color: "#FFD700" }}></i>Approved Amount (₹)
                      </label>
                      <input 
                        type="number"
                        className="form-control"
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(e.target.value)}
                        style={{ borderRadius: "12px", border: "2px solid #e9ecef", padding: "12px 15px" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ color: "#2C2C2C" }}>
                        <i className="fas fa-calendar-alt me-2" style={{ color: "#FFD700" }}></i>Tenure (months)
                      </label>
                      <input 
                        type="number"
                        className="form-control"
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                        style={{ borderRadius: "12px", border: "2px solid #e9ecef", padding: "12px 15px" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ color: "#2C2C2C" }}>
                        <i className="fas fa-percentage me-2" style={{ color: "#FFD700" }}></i>Interest Rate (% per annum)
                      </label>
                      <input 
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        style={{ borderRadius: "12px", border: "2px solid #e9ecef", padding: "12px 15px" }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: "#2C2C2C" }}>
                      <i className="fas fa-comment-dots me-2" style={{ color: "#FFD700" }}></i>Rejection Reason
                    </label>
                    <textarea 
                      className="form-control"
                      rows="4"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      style={{ borderRadius: "12px", border: "2px solid #e9ecef", padding: "12px 15px" }}
                    ></textarea>
                  </div>
                )}
              </div>
              <div className="modal-footer p-4" style={{ borderTop: "1px solid #e9ecef", borderRadius: "0 0 20px 20px" }}>
                {modalAction === 'view' ? (
                  <button 
                    className="btn"
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      border: "none",
                      borderRadius: "50px",
                      padding: "12px 30px",
                      fontWeight: "600",
                      color: "#2C2C2C"
                    }}
                  >
                    <i className="fas fa-times me-2"></i>Close
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                      style={{ borderRadius: "50px", padding: "12px 30px", fontWeight: "600" }}
                    >
                      Cancel
                    </button>
                    {modalAction === 'approve' ? (
                      <button 
                        className="btn btn-success" 
                        onClick={handleApprove}
                        style={{ borderRadius: "50px", padding: "12px 30px", fontWeight: "600" }}
                      >
                        <i className="fas fa-check me-2"></i>Approve Loan
                      </button>
                    ) : (
                      <button 
                        className="btn btn-danger" 
                        onClick={handleReject}
                        style={{ borderRadius: "50px", padding: "12px 30px", fontWeight: "600" }}
                      >
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
