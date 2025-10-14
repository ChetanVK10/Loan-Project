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
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">
          <i className="fas fa-calculator me-2"></i>EMI Estimator
        </h5>
      </div>
      <div className="card-body">
        {isApproved && (
          <div className="alert alert-success mb-3">
            <i className="fas fa-check-circle me-2"></i>
            Your loan has been approved! Below are your final EMI details.
          </div>
        )}

        {!isApproved && (
          <div className="alert alert-info mb-3">
            <i className="fas fa-calculator me-2"></i>
            Use this calculator to check EMI for different loan amounts, tenures, and interest rates.
          </div>
        )}

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <label className="form-label fw-bold">Loan Type</label>
            <select
              className="form-control"
              value={selectedLoanType}
              onChange={(e) => {
                setSelectedLoanType(e.target.value);
                setCustomInterestRate('');
              }}
              disabled={isApproved}
            >
              <option value="personal">Personal Loan</option>
              <option value="home">Home Loan</option>
              <option value="business">Business Loan</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Loan Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              min="0"
              step="10000"
              disabled={isApproved}
              placeholder="Enter amount"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Tenure (Months)</label>
            <select
              className="form-control"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              disabled={isApproved}
            >
              {tenureOptions.map(option => (
                <option key={option} value={option}>
                  {option} months ({Math.floor(option / 12)} years)
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">
              Interest Rate (% p.a.)
              {!customInterestRate && <small className="text-muted"> (Default: {defaultInterestRates[selectedLoanType]}%)</small>}
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
            />
          </div>
        </div>

        {!isApproved && (
          <div className="mb-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleRecalculate}
              disabled={loading}
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
                <div className="text-center p-3 border rounded bg-light">
                  <small className="text-muted">Monthly EMI</small>
                  <h4 className="mb-0 text-success mt-2">₹{emiDetails.emi.toLocaleString('en-IN')}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-3 border rounded bg-light">
                  <small className="text-muted">Total Payment</small>
                  <h4 className="mb-0 text-primary mt-2">₹{emiDetails.totalPayment.toLocaleString('en-IN')}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-3 border rounded bg-light">
                  <small className="text-muted">Total Interest</small>
                  <h4 className="mb-0 text-danger mt-2">₹{emiDetails.totalInterest.toLocaleString('en-IN')}</h4>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
              <i className="fas fa-info-circle me-2 text-info"></i>
              <small>
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
