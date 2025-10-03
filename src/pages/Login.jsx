import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email is invalid";

    if (!formData.password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      try {
        // Call backend login API
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        email: formData.email,
        password: formData.password,
  }),
});

        const data = await res.json();

        if (res.status === 200) {
          // Save user info (optional)
          localStorage.setItem("user", JSON.stringify(data.user));

          // Redirect to dashboard
          navigate("/dashboard");
        } else {
          alert(data.message);
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
        <h2 className="section-title text-center">Login</h2>
        <p className="section-subtitle text-center">Welcome back! Please login to your account</p>

        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
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

                <button type="submit" className="btn btn-submit w-100">Login</button>
              </form>

              <p className="text-center mt-3">
                Don’t have an account? <Link to="/register" className="text-warning">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
