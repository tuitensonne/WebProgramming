import { Navigate } from "react-router-dom";
import { authUtils } from "../utils/auth";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { token, userRole } = authUtils.getAuth();

  // Chưa login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Đã login nhưng không có quyền truy cập
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Hard redirect về app phù hợp với role
    if (userRole === "admin") {
      authUtils.navigateToApp("/admin");
      return null; // Prevent render during redirect
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
