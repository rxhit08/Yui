import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';
import './index.css';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        limit={1}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme="colored"
      />
  </StrictMode>
);
