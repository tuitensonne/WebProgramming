import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "./Layouts/AdminLayout";
import LandingPageAdmin from "./pages/LandingPageAdmin";

import AdminUserManagement from "./pages/AdminUserManagement";
import FooterAdmin from "./pages/FooterAdmin";

const adminRouter = createBrowserRouter([
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { index: true, element: <LandingPageAdmin /> },
            { path: "users", element: <AdminUserManagement /> },
            { path: "footer", element: <FooterAdmin /> },
            { path: "landing-page", element: <LandingPageAdmin /> },
        ],
    },
]);

export default function AdminApp() {
    useEffect(() => {
        import("@tabler/core/dist/css/tabler.min.css");
        import("@tabler/core/dist/js/tabler.min.js");
    }, []);

    return <RouterProvider router={adminRouter} />;
}
