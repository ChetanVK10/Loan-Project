import React, { useState, useEffect } from 'react';

function EMIPlan({ application, onUpdate }) {
  const [loanAmount, setLoanAmount] = useState(application?.requestedAmount || 100000);
  const [tenure, setTenure] = useState(application?.tenure || 12);
  const [customInterestRate, setCustomInterestRate] = useState('');
  const [selectedLoanType, setSelectedLoanType] = useState(application?.loanType || 'personal');
  const [emiDetails, setEmiDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const isApproved = application?.loanStatus === 'Approved';

  // Default tenures by loan type
  const defaultTenures = {
    personal: [6, 12, 24, 36, 48, 60],
    home: [60, 120, 180, 240, 300, 360],
    business: [12, 24, 36, 60, 84, 120],
    consultation: []
  };

  const tenureOptions = defaultTenures[selectedLoanType] || [12, 24, 36];

  // Default interest rates
  const defaultInterestRates = {
    personal: 12.5,
    home: 8.5,
    business: 11.0,
    consultation: 0
  };

  // Removed auto-calculation on load - user must click "Calculate EMI" button

  const calculateEMI = async () => {
    if (!loanAmount || loanAmount <= 0 || !tenure || tenure <= 0) {
      alert('Please enter valid loan amount and tenure');
      return;
    }

    setLoading(true);
    try {
      console.log('📊 Calculating EMI with:', {
        loanType: selectedLoanType,
        amount: loanAmount,
        tenure: tenure,
        customRate: customInterestRate
      });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/calculate-emi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanType: selectedLoanType,
          amount: Number(loanAmount),
          tenure: Number(tenure),
          customRate: customInterestRate ? Number(customInterestRate) : null
        })
      });

      const data = await response.json();
      console.log('📊 EMI calculation result:', data);

      if (data.success) {
        setEmiDetails(data.emiDetails);
      } else {
        alert('Error calculating EMI: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Error calculating EMI:', error);
      alert('Failed to calculate EMI. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = () => {
    calculateEMI();
  };

  const handleSaveChanges = async () => {
    if (!application) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/application/${application._id}/update`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestedAmount: loanAmount,
            tenure: tenure
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('✅ Loan details updated successfully!');
        if (onUpdate) onUpdate();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('⚠️ Failed to update. Please try again.');
    }
  };

  return (
    <div className="card border-0 mb-4" style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", overflow: "hidden" }}>
      <div className="card-header text-white p-4" style={{
        background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
        borderBottom: "none"
      }}>
        <h5 className="mb-0 fw-bold" style={{ fontSize: "1.3rem" }}>
          <i className="fas fa-calculator me-2" style={{ color: "#FFD700" }}></i>EMI Estimator
        </h5>
      </div>
      <div className="card-body p-4">
        {isApproved && (
          <div className="alert mb-3" style={{ background: "#d1fae5", border: "1px solid #10b981", borderRadius: "12px", color: "#065f46" }}>
            <i className="fas fa-check-circle me-2"></i>
            Your loan has been approved! Below are your final EMI details.
          </div>
        )}

        {!isApproved && (
          <div className="alert mb-3" style={{ background: "#dbeafe", border: "1px solid #3b82f6", borderRadius: "12px", color: "#1e40af" }}>
            <i className="fas fa-calculator me-2"></i>
            Use this calculator to check EMI for different loan amounts, tenures, and interest rates.
          </div>
        )}

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <label className="form-label fw-semibold mb-2" style={{ color: "#2C2C2C" }}>
              <i className="fas fa-briefcase me-2" style={{ color: "#FFD700" }}></i>Loan Type
            </label>
            <select
              className="form-control"
              value={selectedLoanType}
              onChange={(e) => {
                setSelectedLoanType(e.target.value);
                setCustomInterestRate('');
              }}
              disabled={isApproved}
              style={{ borderRadius: "12px", border: "2px solid #e9ecef", padding: "12px 15px" }}
            >
              <option value="personal">Personal Loan</option>
              <option value="home">Home Loan</option>
              <option value="business">Business Loan</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold mb-2" style={{ color: "#2C2C2C" }}>
              <i className="fas fa-rupee-sign me-2" style={{ color: "#FFD700" }}></i>Loan Amount (₹)
            </label>
            <input
              type="number"
              className="form-control"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              min="0"
              step="10000"
              disabled={isApproved}
              placeholder="Enter amount"
              style={{ borderRadius: "12px", border: "2px solid #e9ecef", padding: "12px 15px" }}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold mb-2" style={{ color: "#2C2C2C" }}>
              <i className="fas fa-calendar-alt me-2" style={{ color: "#FFD700" }}></i>Tenure (Months)
            </label>
            <select
              className="form-control"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              disabled={isApproved}
              style={{ borderRadius: "12px", border: "2px solid #e9ecef", padding: "12px 15px" }}
            >
              {tenureOptions.map(option => (
                <option key={option} value={option}>
                  {option} months ({Math.floor(option / 12)} years)
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold mb-2" style={{ color: "#2C2C2C" }}>
              <i className="fas fa-percentage me-2" style={{ color: "#FFD700" }}></i>Interest Rate (% p.a.)
              {!customInterestRate && <small className="text-muted d-block" style={{ fontSize: "0.85rem" }}>(Default: {defaultInterestRates[selectedLoanType]}%)</small>}
            </label>
            <input
              type="number"
              className="form-control"
              value={customInterestRate}
              onChange={(e) => setCustomInterestRate(e.target.value)}
              min="0"
              max="30"
              step="0.1"
              disabled={isApproved}
              placeholder={`Default: ${defaultInterestRates[selectedLoanType]}%`}
              style={{ borderRadius: "12px", border: "2px solid #e9ecef", padding: "12px 15px" }}
            />
          </div>
        </div>

        {!isApproved && (
          <div className="mb-4">
            <button
              className="btn btn-lg"
              onClick={handleRecalculate}
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                border: "none",
                borderRadius: "50px",
                padding: "14px 40px",
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
              {loading ? (
                <><i className="fas fa-spinner fa-spin me-2"></i>Calculating...</>
              ) : (
                <><i className="fas fa-calculator me-2"></i>Calculate EMI</>
              )}
            </button>
          </div>
        )}

        {emiDetails && (
          <div className="mt-4">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="text-center p-4" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: "16px", color: "white", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)" }}>
                  <i className="fas fa-money-bill-wave fa-2x mb-2" style={{ opacity: "0.9" }}></i>
                  <small className="d-block mb-2" style={{ opacity: "0.9" }}>Monthly EMI</small>
                  <h3 className="mb-0 fw-bold">₹{emiDetails.emi.toLocaleString('en-IN')}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-4" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", borderRadius: "16px", color: "white", boxShadow: "0 8px 20px rgba(79, 172, 254, 0.3)" }}>
                  <i className="fas fa-chart-line fa-2x mb-2" style={{ opacity: "0.9" }}></i>
                  <small className="d-block mb-2" style={{ opacity: "0.9" }}>Total Payment</small>
                  <h3 className="mb-0 fw-bold">₹{emiDetails.totalPayment.toLocaleString('en-IN')}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-4" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", borderRadius: "16px", color: "white", boxShadow: "0 8px 20px rgba(240, 147, 251, 0.3)" }}>
                  <i className="fas fa-percent fa-2x mb-2" style={{ opacity: "0.9" }}></i>
                  <small className="d-block mb-2" style={{ opacity: "0.9" }}>Total Interest</small>
                  <h3 className="mb-0 fw-bold">₹{emiDetails.totalInterest.toLocaleString('en-IN')}</h3>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3" style={{ background: "#dbeafe", borderRadius: "12px", borderLeft: "4px solid #3b82f6" }}>
              <i className="fas fa-info-circle me-2" style={{ color: "#3b82f6" }}></i>
              <small style={{ color: "#1e40af" }}>
                {isApproved 
                  ? 'This is your final EMI schedule. Monthly payment of ₹' + emiDetails.emi.toLocaleString('en-IN') + ' for ' + emiDetails.tenure + ' months.'
                  : 'You can try different loan amounts, tenures, and interest rates to find the best EMI plan for you. Use the calculator above to compare various options.'}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EMIPlan;
