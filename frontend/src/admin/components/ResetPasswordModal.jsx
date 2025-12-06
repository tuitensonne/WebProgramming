import React, { useState } from "react";
// import api from "../../api/api";

const ResetPasswordModal = ({
    show,
    onClose,
    userId,
    userName,
    showToast,
    api,
    refetchUsers,
}) => {
    const [newPassword, setNewPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (newPassword.length < 6) {
            showToast("Mật khẩu mới phải có ít nhất 6 ký tự.", "danger");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await api.put(`/admin/users/${userId}/reset-password`, {
                newPassword: newPassword,
            });

            if (res.data?.success) {
                onClose();
                showToast(
                    res.data.message ||
                        `Đã đặt lại mật khẩu cho ${userName} thành công!`,
                    "success"
                );
                if (refetchUsers) {
                    refetchUsers();
                }
            } else {
                showToast(
                    res.data?.message || "Đặt lại mật khẩu thất bại.",
                    "danger"
                );
            }
        } catch (error) {
            console.error("API Error during password reset:", error);
            showToast("Lỗi kết nối server hoặc xác thực thất bại.", "danger");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal modal-blur fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-sm" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Đặt lại Mật khẩu</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                            disabled={isSubmitting}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>Xác nhận đặt lại mật khẩu cho **{userName}**.</p>
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu mới</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn me-auto"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting || newPassword.length < 6}
                        >
                            {isSubmitting
                                ? "Đang xử lý..."
                                : "Xác nhận Đặt lại"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
