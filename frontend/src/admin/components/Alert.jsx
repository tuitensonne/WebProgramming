import React, { useEffect, useState } from "react";

export default function AlertNotification({
  show,
  message,
  type = "success",
  onClose,
}) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!visible) return null;

  const alertType =
    type === "success"
      ? "alert alert-important alert-success"
      : "alert alert-important alert-danger";

  return (
    <div
      className={alertType}
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 2000,
        minWidth: "250px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>{message}</div>
        <button
          type="button"
          className="btn btn-clear btn-close"
          onClick={() => setVisible(false)}
        />
      </div>
    </div>
  );
}
