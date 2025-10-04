import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/loans`)
      .then((res) => res.json())
      .then((data) => {
        setLoans(data);
        setStats({
          total: data.length,
          pending: data.filter((l) => l.status === "Pending").length,
          approved: data.filter((l) => l.status === "Approved").length,
          rejected: data.filter((l) => l.status === "Rejected").length,
        });
      })
      .catch((err) => console.error("Load loans failed", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ flex: 1, padding: "1rem", backgroundColor: "#fffbe6", borderRadius: "10px" }}>
          <h3>Total Applications</h3>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{stats.total}</p>
        </div>
        <div style={{ flex: 1, padding: "1rem", backgroundColor: "#fff4e6", borderRadius: "10px" }}>
          <h3>Pending</h3>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{stats.pending}</p>
        </div>
        <div style={{ flex: 1, padding: "1rem", backgroundColor: "#e6f7e6", borderRadius: "10px" }}>
          <h3>Approved</h3>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{stats.approved}</p>
        </div>
        <div style={{ flex: 1, padding: "1rem", backgroundColor: "#ffe6e6", borderRadius: "10px" }}>
          <h3>Rejected</h3>
          <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{stats.rejected}</p>
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Loan Type</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Submitted At</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{loan.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{loan.email}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{loan.loanType}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{loan.amount || "-"}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Date(loan.createdAt || loan.submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{loan.status || "Pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
