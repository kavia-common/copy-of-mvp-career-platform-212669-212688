import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/api";

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children }) {
  /** Guards children by requiring a JWT token; redirects to /login if absent. */
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
