import { Navigate } from "react-router-dom";
import { authUtils } from "../utils/auth";

export default function PublicRoute({ children, restricted = false }) {
  const { token, userRole } = authUtils.getAuth();

  // Nếu đã login và route bị restricted (như login/signup page)
  if (token && restricted) {
    // Hard redirect về app tương ứng với role
    if (userRole === "admin") {
      authUtils.navigateToApp("/admin");
      return null;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
