// protectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuthentication } from './auth';

const ProtectedRoute = ({ element }) => {
  // Check if the user is authenticated
  const isAuthenticated = checkAuthentication();

  // If not authenticated, redirect to the login page
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
