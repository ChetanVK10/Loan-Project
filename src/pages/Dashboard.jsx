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
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");
      
      // Send token in Authorization header
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/user/${userData._id}?email=${userData.email}`,
        {
          headers: {
            "Authorization": `Bearer ${token}` // JWT token in Bearer format
          }
        }
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
    // Remove both token and user data
    localStorage.removeItem("token");
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
    <section style={{ minHeight: "100vh", paddingTop: "100px", paddingBottom: "50px", background: "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)" }}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4 align-items-center">
          <div className="col-md-8">
            <h2 className="fw-bold mb-2" style={{ fontSize: "2.5rem", color: "#2C2C2C" }}>
              <i className="fas fa-user-circle me-3" style={{ color: "#FFD700" }}></i>
              Welcome, {user?.name || "User"}!
            </h2>
            <p className="text-muted" style={{ fontSize: "1.1rem" }}>Track and manage your loan applications effortlessly</p>
          </div>
          <div className="col-md-4 text-md-end">
            <button
              className="btn btn-danger"
              onClick={handleLogout}
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

        {/* Quick Stats */}
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
                <i className="fas fa-file-invoice fa-3x mb-3" style={{ opacity: "0.9" }}></i>
                <h3 className="mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>{applications.length}</h3>
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
                <i className="fas fa-hourglass-half fa-3x mb-3" style={{ opacity: "0.9" }}></i>
                <h3 className="mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>
                  {applications.filter(a => a.loanStatus === 'Pending').length}
                </h3>
                <p className="mb-0" style={{ fontSize: "0.95rem", opacity: "0.9" }}>Pending</p>
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
                <h3 className="mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>
                  {applications.filter(a => a.loanStatus === 'Approved').length}
                </h3>
                <p className="mb-0" style={{ fontSize: "0.95rem", opacity: "0.9" }}>Approved</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 h-100" style={{
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div className="card-body text-center p-4">
                <i className="fas fa-times-circle fa-3x mb-3" style={{ opacity: "0.9" }}></i>
                <h3 className="mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>
                  {applications.filter(a => a.loanStatus === 'Rejected').length}
                </h3>
                <p className="mb-0" style={{ fontSize: "0.95rem", opacity: "0.9" }}>Rejected</p>
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
