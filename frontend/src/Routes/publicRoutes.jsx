import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("medicineToken"); // or use context if token is stored there

  return token ? <Navigate to="/" /> : <Navigate to="/login" />; // Redirect to homepage if token exists
};

export default PublicRoute;
