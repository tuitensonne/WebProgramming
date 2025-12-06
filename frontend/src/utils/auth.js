export const authUtils = {
  // Lưu thông tin user sau khi login
  setAuth: (token, userRole, userData = {}) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userData", JSON.stringify(userData));
  },

  // Lấy thông tin user
  getAuth: () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    return { token, userRole, userData };
  },

  // Xóa thông tin khi logout
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
  },

  // Check có phải admin không
  isAdmin: () => {
    return localStorage.getItem("userRole") === "admin";
  },

  // Check đã login chưa
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Check role
  hasRole: (role) => {
    return localStorage.getItem("userRole") === role;
  },

  // Check nhiều roles
  hasAnyRole: (roles = []) => {
    const userRole = localStorage.getItem("userRole");
    return roles.includes(userRole);
  },

  // Navigate cross-app (hard reload để main.jsx render đúng app)
  navigateToApp: (path) => {
    window.location.href = path;
  },

  // Redirect về đúng app dựa trên role
  redirectByRole: () => {
    const userRole = localStorage.getItem("userRole");
    
    switch (userRole) {
      case "admin":
        window.location.href = "/admin";
        break;
      case "user":
        window.location.href = "/";
        break;
      default:
        window.location.href = "/";
    }
  }
};