import React, { useEffect, useRef } from "react";
import { Toast } from "bootstrap"; // ⭐ IMPORT TRỰC TIẾP
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function ToastNotification({ show, message, type = "success" }) {
  const toastRef = useRef(null);

  useEffect(() => {
    if (show && toastRef.current) {
      const toast = new Toast(toastRef.current, { delay: 3000 });
      toast.show();
    }
  }, [show]);

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 2000 }}
    >
      <div
        ref={toastRef}
        className={`toast text-bg-${type} border-0`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
          ></button>
        </div>
      </div>
    </div>
  );
}
