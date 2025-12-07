import React, { useState, useEffect, useMemo, useContext } from "react";
import { UIContext } from "../Layouts/AdminLayout";
import api from "../../api/api";
import LoadingComponent from "../components/LoadingComponent";
import {
    IconPlus,
    IconCheck,
    IconX,
    IconEdit,
    IconTrash,
    IconChevronDown,
    IconChevronUp,
    IconArrowLeft,
    IconArrowRight,
    IconArrowsMove,
} from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Dùng cho Drag and Drop trong Modal Danh mục

const ITEMS_PER_PAGE = 10;

// Hàm lấy Icon sắp xếp (tương tự AdminUserManagement)
const getSortIcon = (key, sortConfig) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
        <IconChevronUp size={16} className="ms-1" />
    ) : (
        <IconChevronDown size={16} className="ms-1" />
    );
};

// =======================================================
// MODAL QUẢN LÝ DANH MỤC FAQ (CRUD Category) - CÓ SẮP XẾP
// =======================================================

const CategoryModal = ({ show, onClose, categories, refetchCategories }) => {
    const [name, setName] = useState("");
    const [order, setOrder] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);
    const [localCategories, setLocalCategories] = useState(categories);
    const [editMode, setEditMode] = useState(false);
    const [editedCategory, setEditedCategory] = useState(null);
    const { showToast, showConfirm } = useContext(UIContext);

    useEffect(() => {
        if (show) {
            setLocalCategories(categories);
            setEditMode(false);
            setEditedCategory(null);
            setName("");
            setOrder(0);
        }
    }, [show, categories]);

    // Xử lý Drag and Drop
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const newCategories = Array.from(localCategories);
        const [moved] = newCategories.splice(result.source.index, 1);
        newCategories.splice(result.destination.index, 0, moved);

        // Cập nhật lại thứ tự (order)
        const updated = newCategories.map((c, idx) => ({
            ...c,
            categoryOrder: idx + 1,
        }));
        setLocalCategories(updated);
    };

    // THÊM/SỬA DANH MỤC
    const handleSubmit = async () => {
        if (!name.trim()) {
            showToast("Tên danh mục không được trống.", "danger");
            return;
        }

        setSubmitting(true);
        try {
            const payload = { categoryName: name, categoryOrder: order };
            let res;

            if (editMode && editedCategory) {
                res = await api.put(
                    `/admin/faq/categories/${editedCategory.id}`,
                    payload
                );
            } else {
                res = await api.post("/admin/faq/categories", payload);
            }

            if (res.data?.success) {
                showToast(
                    `Đã ${editMode ? "cập nhật" : "thêm"} danh mục thành công!`,
                    "success"
                );
                refetchCategories(); // Tải lại danh sách chính
                setEditMode(false);
                setEditedCategory(null);
                setName("");
                setOrder(0);
            } else {
                showToast(res.data?.message || `Thao tác thất bại.`, "danger");
            }
        } catch (error) {
            showToast("Lỗi kết nối server.", "danger");
        } finally {
            setSubmitting(false);
        }
    };

    // LƯU THỨ TỰ (ORDER) MỚI SAU KHI KÉO THẢ
    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        try {
            // Chuẩn bị payload chỉ gồm ID và order
            const orderPayload = localCategories.map((c, index) => ({
                id: c.id,
                categoryOrder: index + 1,
                categoryName: c.categoryName, // Gửi categoryName đi kèm cho API PUT nếu cần
            }));

            // Do chúng ta không có API reorder Category chuyên dụng, ta sẽ gọi PUT cho từng Category
            await Promise.all(
                orderPayload.map((item) =>
                    api.put(`/admin/faq/categories/${item.id}`, item)
                )
            );

            showToast("Đã lưu thứ tự danh mục thành công!", "success");
            refetchCategories();
        } catch (error) {
            showToast("Lỗi khi lưu thứ tự.", "danger");
        } finally {
            setIsSavingOrder(false);
        }
    };

    const handleDelete = (categoryToDelete) => {
        showConfirm(
            `Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete.categoryName}" không? Các câu hỏi liên quan sẽ bị đặt Category ID về NULL.`,
            async () => {
                setSubmitting(true);
                try {
                    const res = await api.delete(
                        `/admin/faq/categories/${categoryToDelete.id}`
                    );
                    if (res.data?.success) {
                        showToast("Đã xóa danh mục thành công!", "success");
                        refetchCategories();
                    } else {
                        showToast(
                            res.data?.message || "Xóa thất bại.",
                            "danger"
                        );
                    }
                } catch (error) {
                    showToast("Lỗi kết nối server.", "danger");
                } finally {
                    setSubmitting(false);
                }
            }
        );
    };

    if (!show) return null;

    return (
        <div
            className="modal modal-blur fade show"
            style={{ display: "block" }}
            tabIndex="-1"
        >
            <div
                className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
                role="document"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Quản lý Danh mục Hỏi/Đáp
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            {/* CỘT QUẢN LÝ THỨ TỰ & DRAG AND DROP */}
                            <div className="col-md-7">
                                <h5>Thứ tự hiển thị</h5>
                                <p className="text-muted small">
                                    Kéo thả để sắp xếp lại thứ tự danh mục.
                                </p>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="categories">
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {localCategories.map(
                                                    (cat, index) => (
                                                        <Draggable
                                                            key={cat.id.toString()}
                                                            draggableId={cat.id.toString()}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    className="card card-sm mb-2"
                                                                    style={{
                                                                        ...provided
                                                                            .draggableProps
                                                                            .style,
                                                                        cursor: "grab",
                                                                    }}
                                                                >
                                                                    <div className="card-body p-2 d-flex align-items-center">
                                                                        <span
                                                                            className="me-2 text-muted"
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <IconArrowsMove
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </span>
                                                                        <span className="badge bg-primary-lt me-3">
                                                                            {index +
                                                                                1}
                                                                        </span>
                                                                        <span className="flex-grow-1">
                                                                            {
                                                                                cat.categoryName
                                                                            }
                                                                        </span>

                                                                        <button
                                                                            className="btn btn-icon btn-sm btn-info-light me-2"
                                                                            onClick={() => {
                                                                                setEditMode(
                                                                                    true
                                                                                );
                                                                                setEditedCategory(
                                                                                    cat
                                                                                );
                                                                                setName(
                                                                                    cat.categoryName
                                                                                );
                                                                                setOrder(
                                                                                    cat.categoryOrder
                                                                                );
                                                                            }}
                                                                        >
                                                                            <IconEdit
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-icon btn-sm btn-danger"
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    cat
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                submitting
                                                                            }
                                                                        >
                                                                            <IconTrash
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    )
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>

                                <button
                                    className="btn btn-success mt-3"
                                    onClick={handleSaveOrder}
                                    disabled={isSavingOrder || submitting}
                                >
                                    {isSavingOrder
                                        ? "Đang lưu thứ tự..."
                                        : "Lưu Thứ tự đã Sắp xếp"}
                                </button>
                            </div>

                            {/* CỘT THÊM/SỬA FORM */}
                            <div className="col-md-5">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">
                                            {editMode
                                                ? `Sửa: ${editedCategory?.categoryName}`
                                                : "Thêm Danh mục mới"}
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label required">
                                                Tên Danh mục
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Thứ tự mặc định
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={order}
                                                onChange={(e) =>
                                                    setOrder(
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                disabled={submitting}
                                            />
                                            <small className="form-hint">
                                                Dùng cho mục đích khởi tạo/sắp
                                                xếp thủ công ban đầu.
                                            </small>
                                        </div>
                                        <button
                                            type="button"
                                            className={`btn w-100 ${
                                                editMode
                                                    ? "btn-info"
                                                    : "btn-primary"
                                            }`}
                                            onClick={handleSubmit}
                                            disabled={
                                                submitting || !name.trim()
                                            }
                                        >
                                            {submitting
                                                ? "Đang lưu..."
                                                : editMode
                                                ? "Cập nhật Danh mục"
                                                : "Thêm mới Danh mục"}
                                        </button>
                                    </div>
                                </div>

                                {editMode && (
                                    <button
                                        type="button"
                                        className="btn btn-link mt-2 w-100"
                                        onClick={() => {
                                            setEditMode(false);
                                            setEditedCategory(null);
                                            setName("");
                                            setOrder(0);
                                        }}
                                    >
                                        Thêm mới khác
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-link link-secondary"
                            onClick={onClose}
                            disabled={submitting || isSavingOrder}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =======================================================
// MODAL THÊM/SỬA FAQ (CRUD Question - Giữ nguyên)
// =======================================================
// [FaqModal code]... (Giữ nguyên)
const FaqModal = ({ show, onClose, faq, categories, refetch }) => {
    const [formData, setFormData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useContext(UIContext);
    const isEdit = !!faq;

    useEffect(() => {
        if (show) {
            setFormData({
                question: faq?.question || "",
                answer: faq?.answer || "",
                categoryId: faq?.categoryId || categories[0]?.id || "",
                faqOrder: faq?.faqOrder || 0,
                isPublished: faq?.isPublished ?? 1, // Mặc định là 1 (TRUE)
            });
        }
    }, [show, faq, categories]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                        ? 1
                        : 0
                    : name === "categoryId" || name === "faqOrder"
                    ? parseInt(value)
                    : value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.question.trim() || !formData.answer.trim()) {
            showToast("Câu hỏi và Câu trả lời không được trống.", "danger");
            return;
        }

        setSubmitting(true);
        try {
            let res;
            if (isEdit) {
                res = await api.put(`/admin/faq/${faq.id}`, formData);
            } else {
                res = await api.post("/admin/faq", formData);
            }

            if (res.data?.success) {
                showToast(
                    `Đã ${isEdit ? "cập nhật" : "thêm"} FAQ thành công!`,
                    "success"
                );
                refetch();
                onClose();
            } else {
                showToast(res.data?.message || `Thao tác thất bại.`, "danger");
            }
        } catch (error) {
            showToast("Lỗi kết nối server.", "danger");
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
                className="modal-dialog modal-lg modal-dialog-centered"
                role="document"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isEdit ? "Chỉnh sửa Câu hỏi" : "Thêm Câu hỏi mới"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label required">
                                Câu hỏi (Question)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="question"
                                value={formData.question || ""}
                                onChange={handleInputChange}
                                disabled={submitting}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label required">
                                Câu trả lời (Answer)
                            </label>
                            <textarea
                                className="form-control"
                                rows="5"
                                name="answer"
                                value={formData.answer || ""}
                                onChange={handleInputChange}
                                disabled={submitting}
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Danh mục (Category)
                                </label>
                                <select
                                    className="form-select"
                                    name="categoryId"
                                    value={formData.categoryId || ""}
                                    onChange={handleInputChange}
                                    disabled={submitting}
                                >
                                    <option value="">
                                        -- Chọn Danh mục --
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    Thứ tự (Order)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="faqOrder"
                                    value={formData.faqOrder || 0}
                                    onChange={handleInputChange}
                                    disabled={submitting}
                                />
                            </div>
                            <div className="col-md-3 mb-3 d-flex align-items-center pt-2">
                                <label className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="isPublished"
                                        checked={formData.isPublished === 1}
                                        onChange={handleInputChange}
                                        disabled={submitting}
                                    />
                                    <span className="form-check-label">
                                        Công khai
                                    </span>
                                </label>
                            </div>
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
                            {submitting
                                ? "Đang lưu..."
                                : isEdit
                                ? "Lưu thay đổi"
                                : "Thêm mới"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =======================================================
// COMPONENT CHÍNH: QUẢN LÝ FAQ
// =======================================================

export default function FaqAdmin() {
    const [faqs, setFaqs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalFaqs, setTotalFaqs] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editCategoryData, setEditCategoryData] = useState(null); // Không dùng khi Category Modal dùng cho CRUD list
    const [showFaqModal, setShowFaqModal] = useState(false);
    const [editFaqData, setEditFaqData] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState(0); // 0 = All
    const [sortConfig, setSortConfig] = useState({
        key: "faqOrder",
        direction: "asc",
    }); // Thêm sortConfig
    const { showToast, showConfirm } = useContext(UIContext);

    const ITEMS_PER_PAGE = 10;

    // --- FETCH DATA ---

    const fetchFaqs = async () => {
        setLoading(true);
        const params = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            categoryId: selectedCategoryId,
            // Thêm tham số sắp xếp (giả định backend hỗ trợ)
            sortKey: sortConfig.key,
            sortDirection: sortConfig.direction,
        };

        try {
            const res = await api.get("/faqs", { params });

            if (res.data?.success) {
                setFaqs(res.data.data.faqs || []);
                setTotalFaqs(res.data.data.total || 0);
            } else {
                setFaqs([]);
                setTotalFaqs(0);
            }
        } catch (error) {
            showToast("Lỗi tải dữ liệu FAQ.", "danger");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // Lấy categories ở đây để tránh lỗi đồng bộ khi mở CategoryModal
            const res = await api.get("/faqs/categories");
            if (res.data?.success) {
                setCategories(res.data.data || []);
            }
        } catch (error) {
            showToast("Lỗi tải danh mục.", "danger");
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, [currentPage, selectedCategoryId, sortConfig.key, sortConfig.direction]); // Thêm dependencies

    useEffect(() => {
        fetchCategories();
    }, [showCategoryModal]); // Refetch categories sau khi đóng modal

    // --- HANDLERS ---

    const handleAddFaq = () => {
        setEditFaqData(null);
        setShowFaqModal(true);
    };

    const handleEditFaq = (faq) => {
        setEditFaqData(faq);
        setShowFaqModal(true);
    };

    const handleDeleteFaq = (id) => {
        showConfirm("Bạn có chắc chắn muốn xóa câu hỏi này?", async () => {
            try {
                const res = await api.delete(`/admin/faq/${id}`);
                if (res.data?.success) {
                    showToast("Đã xóa câu hỏi thành công!", "success");
                    fetchFaqs();
                } else {
                    showToast(res.data?.message || "Xóa thất bại.", "danger");
                }
            } catch (error) {
                showToast("Lỗi kết nối server khi xóa.", "danger");
            }
        });
    };

    const requestSort = (key) => {
        let direction =
            sortConfig.key === key && sortConfig.direction === "asc"
                ? "desc"
                : "asc";
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalFaqs / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    if (loading && faqs.length === 0) {
        return <LoadingComponent />;
    }

    return (
        <div className="page-wrapper">
            <div className="container-xl">
                {/* Header và Nút Hành động */}
                <div className="page-header d-print-none">
                    <div className="row align-items-center">
                        <div className="col">
                            <h2 className="page-title">
                                Quản lý Hỏi/Đáp (FAQ)
                            </h2>
                            <p className="text-muted">
                                Tổng số câu hỏi: {totalFaqs}
                            </p>
                        </div>
                        <div className="col-auto ms-auto d-print-none">
                            <div className="btn-list">
                                <button
                                    className="btn btn-outline-secondary d-flex align-items-center"
                                    onClick={() => setShowCategoryModal(true)}
                                >
                                    Quản lý Danh mục
                                </button>
                                <button
                                    className="btn btn-primary d-flex align-items-center"
                                    onClick={handleAddFaq}
                                >
                                    <IconPlus size={18} className="me-1" />
                                    Thêm Câu hỏi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            {/* DROP DOWN LỌC THEO DANH MỤC */}
                            <div className="d-flex align-items-center">
                                <span className="me-2 text-muted">
                                    Lọc theo:
                                </span>
                                <select
                                    className="form-select form-select-sm w-auto"
                                    value={selectedCategoryId}
                                    onChange={(e) => {
                                        setSelectedCategoryId(
                                            parseInt(e.target.value)
                                        );
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value={0}>Tất cả Danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
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
                                        <th
                                            className="cursor-pointer"
                                            onClick={() =>
                                                requestSort("question")
                                            }
                                        >
                                            Câu hỏi (Question){" "}
                                            {getSortIcon(
                                                "question",
                                                sortConfig
                                            )}
                                        </th>
                                        <th
                                            className="cursor-pointer"
                                            onClick={() =>
                                                requestSort("categoryName")
                                            }
                                        >
                                            Danh mục{" "}
                                            {getSortIcon(
                                                "categoryName",
                                                sortConfig
                                            )}
                                        </th>
                                        <th
                                            className="cursor-pointer"
                                            onClick={() =>
                                                requestSort("faqOrder")
                                            }
                                        >
                                            Thứ tự{" "}
                                            {getSortIcon(
                                                "faqOrder",
                                                sortConfig
                                            )}
                                        </th>
                                        <th
                                            className="cursor-pointer"
                                            onClick={() =>
                                                requestSort("isPublished")
                                            }
                                        >
                                            Công khai{" "}
                                            {getSortIcon(
                                                "isPublished",
                                                sortConfig
                                            )}
                                        </th>
                                        <th
                                            className="cursor-pointer"
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
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-4"
                                            >
                                                <CircularProgress size={24} />{" "}
                                                Đang tải...
                                            </td>
                                        </tr>
                                    ) : faqs.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-4"
                                            >
                                                Không có câu hỏi nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        faqs.map((faq) => (
                                            <tr key={faq.id}>
                                                <td>{faq.id}</td>
                                                <td
                                                    style={{
                                                        maxWidth: "400px",
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    <strong>
                                                        {faq.question}
                                                    </strong>
                                                    <div className="text-muted small mt-1">
                                                        Trả lời:{" "}
                                                        {faq.answer.substring(
                                                            0,
                                                            100
                                                        )}
                                                        ...
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info-lt">
                                                        {faq.categoryName ||
                                                            "Chưa phân loại"}
                                                    </span>
                                                </td>
                                                <td>{faq.faqOrder}</td>
                                                <td>
                                                    <span
                                                        className={`badge bg-${
                                                            faq.isPublished
                                                                ? "success"
                                                                : "danger"
                                                        }-lt`}
                                                    >
                                                        {faq.isPublished
                                                            ? "Có"
                                                            : "Ẩn"}
                                                    </span>
                                                </td>
                                                <td>{faq.updatedAt}</td>
                                                <td className="text-end">
                                                    <div className="btn-list flex-nowrap">
                                                        <button
                                                            className="btn btn-icon btn-info-light"
                                                            title="Chỉnh sửa"
                                                            onClick={() =>
                                                                handleEditFaq(
                                                                    faq
                                                                )
                                                            }
                                                        >
                                                            <IconEdit
                                                                size={16}
                                                            />
                                                        </button>
                                                        <button
                                                            className="btn btn-icon btn-danger"
                                                            title="Xóa"
                                                            onClick={() =>
                                                                handleDeleteFaq(
                                                                    faq.id
                                                                )
                                                            }
                                                        >
                                                            <IconTrash
                                                                size={16}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Thanh Phân trang (Pagination) */}
                        <div className="card-footer d-flex align-items-center">
                            <p className="m-0 text-muted">
                                Hiển thị từ{" "}
                                {Math.min(startIndex + 1, totalFaqs)} đến{" "}
                                {Math.min(startIndex + faqs.length, totalFaqs)}{" "}
                                trong tổng số {totalFaqs} câu hỏi
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

            {/* Modals */}
            <CategoryModal
                show={showCategoryModal}
                onClose={() => {
                    setShowCategoryModal(false);
                    setEditCategoryData(null);
                }}
                categories={categories} // Truyền danh sách categories để CategoryModal có thể sắp xếp
                refetchCategories={fetchCategories} // Thêm refetchCategories cho CategoryModal
            />

            <FaqModal
                show={showFaqModal}
                onClose={() => setShowFaqModal(false)}
                faq={editFaqData}
                categories={categories}
                refetch={fetchFaqs}
            />
        </div>
    );
}

const IconChevronLeft = (props) => (
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
        {...props}
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <polyline points="15 6 9 12 15 18"></polyline>
    </svg>
);

const IconChevronRight = (props) => (
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
        {...props}
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <polyline points="9 6 15 12 9 18"></polyline>
    </svg>
);
