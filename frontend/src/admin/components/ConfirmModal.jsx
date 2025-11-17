import React from "react";
import { IconX } from "@tabler/icons-react";

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onCancel}
    >
      <div 
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || "Xác nhận"}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onCancel}
              aria-label="Close"
            />
          </div>
          
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}