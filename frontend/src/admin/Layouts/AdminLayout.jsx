import React, { useState, createContext } from "react";
// import Header from "../components/Header";
import AlertNotification from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import { Outlet } from "react-router-dom";
import Header
 from "../components/Header";
export const UIContext = createContext();

export default function AdminLayout() {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirm, setConfirm] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3500);
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
      <div className="page">
        <Header />
        <div className="page-wrapper">
          <div className="page-body container-xl mt-3">
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
