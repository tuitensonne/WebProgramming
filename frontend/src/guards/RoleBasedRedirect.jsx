import { Navigate } from "react-router-dom";

export default function RoleBasedRedirect() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect dựa trên role
  switch (userRole) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "user":
      return <Navigate to="/dashboard" replace />;
    case "moderator":
      return <Navigate to="/moderator" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
