import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Your existing App.jsx
import './style.css';                 // Your existing CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
