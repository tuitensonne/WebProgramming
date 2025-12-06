import { useEffect, useState } from "react";
import { authUtils } from "../utils/auth";

export default function AdminGuard({ children }) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const { token, userRole } = authUtils.getAuth();

    if (!token) {
      authUtils.navigateToApp("/login");
    } else if (userRole !== "admin") {
      authUtils.navigateToApp("/");
    } else {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return <div>Loading...</div>; // Hoặc loading spinner
  }

  return children;
}
