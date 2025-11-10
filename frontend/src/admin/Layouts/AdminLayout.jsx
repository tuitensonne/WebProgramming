import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="page" style={{ display: "flex" }}>
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <div
                className="page-wrapper"
                style={{
                    flexGrow: 1,
                    transition: "margin-left 0.3s",
                    marginLeft: sidebarOpen ? 240 : 0, // Đẩy sang phải khi sidebar mở
                }}
            >
                <AdminHeader />
                <div className="page-body container-xl">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
