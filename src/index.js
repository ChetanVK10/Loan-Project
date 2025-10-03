// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import Bootstrap CSS (grid, buttons, forms)
import "bootstrap/dist/css/bootstrap.min.css";

// Import custom styles
import "./style.css";

// Attach React to the root div in public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
