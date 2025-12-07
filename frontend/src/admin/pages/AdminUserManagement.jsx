import React, { useState, useEffect, useMemo, useContext } from "react";
import ResetPasswordModal from "../components/ResetPasswordModal";
import LoadingComponent from "../components/LoadingComponent";
import { UIContext } from "../Layouts/AdminLayout";
import api from "../../api/api";

const ITEMS_PER_PAGE = 10;

const getSortIcon = (key, sortConfig) => {
    const defaultIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-sm text-muted"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 9l4 -4l4 4m-4 -4v14" />
            <path d="M21 15l-4 4l-4 -4m4 4v-14" />
        </svg>
    );

    if (sortConfig.key !== key) {
        return defaultIcon;
    }

    return sortConfig.direction === "asc" ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-sm text-dark"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <polyline points="6 15 12 9 18 15"></polyline>
        </svg>
    ) : (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-sm text-dark"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
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
            //console.error("Lỗi tải dữ liệu người dùng:", error);
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
        // Copy dữ liệu người dùng hiện tại vào editingData
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

            // GỌI API PUT /admin/users/{id}
            const res = await api.put(`/admin/users/${userId}`, editingData);

            if (res.data?.success) {
                showToast(
                    res.data.message || `Cập nhật thông tin thành công!`,
                    "success"
                );
                setEditingUserId(null); // Thoát chế độ edit
                await fetchUsers(); // Tải lại dữ liệu để cập nhật bảng
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
                {/* Header Tiêu đề */}
                <div className="page-header d-print-none">
                    <div className="row align-items-center">
                        <div className="col">
                            <h2 className="page-title">
                                Quản lý Khách hàng (Users)
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Nội dung chính: Thẻ Card chứa tìm kiếm, lọc và bảng */}
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                Danh sách Khách hàng ({totalUsers} users)
                            </h3>
                        </div>

                        {/* Thanh Tìm kiếm và Lọc */}
                        <div className="card-body border-bottom py-3">
                            <div className="d-flex flex-column flex-md-row justify-content-start gap-3">
                                {/* Search Input */}
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
                                    {/* NÚT TÌM KIẾM CỤ THỂ */}
                                    <button
                                        className="btn btn-icon btn-primary"
                                        onClick={handleSearchSubmit}
                                        disabled={loading}
                                        title="Tìm kiếm"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                            ></path>
                                            <circle
                                                cx="10"
                                                cy="10"
                                                r="7"
                                            ></circle>
                                            <line
                                                x1="21"
                                                y1="21"
                                                x2="15"
                                                y2="15"
                                            ></line>
                                        </svg>
                                    </button>
                                </div>

                                {/* DROP DOWN LỌC TRẠNG THÁI */}
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

                        {/* Bảng Hiển thị Dữ liệu */}
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

                                        // Hàm render ô input/text
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
                                                        // NÚT LƯU (V) VÀ HỦY (X)
                                                        <div className="btn-list flex-nowrap">
                                                            {/* Nút LƯU (V) */}
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
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="icon"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="2"
                                                                    stroke="currentColor"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path
                                                                        stroke="none"
                                                                        d="M0 0h24v24H0z"
                                                                        fill="none"
                                                                    ></path>
                                                                    <path d="M5 12l5 5l10 -10"></path>
                                                                </svg>
                                                            </button>
                                                            {/* Nút HỦY (X) */}
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
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="icon"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="2"
                                                                    stroke="currentColor"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path
                                                                        stroke="none"
                                                                        d="M0 0h24v24H0z"
                                                                        fill="none"
                                                                    ></path>
                                                                    <line
                                                                        x1="18"
                                                                        y1="6"
                                                                        x2="6"
                                                                        y2="18"
                                                                    ></line>
                                                                    <line
                                                                        x1="6"
                                                                        y1="6"
                                                                        x2="18"
                                                                        y2="18"
                                                                    ></line>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        // NÚT HÀNH ĐỘNG THÔNG THƯỜNG
                                                        <div className="btn-list flex-nowrap">
                                                            {/* Nút EDIT START */}
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
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="icon"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="2"
                                                                    stroke="currentColor"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path
                                                                        stroke="none"
                                                                        d="M0 0h24v24H0z"
                                                                        fill="none"
                                                                    ></path>
                                                                    <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"></path>
                                                                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"></path>
                                                                    <line
                                                                        x1="16"
                                                                        y1="5"
                                                                        x2="19"
                                                                        y2="8"
                                                                    ></line>
                                                                </svg>
                                                            </button>
                                                            {/* Nút Reset Password */}
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
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="icon"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="2"
                                                                    stroke="currentColor"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path
                                                                        stroke="none"
                                                                        d="M0 0h24v24H0z"
                                                                        fill="none"
                                                                    ></path>
                                                                    <circle
                                                                        cx="8"
                                                                        cy="15"
                                                                        r="4"
                                                                    ></circle>
                                                                    <line
                                                                        x1="10.85"
                                                                        y1="7.7"
                                                                        x2="18"
                                                                        y2="3"
                                                                    ></line>
                                                                    <path d="M18 6l-1.5 1.5"></path>
                                                                </svg>
                                                            </button>
                                                            {/* Nút Khóa/Mở khóa */}
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
                                                                    /* Icon Lock */ <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="icon"
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="2"
                                                                        stroke="currentColor"
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <path
                                                                            stroke="none"
                                                                            d="M0 0h24v24H0z"
                                                                            fill="none"
                                                                        ></path>
                                                                        <rect
                                                                            x="5"
                                                                            y="11"
                                                                            width="14"
                                                                            height="10"
                                                                            rx="2"
                                                                        ></rect>
                                                                        <circle
                                                                            cx="12"
                                                                            cy="16"
                                                                            r="1"
                                                                        ></circle>
                                                                        <path d="M8 11v-4a4 4 0 0 1 8 0v4"></path>
                                                                    </svg>
                                                                ) : (
                                                                    /* Icon Unlock */ <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="icon"
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="2"
                                                                        stroke="currentColor"
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <path
                                                                            stroke="none"
                                                                            d="M0 0h24v24H0z"
                                                                            fill="none"
                                                                        ></path>
                                                                        <rect
                                                                            x="5"
                                                                            y="11"
                                                                            width="14"
                                                                            height="10"
                                                                            rx="2"
                                                                        ></rect>
                                                                        <circle
                                                                            cx="12"
                                                                            cy="16"
                                                                            r="1"
                                                                        ></circle>
                                                                        <path d="M8 11v-3a4 4 0 0 1 7.237 -2.336"></path>
                                                                    </svg>
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

                        {/* Thanh Phân trang (Pagination) */}
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

                            {/* Nút Phân trang */}
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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                            ></path>
                                            <polyline points="15 6 9 12 15 18"></polyline>
                                        </svg>
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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                            ></path>
                                            <polyline points="9 6 15 12 9 18"></polyline>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* MODAL */}
            <ResetPasswordModal
                show={!!resetModalUser}
                onClose={() => setResetModalUser(null)}
                userId={resetModalUser?.id}
                userName={resetModalUser?.fullName}
                showToast={showToast}
                api={api}
                refetchUsers={fetchUsers}
            />
        </div>
    );
}
