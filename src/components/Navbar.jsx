// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import useNavbarScroll from "../hooks/useNavbarScroll";

function Navbar() {
  const scrolled = useNavbarScroll();
  const navigate = useNavigate();

  // Check if user is logged in (stored in localStorage)
  const user = JSON.parse(localStorage.getItem("user"));

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user info
    navigate("/login");               // Redirect to login page
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/">
          <i className="fas fa-coins me-2"></i>Myneedi Loans
        </Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Hash links for sections */}
            <li className="nav-item">
              <HashLink className="nav-link" smooth to="/#home">Home</HashLink>
            </li>
            <li className="nav-item">
              <HashLink className="nav-link" smooth to="/#services">Services</HashLink>
            </li>
            <li className="nav-item">
              <HashLink className="nav-link" smooth to="/#about">About</HashLink>
            </li>
            <li className="nav-item">
              <HashLink className="nav-link" smooth to="/#contact">Contact</HashLink>
            </li>

            {/* Authentication Links */}
            {!user ? (
              // If user is NOT logged in
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              // If user IS logged in
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout} style={{ textDecoration: "none" }}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
