// src/utils/api.js
// Helper function for making authenticated API calls with JWT token

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Make an authenticated API call
 * Automatically adds JWT token to Authorization header
 * 
 * @param {string} endpoint - API endpoint (e.g., "/api/dashboard/user/123")
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - Response data
 */
export const apiCall = async (endpoint, options = {}) => {
  // Get JWT token from localStorage
  const token = localStorage.getItem("token");

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Make the fetch request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Parse JSON response
  const data = await response.json();

  // If token is invalid or expired, redirect to login
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  // Return response data
  return { response, data };
};

/**
 * GET request helper
 */
export const apiGet = (endpoint) => {
  return apiCall(endpoint, { method: "GET" });
};

/**
 * POST request helper
 */
export const apiPost = (endpoint, body) => {
  return apiCall(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

/**
 * PUT request helper
 */
export const apiPut = (endpoint, body) => {
  return apiCall(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request helper
 */
export const apiDelete = (endpoint) => {
  return apiCall(endpoint, { method: "DELETE" });
};
