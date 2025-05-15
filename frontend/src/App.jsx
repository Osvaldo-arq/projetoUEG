import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginForm from './presentation/components/LoginForm';
import RegisterForm from './presentation/components/RegisterForm';
import DashboardUser from './presentation/pages/DashboardUser';
import DashboardAdmin from './presentation/pages/DashboardAdmin';

/**
 * App Component:
 *
 * This is the main component of the application, setting up the routing and authentication.
 * It uses React Router to define the different pages and navigation guards.
 */
export default function App() {
  // Get user information from the authentication context.
  const { user } = useContext(AuthContext);
  const token = user?.token; // Get the authentication token.
  const role = user?.role;   // Get the user's role.

  // The BrowserRouter component enables the use of React Router's routing features.
  return (
    <BrowserRouter>
      {/* Define the routes for the application. */}
      <Routes>
        {/* Public routes (accessible without authentication). */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected routes (accessible only with authentication). */}
        <Route
          path="/admin/dashboard"
          element={
            // Only allow access if the user has a token and the role is 'ADMIN'.
            token && role === 'ADMIN' ? (
              <DashboardAdmin />
            ) : (
              // Otherwise, redirect to the login page.  The 'replace' prop
              //  replaces the current entry in the history stack, so the user
              //  can't go back to the protected page by pressing the back button.
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/user/dashboard"
          element={
            // Only allow access if the user has a token and the role is 'USER'.
            token && role === 'USER' ? (
              <DashboardUser />
            ) : (
              // Otherwise, redirect to the login page.
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect routes. */}
        <Route
          path="/"
          element={
            // If the user is authenticated (has a token), redirect them to
            //  their dashboard based on their role.  If not, redirect to login.
            token ? (
              <Navigate to={`/${role.toLowerCase()}/dashboard`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Catch-all route:  If the user tries to access a non-existent page,
            redirect them to the home page ("/"). */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
