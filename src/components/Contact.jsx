import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    loanType: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Client-side form validation
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Email is invalid";
    }
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    if (!formData.loanType) errs.loanType = "Please select a loan type";
    return errs;
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        // ✅ Send POST request to backend (correct port 3001)
        const response = await fetch("https://loan-backend-uatr.onrender.com/api/loan-application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          alert("✅ Thank you for your application! We'll contact you soon.");
          // ✅ Reset form after successful submission
          setFormData({
            name: "",
            email: "",
            phone: "",
            loanType: "",
            message: "",
          });
        } else {
          alert(`❌ Error: ${data.message}`);
        }
      } catch (err) {
        console.error("Submission error:", err);
        alert("⚠️ Failed to send application. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section id="contact" className="contact py-5">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">Get Started Today</h2>
          <p className="text-muted">
            Ready to take the next step? Contact us for a free consultation
          </p>
        </div>

        {/* Form Card */}
        <div className="card shadow-lg border-0 p-4 rounded-4">
          <form onSubmit={handleSubmit} className="row g-4">
            {/* Full Name */}
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Phone */}
            <div className="col-md-12">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            {/* Loan Type */}
            <div className="col-md-12">
              <label className="form-label">Loan Type</label>
              <select
                value={formData.loanType}
                onChange={(e) =>
                  setFormData({ ...formData, loanType: e.target.value })
                }
                className={`form-control ${errors.loanType ? "is-invalid" : ""}`}
              >
                <option value="">Select loan type</option>
                <option value="personal">Personal Loan</option>
                <option value="home">Home Loan</option>
                <option value="business">Business Loan</option>
                <option value="consultation">Consultation</option>
              </select>
              {errors.loanType && (
                <div className="invalid-feedback">{errors.loanType}</div>
              )}
            </div>

            {/* Message */}
            <div className="col-md-12">
              <label className="form-label">Message</label>
              <textarea
                placeholder="Tell us about your loan requirements"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="form-control"
                rows="4"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="col-12 text-center">
              <button
                type="submit"
                className="btn btn-warning w-100 py-3 rounded-pill fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin me-2"></i>
                ) : (
                  <i className="fas fa-paper-plane me-2"></i>
                )}
                {loading ? "Sending..." : "Send Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
