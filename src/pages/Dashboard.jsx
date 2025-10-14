// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoanSummary from "../components/dashboard/LoanSummary";
import EMIPlan from "../components/dashboard/EMIPlan";
import DocumentUpload from "../components/dashboard/DocumentUpload";
import Notifications from "../components/dashboard/Notifications";
import LoanHistory from "../components/dashboard/LoanHistory";
import QuickActions from "../components/dashboard/QuickActions";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------- PROTECT ROUTE --------------------
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchApplications(parsedUser);
    }
  }, [navigate]);

  // -------------------- FETCH APPLICATIONS --------------------
  const fetchApplications = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/user/${userData._id}?email=${userData.email}`
      );
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.applications);
        // Set the most recent application as current
        if (data.applications.length > 0) {
          setCurrentApplication(data.applications[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (user) {
      fetchApplications(user);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <section className="contact" style={{ minHeight: "100vh", paddingTop: "100px" }}>
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact" style={{ minHeight: "100vh", paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold mb-2">
              <i className="fas fa-user-circle me-2 text-primary"></i>
              Welcome, {user?.name || "User"}!
            </h2>
            <p className="text-muted">Track and manage your loan applications</p>
          </div>
          <div className="col-md-4 text-md-end">
            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm bg-primary text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{applications.length}</h3>
                <small>Total Applications</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm bg-warning text-dark">
              <div className="card-body text-center">
                <h3 className="mb-0">
                  {applications.filter(a => a.loanStatus === 'Pending').length}
                </h3>
                <small>Pending</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm bg-success text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">
                  {applications.filter(a => a.loanStatus === 'Approved').length}
                </h3>
                <small>Approved</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm bg-danger text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">
                  {applications.filter(a => a.loanStatus === 'Rejected').length}
                </h3>
                <small>Rejected</small>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Module 1: Loan Summary */}
            <div id="loan-summary">
              <LoanSummary application={currentApplication} />
            </div>

            {/* Module 2: EMI Plan */}
            <div id="emi-plan">
              <EMIPlan application={currentApplication} onUpdate={handleRefresh} />
            </div>

            {/* Module 3: Document Upload */}
            <div id="document-upload">
              <DocumentUpload application={currentApplication} onUpdate={handleRefresh} />
            </div>

            {/* Module 5: Loan History */}
            <div id="loan-history">
              <LoanHistory applications={applications} />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4">
            {/* Module 4: Notifications */}
            <div id="notifications">
              <Notifications application={currentApplication} onMarkRead={handleRefresh} />
            </div>

            {/* Module 6: Quick Actions */}
            <div id="quick-actions">
              <QuickActions application={currentApplication} onUpdate={handleRefresh} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
