import React, { useState, createContext, useMemo, useCallback } from "react";
import { Outlet } from "react-router-dom";
import AlertNotification from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";

export const UIContext = createContext();

export default function AdminLayout() {
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

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3500);
  }, []);

  const showConfirm = useCallback(
    (message, onConfirm, title = "Xác nhận hành động") => {
      setConfirm({ show: true, title, message, onConfirm });
    },
    []
  );

  const handleConfirm = () => {
    if (confirm.onConfirm) confirm.onConfirm();
    setConfirm({ show: false, title: "", message: "", onConfirm: null });
  };

  const handleCancel = () =>
    setConfirm({ show: false, title: "", message: "", onConfirm: null });

  const contextValue = useMemo(
    () => ({ showToast, showConfirm }),
    [showToast, showConfirm]
  );

  return (
    <UIContext.Provider value={contextValue}>
      <div className="page d-flex">
        <Header />
        <div className="page-wrapper flex-grow-1">
          <div className="page-body">
            <div className="container-xl">
              <Outlet />
            </div>
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
