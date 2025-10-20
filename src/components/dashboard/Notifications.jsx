import React from 'react';

function Notifications({ application, onMarkRead }) {
  const getNotificationIcon = (type) => {
    const icons = {
      success: 'fa-check-circle text-success',
      info: 'fa-info-circle text-info',
      warning: 'fa-exclamation-triangle text-warning',
      error: 'fa-times-circle text-danger'
    };
    return icons[type] || icons.info;
  };

  const handleMarkAllRead = async () => {
    if (!application) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/application/${application._id}/notifications/mark-read`,
        {
          method: 'PUT'
        }
      );

      const data = await response.json();
      if (data.success) {
        if (onMarkRead) onMarkRead();
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  if (!application) return null;

  const unreadCount = application.notifications?.filter(n => !n.read).length || 0;

  return (
    <div className="card border-0 mb-4" style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", overflow: "hidden" }}>
      <div className="card-header text-white p-4 d-flex justify-content-between align-items-center" style={{
        background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
        borderBottom: "none"
      }}>
        <h5 className="mb-0 fw-bold" style={{ fontSize: "1.3rem" }}>
          <i className="fas fa-bell me-2" style={{ color: "#FFD700" }}></i>Notifications
          {unreadCount > 0 && (
            <span className="badge ms-2" style={{
              background: "#ef4444",
              color: "white",
              borderRadius: "20px",
              padding: "4px 10px",
              fontSize: "0.8rem"
            }}>{unreadCount}</span>
          )}
        </h5>
        {unreadCount > 0 && (
          <button
            className="btn btn-sm"
            onClick={handleMarkAllRead}
            style={{
              background: "#FFD700",
              color: "#2C2C2C",
              border: "none",
              borderRadius: "20px",
              padding: "6px 15px",
              fontWeight: "600",
              fontSize: "0.85rem"
            }}
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="card-body p-4">
        {application.notifications && application.notifications.length > 0 ? (
          <div className="list-group">
            {application.notifications
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((notification, index) => (
                <div
                  key={index}
                  className="list-group-item border-0 mb-2"
                  style={{
                    backgroundColor: !notification.read ? '#fff8e1' : '#f8f9fa',
                    borderRadius: "12px",
                    borderLeft: !notification.read ? '4px solid #FFD700' : '4px solid transparent',
                    padding: "15px"
                  }}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <i className={`fas ${getNotificationIcon(notification.type)} me-2`}></i>
                      <span style={{ color: "#2C2C2C" }}>{notification.message}</span>
                      {!notification.read && (
                        <span className="badge ms-2" style={{
                          background: "#FFD700",
                          color: "#2C2C2C",
                          borderRadius: "12px",
                          padding: "3px 8px",
                          fontSize: "0.75rem",
                          fontWeight: "600"
                        }}>New</span>
                      )}
                    </div>
                    <small className="text-muted ms-3" style={{ whiteSpace: "nowrap" }}>
                      {new Date(notification.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-bell-slash fa-4x mb-3" style={{ color: "#FFD700", opacity: "0.5" }}></i>
            <p className="text-muted" style={{ fontSize: "1.1rem" }}>No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
