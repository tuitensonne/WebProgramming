// src/admin/AdminApp.jsx
import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout";
import LandingPageAdmin from "./pages/LandingPageAdmin";

const adminRouter = createBrowserRouter(
  [
    {
      path: "",
      element: <AdminLayout />,
      children: [
        { index: true, element: <LandingPageAdmin /> }
      ],
    },
  ],
  { basename: "/admin" }
);


export default function AdminApp() {
  useEffect(() => {
    import("@tabler/core/dist/css/tabler.min.css");
    import("@tabler/core/dist/js/tabler.min.js");
  }, []);

  return <RouterProvider router={adminRouter} />;
}
