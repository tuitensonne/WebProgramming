import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token");

  return !isAuthenticated ? children : <Navigate to="/" replace />;
}
