import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import AdminGuard from "../guards/AdminRoute";
import AdminLayout from "./Layouts/AdminLayout";
import LandingPageAdmin from "./pages/LandingPageAdmin";
import AdminUserManagement from "./pages/AdminUserManagement";
import FooterAdmin from "./pages/FooterAdmin";
import ContactPage from "./pages/ContactAdmin";
import AboutUsAdmin from "./pages/AboutUsAdmin";
import FaqAdmin from "./pages/FaqAdmin";

const adminRouter = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <LandingPageAdmin /> },
      { path: "users", element: <AdminUserManagement /> },
      { path: "footer", element: <FooterAdmin /> },
      { path: "landing-page", element: <LandingPageAdmin /> },
      { path: "contact", element: <ContactPage /> },
      { path: "about-us", element: <AboutUsAdmin /> },
      { path: "faqs", element: <FaqAdmin /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/admin" replace />,
  },
]);

export default function AdminApp() {
  useEffect(() => {
    import("@tabler/core/dist/css/tabler.min.css");
    import("@tabler/core/dist/js/tabler.min.js");
  }, []);

  return (
    <AdminGuard>
      <RouterProvider router={adminRouter} />
    </AdminGuard>
  );
}
