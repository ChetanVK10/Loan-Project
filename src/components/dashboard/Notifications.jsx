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
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="fas fa-bell me-2"></i>Notifications & Updates
          {unreadCount > 0 && (
            <span className="badge bg-danger ms-2">{unreadCount}</span>
          )}
        </h5>
        {unreadCount > 0 && (
          <button
            className="btn btn-sm btn-dark"
            onClick={handleMarkAllRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="card-body">
        {application.notifications && application.notifications.length > 0 ? (
          <div className="list-group">
            {application.notifications
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((notification, index) => (
                <div
                  key={index}
                  className={`list-group-item ${!notification.read ? 'border-start border-primary border-4' : ''}`}
                  style={{ backgroundColor: !notification.read ? '#f8f9fa' : 'white' }}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <i className={`fas ${getNotificationIcon(notification.type)} me-2`}></i>
                      {notification.message}
                      {!notification.read && (
                        <span className="badge bg-primary ms-2">New</span>
                      )}
                    </div>
                    <small className="text-muted ms-3">
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
          <div className="text-center text-muted py-4">
            <i className="fas fa-bell-slash fa-3x mb-3"></i>
            <p>No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
