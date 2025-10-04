// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./style.css";

// Components
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";    // 👈 New Home page
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard"; // <-- Import admin dashboard

// Custom hooks
import useSmoothScroll from "./hooks/useSmoothScroll";
import useFadeInOnScroll from "./hooks/useFadeInOnScroll";

// Runs hooks that depend on Router context
function AppEffects() {
  useSmoothScroll();
  useFadeInOnScroll();
  return null;
}

function App() {
  return (
    <Router>
      <AppEffects />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* <-- Add admin dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
