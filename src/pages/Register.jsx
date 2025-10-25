import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  // -------------------- STATE --------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  // -------------------- HANDLE INPUT CHANGE --------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -------------------- VALIDATION --------------------
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full Name is required";

    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Email is invalid";
    }

    if (!formData.password.trim()) errs.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    return errs;
  };

  // -------------------- HANDLE SUBMIT --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      try {
        // Call backend API
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
    }),
  });

        const data = await res.json();

        if (res.status === 201) {
          alert("✅ Registered successfully!");
          
          // Save JWT token in localStorage
          localStorage.setItem("token", data.token);
          
          // Save user info in localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          
          // Reset form
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });

          // Auto-login: Redirect to dashboard based on role
          if (data.user.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          alert(data.message); // e.g., User already exists
        }
      } catch (err) {
        console.error(err);
        alert("Server error. Try again later.");
      }
    }
  };

  return (
    <section className="contact" style={{ minHeight: "100vh" }}>
      <div className="container">
        <h2 className="section-title text-center">Register</h2>
        <p className="section-subtitle text-center">
          Create an account to track your loan applications
        </p>

        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-submit w-100">Register</button>
              </form>

              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-warning">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
