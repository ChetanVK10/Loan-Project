import React, { useState } from 'react';

function DocumentUpload({ application, onUpdate }) {
  const [documentType, setDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isReadOnly = application?.loanStatus === 'Approved' || application?.loanStatus === 'Rejected';

  const documentTypes = [
    'Payslip',
    'ID Proof',
    'Bank Statement',
    'Address Proof',
    'Other'
  ];
///file size
  const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 1️⃣ File size check (5MB max)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    alert("File size must be under 5MB");
    e.target.value = "";
    return;
  }

  // 2️⃣ File type check (extra safety)
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Invalid file type. Please upload PDF, JPG, PNG, or DOC.");
    e.target.value = "";
    return;
  }

  // 3️⃣ All good
  setSelectedFile(file);
  console.log('📎 File selected:', file.name, 'Size:', file.size, 'bytes');
};


  const handleUpload = async (e) => {
  e.preventDefault();

  if (!documentType) {
    alert('Please select a document type');
    return;
  }

  if (!selectedFile) {
    alert('Please select a file to upload');
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Authentication error. Please login again.");
    return;
  }

  setUploading(true);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/application/${application._id}/document`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`   // ✅ THIS WAS MISSING
        },
        body: JSON.stringify({
          documentType,
          fileName: selectedFile.name,
          fileUrl: '#' + selectedFile.name
        })
      }
    );

    const data = await response.json();

    if (data.success) {
      alert('✅ Document uploaded successfully!');
      setDocumentType('');
      setSelectedFile(null);
      document.getElementById('fileInput').value = '';
      if (onUpdate) onUpdate();
    } else {
      alert(`❌ Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    alert('⚠️ Failed to upload. Please try again.');
  } finally {
    setUploading(false);
  }
};


  const handleDelete = async (docId) => {
  if (!confirm('Are you sure you want to delete this document?')) return;

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Authentication error. Please login again.");
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/application/${application._id}/document/${docId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`   // ✅ REQUIRED
        }
      }
    );

    const data = await response.json();

    if (data.success) {
      alert('✅ Document deleted successfully!');
      if (onUpdate) onUpdate();
    } else {
      alert(`❌ Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    alert('⚠️ Failed to delete. Please try again.');
  }
};


  if (!application) return null;

  return (
    <div className="card border-0 mb-4" style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", overflow: "hidden" }}>
      <div className="card-header text-white p-4" style={{
        background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
        borderBottom: "none"
      }}>
        <h5 className="mb-0 fw-bold" style={{ fontSize: "1.3rem" }}>
          <i className="fas fa-file-upload me-2" style={{ color: "#FFD700" }}></i>Document Upload
        </h5>
      </div>
      <div className="card-body p-4">
        {isReadOnly && (
          <div className="alert mb-3" style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "12px", color: "#856404" }}>
            <i className="fas fa-lock me-2"></i>
            Document upload is disabled. Application has been {application.loanStatus.toLowerCase()}.
          </div>
        )}

        {!isReadOnly && (
          <form onSubmit={handleUpload} className="mb-4">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-semibold mb-2" style={{ color: "#2C2C2C" }}>
                  <i className="fas fa-tag me-2" style={{ color: "#FFD700" }}></i>Document Type
                </label>
                <select
                  className="form-select"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  required
                  style={{ borderRadius: "12px", border: "2px solid #e9ecef", padding: "12px 15px" }}
                >
                  <option value="">Select type</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold mb-2" style={{ color: "#2C2C2C" }}>
                  <i className="fas fa-file me-2" style={{ color: "#FFD700" }}></i>Select File
                </label>
                <div className="position-relative">
  <input
    type="file"
    id="fileInput"
    className="form-control"
    onChange={handleFileSelect}
    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
    required
    style={{
      borderRadius: "12px",
      border: "2px solid #e9ecef",
      padding: "12px 40px 12px 15px"
    }}
  />

  {/* ❌ Clear selected file */}
  {selectedFile && (
    <button
      type="button"
      onClick={() => {
        setSelectedFile(null);
        document.getElementById("fileInput").value = "";
      }}
      className="btn btn-sm position-absolute"
      style={{
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        borderRadius: "50%",
        background: "#dc3545",
        color: "white",
        width: "26px",
        height: "26px",
        padding: "0",
        lineHeight: "1"
      }}
      title="Remove selected file"
    >
      ×
    </button>
  )}
</div>

                <small className="text-muted">
                  Accepted: PDF, JPG, PNG, DOC (Max 5MB)
                </small>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn w-100"
                  disabled={uploading}
                  style={{
                    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                    border: "none",
                    borderRadius: "50px",
                    padding: "12px 20px",
                    fontWeight: "600",
                    color: "#2C2C2C",
                    boxShadow: "0 5px 15px rgba(255, 215, 0, 0.3)"
                  }}
                >
                  {uploading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload me-2"></i>Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        <h6 className="mb-3 fw-bold" style={{ color: "#2C2C2C" }}>
          <i className="fas fa-folder-open me-2" style={{ color: "#FFD700" }}></i>Uploaded Documents
        </h6>
        {application.documents && application.documents.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover" style={{ fontSize: "0.95rem" }}>
              <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
                <tr>
                  <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>Document Type</th>
                  <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>File Name</th>
                  <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>Upload Date</th>
                  {!isReadOnly && <th className="py-3 fw-semibold" style={{ color: "#2C2C2C" }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {application.documents.map((doc) => (
                  <tr key={doc._id} style={{ borderBottom: "1px solid #f1f3f5" }}>
                    <td className="py-3">
                      <i className="fas fa-file-alt me-2" style={{ color: "#667eea" }}></i>
                      <strong style={{ color: "#2C2C2C" }}>{doc.documentType}</strong>
                    </td>
                    <td className="py-3">{doc.fileName}</td>
                    <td className="py-3">
                      <small>
                        {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </small>
                    </td>
                    {!isReadOnly && (
                      <td className="py-3">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(doc._id)}
                          style={{ borderRadius: "8px", padding: "6px 12px" }}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-folder-open fa-4x mb-3" style={{ color: "#FFD700", opacity: "0.5" }}></i>
            <p className="text-muted" style={{ fontSize: "1.1rem" }}>No documents uploaded yet.</p>
          </div>
        )}

        <div className="mt-4 p-3" style={{ background: "#dbeafe", borderRadius: "12px", borderLeft: "4px solid #3b82f6" }}>
          <small style={{ color: "#1e40af" }}>
            <i className="fas fa-info-circle me-2" style={{ color: "#3b82f6" }}></i>
            <strong>Required Documents:</strong> Payslip (last 3 months), ID Proof (Aadhaar/PAN), 
            Bank Statement (last 6 months), Address Proof
          </small>
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;
