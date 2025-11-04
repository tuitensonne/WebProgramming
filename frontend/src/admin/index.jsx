import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@tabler/core/dist/css/tabler.min.css";
import "@tabler/core/dist/js/tabler.min.js";

import AdminLayout from "../Layouts/AdminLayout";
import LandingPageAdmin from "../pages/LandingPage/admin/LandingPageAdmin";

const adminRouter = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <LandingPageAdmin /> }, // ✅ dùng `index: true` thay cho path: ""
    ],
  },
]);

export default function AdminApp() {
  return <RouterProvider router={adminRouter} />;
}
