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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('📎 File selected:', file.name, 'Size:', file.size, 'bytes');
    }
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

    setUploading(true);
    try {
      // In a real application, you would upload the file to cloud storage (AWS S3, Cloudinary, etc.)
      // For now, we're just storing the file name and metadata
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/application/${application._id}/document`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType,
            fileName: selectedFile.name,
            fileUrl: '#' + selectedFile.name // Placeholder - in production, this would be the cloud storage URL
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('✅ Document uploaded successfully!');
        setDocumentType('');
        setSelectedFile(null);
        // Reset file input
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

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/application/${application._id}/document/${docId}`,
        {
          method: 'DELETE'
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
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0"><i className="fas fa-file-upload me-2"></i>Document Upload</h5>
      </div>
      <div className="card-body">
        {isReadOnly && (
          <div className="alert alert-warning mb-3">
            <i className="fas fa-lock me-2"></i>
            Document upload is disabled. Application has been {application.loanStatus.toLowerCase()}.
          </div>
        )}

        {!isReadOnly && (
          <form onSubmit={handleUpload} className="mb-4">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-bold">Document Type</label>
                <select
                  className="form-control"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Select File</label>
                <input
                  type="file"
                  id="fileInput"
                  className="form-control"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  required
                />
                <small className="text-muted">
                  Accepted: PDF, JPG, PNG, DOC (Max 5MB)
                </small>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={uploading}
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

        <h6 className="mb-3">Uploaded Documents</h6>
        {application.documents && application.documents.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Document Type</th>
                  <th>File Name</th>
                  <th>Upload Date</th>
                  {!isReadOnly && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {application.documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <i className="fas fa-file-alt me-2 text-primary"></i>
                      {doc.documentType}
                    </td>
                    <td>{doc.fileName}</td>
                    <td>
                      {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    {!isReadOnly && (
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(doc._id)}
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
          <div className="text-center text-muted py-4">
            <i className="fas fa-folder-open fa-3x mb-3"></i>
            <p>No documents uploaded yet.</p>
          </div>
        )}

        <div className="mt-3 p-3 bg-light rounded">
          <small className="text-muted">
            <i className="fas fa-info-circle me-2"></i>
            <strong>Required Documents:</strong> Payslip (last 3 months), ID Proof (Aadhaar/PAN), 
            Bank Statement (last 6 months), Address Proof
          </small>
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;
