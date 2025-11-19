import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

import AlertNotification from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";

export const UIContext = createContext();

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const [confirm, setConfirm] = useState({
        show: false,
        title: "",
        message: "",
        onConfirm: null,
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type });
        }, 3500);
    };

    const showConfirm = (message, onConfirm, title = "Xác nhận hành động") => {
        setConfirm({ show: true, title, message, onConfirm });
    };

    const handleConfirm = () => {
        const fn = confirm.onConfirm;
        setConfirm({ show: false, title: "", message: "", onConfirm: null });
        if (fn) fn();
    };

    const handleCancel = () => {
        setConfirm({ show: false, title: "", message: "", onConfirm: null });
    };

    return (
        <UIContext.Provider value={{ showToast, showConfirm }}>
            <div className="page" style={{ display: "flex" }}>
                <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

                <div
                    className="page-wrapper"
                    style={{
                        flexGrow: 1,
                        transition: "margin-left 0.3s",
                        marginLeft: sidebarOpen ? 240 : 0,
                    }}
                >
                    <AdminHeader />

                    <div className="page-body container-xl">
                        <Outlet />
                    </div>
                </div>
                <AlertNotification {...toast} />
                <ConfirmModal
                    show={confirm.show}
                    title={confirm.title}
                    message={confirm.message}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            </div>
        </UIContext.Provider>
    );
}
