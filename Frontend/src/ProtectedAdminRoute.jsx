import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const isAuthenticated =
    sessionStorage.getItem("adminAuthenticated") === "true";

  // If not logged in as provider/developer,
  // redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Only authenticated provider/developer can see admin pages
  return <Outlet />;
};

export default ProtectedAdminRoute;
