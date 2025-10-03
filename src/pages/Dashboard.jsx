// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate(); // useNavigate hook allows programmatic navigation

  // -------------------- PROTECT ROUTE --------------------
  // useEffect runs once when the component mounts
  // Checks if the user is logged in, otherwise redirects to login page
  useEffect(() => {
    const user = localStorage.getItem("user"); // Get user from localStorage
    if (!user) {
      navigate("/login"); // Redirect to login if no user found
    }
  }, [navigate]);

  // -------------------- GET USER INFO --------------------
  // Parse the stored user object or use empty object if null
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <section className="contact" style={{ minHeight: "100vh" }}>
      <div className="container">
        {/* Page Title */}
        <h2 className="section-title text-center">Dashboard</h2>

        {/* Welcome message with user's name */}
        <p className="section-subtitle text-center">
          Welcome, {user.name || "User"}! Track your loan applications.
        </p>

        {/* -------------------- LOGOUT BUTTON -------------------- */}
        <div className="text-center mt-4">
          <button
            className="btn btn-learn-more"
            onClick={() => {
              localStorage.removeItem("user"); // Remove logged-in user
              navigate("/login");              // Redirect to login page after logout
            }}
          >
            Logout
          </button>
        </div>

        {/* -------------------- FUTURE CONTENT -------------------- */}
        {/* Here you can later add user's loan data, charts, download options, etc. */}
      </div>
    </section>
  );
}

export default Dashboard;
