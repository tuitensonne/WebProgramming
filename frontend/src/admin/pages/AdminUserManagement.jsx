import React, { useState, useEffect, useMemo, useContext } from "react";
import ResetPasswordModal from "../components/ResetPasswordModal";
import LoadingComponent from "../components/LoadingComponent";
import { UIContext } from "../Layouts/AdminLayout";
import api from "../../api/api";
import {
    IconEdit,
    IconCheck,
    IconX,
    IconSearch,
    IconLock,
    IconLockOpen,
    IconKey,
    IconChevronLeft,
    IconChevronRight,
    IconArrowsSort,
    IconUser,
    IconChevronUp,
    IconChevronDown,
    IconFilter,
    IconPlus,
} from "@tabler/icons-react";

const ITEMS_PER_PAGE = 10;

const getSortIcon = (key, sortConfig) => {
    const defaultIcon = (
        <IconArrowsSort size={16} className="ms-1 text-muted" />
    );

    if (sortConfig.key !== key) {
        return defaultIcon;
    }

    return sortConfig.direction === "asc" ? (
        <IconChevronUp size={16} className="ms-1" />
    ) : (
        <IconChevronDown size={16} className="ms-1" />
    );
};

const AddUserModal = ({ show, onClose, fetchUsers }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useContext(UIContext);

    useEffect(() => {
        if (show) {
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                password: "",
            });
        }
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { fullName, email, password } = formData;

        if (!fullName || !email || !password || password.length < 6) {
            showToast(
                "Vui lòng điền đủ Tên, Email và Mật khẩu (tối thiểu 6 ký tự).",
                "danger"
            );
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post("/auth/signup", formData);

            if (res.data?.success) {
                showToast("Thêm tài khoản thành công!", "success");
                fetchUsers();
                onClose();
            } else {
                showToast(
                    res.data?.message || "Thêm tài khoản thất bại.",
                    "danger"
                );
            }
        } catch (error) {
            if (error.response?.status === 409) {
                showToast("Email đã tồn tại.", "danger");
            } else {
                showToast("Lỗi kết nối server khi tạo tài khoản.", "danger");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!show) return null;

    return (
        <div
            className="modal modal-blur fade show"
            style={{ display: "block" }}
            tabIndex="-1"
        >
            <div
                className="modal-dialog modal-md modal-dialog-centered"
                role="document"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Người dùng mới</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label required">
                                Họ Tên
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={submitting}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label required">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={submitting}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                type="text"
                                className="form-control"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={submitting}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label required">
                                Mật khẩu (Tối thiểu 6 ký tự)
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={submitting}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-link link-secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <IconPlus size={18} className="me-1" />
                                    Tạo tài khoản
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({
        key: "id",
        direction: "asc",
    });
    const [resetModalUser, setResetModalUser] = useState(null);
    const { showToast } = useContext(UIContext);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingData, setEditingData] = useState({});
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const handleSearchSubmit = () => {
        if (submittedSearchQuery !== searchQuery) {
            setSubmittedSearchQuery(searchQuery);
            setCurrentPage(1);
        }
    };
    const fetchUsers = async () => {
        setLoading(true);
        const params = {
            search: submittedSearchQuery,
            activeFilter: activeFilter,
            sortKey: sortConfig.key,
            sortDirection: sortConfig.direction,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
        };

        try {
            const res = await api.get("admin/users", { params });

            if (res.data?.success && res.data.data?.items) {
                setUsers(res.data.data.items);
                setTotalUsers(res.data.data.totalCount || 0);
                if (
                    res.data.data.items.length === 0 &&
                    res.data.data.totalCount > 0 &&
                    currentPage > 1
                ) {
                    setCurrentPage(1);
                }
            } else {
                setUsers([]);
                setTotalUsers(0);
            }
        } catch (error) {
            showToast("Lỗi kết nối server khi tải dữ liệu.", "danger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [
        activeFilter,
        submittedSearchQuery,
        sortConfig.key,
        sortConfig.direction,
        currentPage,
    ]);

    const handleFilterChange = (status) => {
        setActiveFilter(status);
        setCurrentPage(1);
        setDropdownOpen(false);
    };

    const requestSort = (key) => {
        let direction =
            sortConfig.key === key && sortConfig.direction === "asc"
                ? "desc"
                : "asc";
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handleToggleActive = async (userId) => {
        const userToUpdate = users.find((u) => u.id === userId);
        const newState = !userToUpdate.isActive;
        const action = newState ? "Mở khóa" : "Khóa";

        try {
            setIsSaving(true);

            const res = await api.put(`/admin/users/${userId}/status`, {
                isActive: newState,
            });

            if (res.data?.success) {
                showToast(res.data.message, "success");
                await fetchUsers();
            } else {
                showToast(
                    res.data?.message || `${action} tài khoản thất bại.`,
                    "danger"
                );
            }
        } catch (error) {
            console.error("API Error:", error);
            showToast(`Lỗi: ${action} tài khoản thất bại (server).`, "danger");
        } finally {
            setIsSaving(false);
        }
    };
    const handleEditStart = (user) => {
        setEditingUserId(user.id);
        setEditingData({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
        });
    };

    const handleEditCancel = () => {
        setEditingUserId(null);
        setEditingData({});
    };

    const handleEditDataChange = (name, value) => {
        setEditingData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        const userId = editingUserId;
        if (!editingData.fullName || !editingData.email) {
            showToast("Tên và Email là bắt buộc.", "danger");
            return;
        }

        try {
            setIsSaving(true);

            const res = await api.put(`/admin/users/${userId}`, editingData);

            if (res.data?.success) {
                showToast(
                    res.data.message || `Cập nhật thông tin thành công!`,
                    "success"
                );
                setEditingUserId(null);
                await fetchUsers();
            } else {
                showToast(
                    res.data?.message || "Cập nhật thông tin thất bại.",
                    "danger"
                );
            }
        } catch (error) {
            console.error("API Error during edit save:", error);
            showToast("Lỗi kết nối server khi lưu.", "danger");
        } finally {
            setIsSaving(false);
        }
    };

    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = users;

    const currentStatusText =
        activeFilter === "all"
            ? "Tất cả Trạng thái"
            : activeFilter === "active"
            ? "Active"
            : "Inactive";

    const isActionDisabled = isSaving || loading;

    if (loading && users.length === 0) {
        return <LoadingComponent />;
    }

    return (
        <div className="page-wrapper">
            <div className="container-xl">
                <div className="page-header d-print-none">
                    <div className="row align-items-center">
                        <div className="col">
                            <h2 className="page-title">
                                Quản lý Khách hàng (Users)
                            </h2>
                        </div>
                        <div className="col-auto ms-auto d-print-none">
                            <button
                                className="btn btn-primary d-flex align-items-center"
                                onClick={() => setShowAddUserModal(true)}
                                disabled={isActionDisabled}
                            >
                                <IconPlus size={18} className="me-1" />
                                Thêm Người dùng
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                Danh sách Khách hàng ({totalUsers} users)
                            </h3>
                        </div>

                        <div className="card-body border-bottom py-3">
                            <div className="d-flex flex-column flex-md-row justify-content-start gap-3">
                                <div className="input-group w-100 w-md-auto me-md-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm kiếm theo Tên/Email/SĐT..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                handleSearchSubmit();
                                        }}
                                        disabled={loading}
                                    />
                                    <button
                                        className="btn btn-icon btn-primary"
                                        onClick={handleSearchSubmit}
                                        disabled={loading}
                                        title="Tìm kiếm"
                                    >
                                        <IconSearch size={20} />
                                    </button>
                                </div>

                                <div className="dropdown w-100 w-md-auto">
                                    <button
                                        className={`btn dropdown-toggle w-100 ${
                                            activeFilter !== "all"
                                                ? "btn-outline-primary"
                                                : "btn-outline-secondary"
                                        }`}
                                        type="button"
                                        onClick={() =>
                                            setDropdownOpen(!dropdownOpen)
                                        }
                                        aria-expanded={dropdownOpen}
                                        disabled={loading}
                                    >
                                        {currentStatusText}
                                    </button>
                                    <div
                                        className={`dropdown-menu ${
                                            dropdownOpen ? "show" : ""
                                        }`}
                                        style={{
                                            minWidth: "100%",
                                            maxWidth: "300px",
                                        }}
                                    >
                                        <a
                                            className={`dropdown-item ${
                                                activeFilter === "all"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleFilterChange("all");
                                            }}
                                        >
                                            Tất cả Trạng thái
                                        </a>
                                        <a
                                            className={`dropdown-item ${
                                                activeFilter === "active"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleFilterChange("active");
                                            }}
                                        >
                                            Active
                                        </a>
                                        <a
                                            className={`dropdown-item ${
                                                activeFilter === "inactive"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleFilterChange("inactive");
                                            }}
                                        >
                                            Inactive
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table card-table table-vcenter text-nowrap datatable table-hover">
                                <thead>
                                    <tr>
                                        <th
                                            className="w-1 cursor-pointer"
                                            onClick={() => requestSort("id")}
                                        >
                                            ID {getSortIcon("id", sortConfig)}
                                        </th>
                                        <th>Avatar</th>
                                        <th
                                            className="cursor-pointer"
                                            onClick={() =>
                                                requestSort("fullName")
                                            }
                                        >
                                            Họ Tên{" "}
                                            {getSortIcon(
                                                "fullName",
                                                sortConfig
                                            )}
                                        </th>
                                        <th
                                            className="cursor-pointer"
                                            onClick={() => requestSort("email")}
                                        >
                                            Email{" "}
                                            {getSortIcon("email", sortConfig)}
                                        </th>
                                        <th>Phone</th>

                                        <th
                                            className="d-none d-lg-table-cell cursor-pointer"
                                            onClick={() =>
                                                requestSort("createdAt")
                                            }
                                        >
                                            Ngày tạo{" "}
                                            {getSortIcon(
                                                "createdAt",
                                                sortConfig
                                            )}
                                        </th>

                                        <th
                                            className="d-none d-lg-table-cell cursor-pointer"
                                            onClick={() =>
                                                requestSort("updatedAt")
                                            }
                                        >
                                            Cập nhật cuối{" "}
                                            {getSortIcon(
                                                "updatedAt",
                                                sortConfig
                                            )}
                                        </th>

                                        <th
                                            className="cursor-pointer"
                                            onClick={() =>
                                                requestSort("isActive")
                                            }
                                        >
                                            Trạng thái{" "}
                                            {getSortIcon(
                                                "isActive",
                                                sortConfig
                                            )}
                                        </th>

                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map((user) => {
                                        const isEditing =
                                            user.id === editingUserId;
                                        const displayData = isEditing
                                            ? editingData
                                            : user;

                                        const renderCell = (
                                            key,
                                            type = "text"
                                        ) => (
                                            <td
                                                key={key}
                                                className={key === "avatarUrl"}
                                            >
                                                {isEditing ? (
                                                    <input
                                                        type={type}
                                                        className="form-control form-control-sm"
                                                        value={
                                                            displayData[key] ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleEditDataChange(
                                                                key,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={isSaving}
                                                        style={
                                                            key === "avatarUrl"
                                                                ? {
                                                                      minWidth:
                                                                          "150px",
                                                                  }
                                                                : {}
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            )
                                                                handleEditSave();
                                                        }}
                                                    />
                                                ) : // Display value
                                                key === "avatarUrl" ? (
                                                    <span
                                                        className="avatar avatar-sm"
                                                        style={{
                                                            backgroundImage: `url(${user.avatarUrl})`,
                                                        }}
                                                    ></span>
                                                ) : (
                                                    user[key]
                                                )}
                                            </td>
                                        );

                                        return (
                                            <tr
                                                key={user.id}
                                                className={
                                                    isEditing
                                                        ? "table-active"
                                                        : ""
                                                }
                                            >
                                                <td>{user.id}</td>
                                                {renderCell("avatarUrl", "url")}
                                                {renderCell("fullName")}
                                                {renderCell("email", "email")}
                                                {renderCell("phone")}
                                                <td className="d-none d-lg-table-cell">
                                                    {user.createdAt}
                                                </td>
                                                <td className="d-none d-lg-table-cell">
                                                    {user.updatedAt}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge bg-${
                                                            user.isActive
                                                                ? "success"
                                                                : "danger"
                                                        }-lt`}
                                                    >
                                                        {user.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    {isEditing ? (
                                                        <div className="btn-list flex-nowrap">
                                                            <button
                                                                className="btn btn-icon btn-success"
                                                                title="Lưu"
                                                                onClick={
                                                                    handleEditSave
                                                                }
                                                                disabled={
                                                                    isSaving ||
                                                                    loading
                                                                }
                                                            >
                                                                <IconCheck
                                                                    size={18}
                                                                />
                                                            </button>

                                                            <button
                                                                className="btn btn-icon btn-outline-secondary"
                                                                title="Hủy"
                                                                onClick={
                                                                    handleEditCancel
                                                                }
                                                                disabled={
                                                                    isSaving
                                                                }
                                                            >
                                                                <IconX
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="btn-list flex-nowrap">
                                                            <button
                                                                className="btn btn-icon btn-info-light"
                                                                title="Chỉnh sửa thông tin"
                                                                onClick={() =>
                                                                    handleEditStart(
                                                                        user
                                                                    )
                                                                }
                                                                disabled={
                                                                    isActionDisabled
                                                                }
                                                            >
                                                                <IconEdit
                                                                    size={18}
                                                                />
                                                            </button>
                                                            <button
                                                                className="btn btn-icon"
                                                                title="Đặt lại Mật khẩu"
                                                                onClick={() =>
                                                                    setResetModalUser(
                                                                        user
                                                                    )
                                                                }
                                                                disabled={
                                                                    isActionDisabled
                                                                }
                                                            >
                                                                <IconKey
                                                                    size={18}
                                                                />
                                                            </button>
                                                            <button
                                                                className={`btn btn-icon ${
                                                                    user.isActive
                                                                        ? "btn-danger"
                                                                        : "btn-success"
                                                                }`}
                                                                title={
                                                                    user.isActive
                                                                        ? "Khóa tài khoản"
                                                                        : "Mở khóa tài khoản"
                                                                }
                                                                onClick={() =>
                                                                    handleToggleActive(
                                                                        user.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    isActionDisabled
                                                                }
                                                            >
                                                                {user.isActive ? (
                                                                    <IconLock
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <IconLockOpen
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="card-footer d-flex align-items-center">
                            <p className="m-0 text-muted">
                                Hiển thị từ{" "}
                                {Math.min(startIndex + 1, totalUsers)} đến{" "}
                                {Math.min(
                                    startIndex + paginatedUsers.length,
                                    totalUsers
                                )}{" "}
                                trong tổng số {totalUsers} người dùng
                            </p>

                            <ul className="pagination m-0 ms-auto">
                                <li
                                    className={`page-item ${
                                        currentPage === 1 ? "disabled" : ""
                                    }`}
                                >
                                    <a
                                        className="page-link"
                                        href="#"
                                        tabIndex="-1"
                                        aria-disabled={currentPage === 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1)
                                                setCurrentPage(currentPage - 1);
                                        }}
                                    >
                                        <IconChevronLeft size={16} />
                                    </a>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li
                                        key={i + 1}
                                        className={`page-item ${
                                            currentPage === i + 1
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <a
                                            className="page-link"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(i + 1);
                                            }}
                                        >
                                            {i + 1}
                                        </a>
                                    </li>
                                ))}
                                <li
                                    className={`page-item ${
                                        currentPage >= totalPages ||
                                        totalPages === 0
                                            ? "disabled"
                                            : ""
                                    }`}
                                >
                                    <a
                                        className="page-link"
                                        href="#"
                                        aria-disabled={
                                            currentPage >= totalPages
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages)
                                                setCurrentPage(currentPage + 1);
                                        }}
                                    >
                                        <IconChevronRight size={16} />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <ResetPasswordModal
                show={!!resetModalUser}
                onClose={() => setResetModalUser(null)}
                userId={resetModalUser?.id}
                userName={resetModalUser?.fullName}
                showToast={showToast}
                api={api}
                refetchUsers={fetchUsers}
            />
            {showAddUserModal && (
                <AddUserModal
                    show={showAddUserModal}
                    onClose={() => setShowAddUserModal(false)}
                    fetchUsers={fetchUsers}
                />
            )}
        </div>
    );
}
