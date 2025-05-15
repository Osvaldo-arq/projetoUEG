import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Get a reference to the root DOM node where the React application will be mounted.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the React application into the root DOM node.
root.render(
  // React.StrictMode is a tool for highlighting potential problems in your application.
  //  It helps you spot common bugs in your components early in development.
  <React.StrictMode>
    {/* AuthProvider is a component that provides authentication context to the application.
        Any component within AuthProvider can access the authentication data and functions. */}
    <AuthProvider>
      {/* The main App component, which contains the application's logic and UI. */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);