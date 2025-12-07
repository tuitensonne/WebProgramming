import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UIContext } from "../Layouts/AdminLayout";
import api from "../../api/api";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import LoadingComponent from "../components/LoadingComponent";

import { AboutPageHeader } from "../../client/components/AboutUs/AboutPageHeader";
import { AboutHeroSection } from "../../client/components/AboutUs/AboutHeroSection";
import { AboutStatsSection } from "../../client/components/AboutUs/AboutStatsSection";
import { OurHistorySection } from "../../client/components/AboutUs/OurHistorySection";
import { CoreValuesSection } from "../../client/components/AboutUs/CoreValuesSection";
import { TeamSection } from "../../client/components/AboutUs/TeamSection";
import { TestimonialsSection } from "../../client/components/AboutUs/TestimonialsSection";

const ABOUT_US_PAGE_ID = 2;

const sectionComponents = {
  about_header: AboutPageHeader,
  about_hero: AboutHeroSection,
  about_stats: AboutStatsSection,
  about_history: OurHistorySection,
  about_values: CoreValuesSection,
  about_team: TeamSection,
  about_testimonials: TestimonialsSection,
};

const layoutOptions = [
  {
    id: "about_header",
    name: "0. Header Trang Giới thiệu",
    description: "Banner lớn hiển thị tiêu đề trang.",
    image: "/images/layouts/about-header.png",
    hasItems: false,
    defaultContent: {
      title: "VỀ CHÚNG TÔI",
      subtitle: "Hành trình, Sứ mệnh và Đội ngũ",
      image_url:
        "https://placehold.co/1920x650/4CAF50/ffffff?text=About+Header",
    },
    itemFields: [],
  },
  {
    id: "about_hero",
    name: "1. Giới thiệu Sứ mệnh (Hero)",
    description: "Khối nội dung 2 cột: Ảnh và Mô tả sứ mệnh.",
    image: "/images/layouts/about-hero.png",
    hasItems: true,
    defaultContent: {
      title: "Chúng tôi mang đến những chuyến đi tuyệt vời",
      subtitle: "SỨ MỆNH CỦA CHÚNG TÔI",
      image_url: "",
    },
    itemFields: [
      {
        name: "desc",
        label: "Nội dung chi tiết",
        type: "textarea",
        required: true,
      },
      {
        name: "imageUrl",
        label: "Ảnh chính (URL)",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "about_values",
    name: "2. Giá trị cốt lõi",
    description: "Hiển thị 3-4 giá trị/lợi ích (Icon, Title, Desc).",
    image: "/images/layouts/about-values.png",
    hasItems: true,
    defaultContent: {
      title: "Những Giá Trị Cốt Lõi Của Chúng Tôi",
      subtitle: "VĂN HÓA DOANH NGHIỆP",
      background_color: "#f5f5f5",
    },
    itemFields: [
      {
        name: "icon",
        label: "Icon Name (MUI)",
        type: "text",
        required: true,
        placeholder: "VD: SecurityIcon",
      },
      {
        name: "title",
        label: "Tiêu đề giá trị",
        type: "text",
        required: true,
      },
      {
        name: "desc",
        label: "Mô tả ngắn",
        type: "textarea",
        required: true,
      },
      {
        name: "color",
        label: "Màu (Hex)",
        type: "color",
        required: false,
      },
    ],
  },
  {
    id: "about_stats",
    name: "3. Chỉ số (Stats) & Số liệu",
    description: "Hiển thị các chỉ số thành tích dạng vòng tròn.",
    image: "/images/layouts/about-stats.png",
    hasItems: true,
    defaultContent: {
      title: "Những con số biết nói",
      subtitle: "THÀNH TÍCH",
      background_color: "#f5f5f5",
    },
    itemFields: [
      {
        name: "title",
        label: "Tên chỉ số",
        type: "text",
        required: true,
      },
      {
        name: "desc",
        label: "Giá trị số (92)",
        type: "text",
        required: true,
      },
      {
        name: "icon",
        label: "Đơn vị (%)",
        type: "text",
        required: false,
        placeholder: "VD: %, +, năm",
      },
      {
        name: "color",
        label: "Màu (Hex)",
        type: "color",
        required: false,
      },
    ],
  },
  {
    id: "about_history",
    name: "4. Lịch sử / Cột mốc",
    description: "Trình bày các mốc thời gian quan trọng.",
    image: "/images/layouts/about-history.png",
    hasItems: true,
    defaultContent: {
      title: "Hành trình Phát triển của Chúng tôi",
      subtitle: "CỘT MỐC QUAN TRỌNG",
    },
    itemFields: [
      {
        name: "title",
        label: "Năm/Tiêu đề sự kiện",
        type: "text",
        required: true,
      },
      {
        name: "desc",
        label: "Mô tả sự kiện",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "about_team",
    name: "5. Đội ngũ nhân sự",
    description: "Giới thiệu các thành viên chủ chốt (Tên, Role, Ảnh).",
    image: "/images/layouts/about-team.png",
    hasItems: true,
    defaultContent: {
      title: "Gặp gỡ Đội ngũ của Chúng tôi",
      subtitle: "CON NGƯỜI LÀ NỀN TẢNG",
    },
    itemFields: [
      { name: "title", label: "Tên", type: "text", required: true },
      {
        name: "subtitle",
        label: "Chức danh/Vị trí",
        type: "text",
        required: true,
      },
      {
        name: "imageUrl",
        label: "URL Ảnh đại diện",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "about_testimonials",
    name: "6. Đánh giá (Testimonials)",
    description: "Hiển thị đánh giá của khách hàng (lấy từ bảng Comment).",
    image: "/images/layouts/about-testimonials.png",
    hasItems: false,
    defaultContent: {
      title: "Khách hàng nói gì về chúng tôi",
      subtitle: "ĐÁNH GIÁ THỰC TẾ",
    },
    itemFields: [],
  },
];

const AddSectionModal = ({
  show,
  onClose,
  mode = "add",
  editData = null,
  categories = [],
}) => {
  const [step, setStep] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [sectionData, setSectionData] = useState({});
  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useContext(UIContext);

  useEffect(() => {
    if (show && mode === "edit" && editData) {
      const layout = layoutOptions.find((l) => l.id === editData.type);
      setSelectedLayout(layout);
      setSectionData({
        title: editData.title,
        subtitle: editData.subtitle,
        description: editData.description,
        background_color: editData.background_color,
        image_url: editData.image_url,
        category_id: editData.category_id,
      });
      setItems(
        editData.items
          ? editData.items.map((item) => ({
              ...item,
              id: item.id || Math.random(),
            }))
          : []
      );
      setStep(2);
    } else if (show && mode === "add") {
      resetModal();
    }
  }, [show, editData, mode]);

  const resetModal = () => {
    setStep(1);
    setSelectedLayout(null);
    setSectionData({});
    setItems([]);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    setSectionData(layout.defaultContent);
    setItems([]);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedLayout) {
      setStep(2);
    } else if (step === 2) {
      if (selectedLayout.hasItems) {
        setStep(3);
      } else {
        handleSubmit();
      }
    } else if (step === 3) {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (mode === "add" || (mode === "edit" && step > 2)) {
      if (step === 3) {
        setStep(2);
      } else if (step === 2) {
        setStep(1);
      }
    }
  };

  const handleContentChange = (field, value) => {
    setSectionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    const newItem = { id: Math.random() };
    selectedLayout.itemFields.forEach((field) => {
      newItem[field.name] = "";
    });
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...sectionData,

        items: selectedLayout.hasItems
          ? items.map(({ id, ...rest }) => ({ ...rest }))
          : [],
        type: selectedLayout.id,
        page_id: ABOUT_US_PAGE_ID,
      };

      if (mode === "edit") {
        await api.put(`sections/${editData.id}`, payload);
        showToast("Đã chỉnh sửa section thành công!", "success");
      } else {
        await api.post("sections", payload);
        showToast("Thêm section thành công!", "success");
      }

      handleClose();
    } catch (error) {
      console.error(error);
      showToast("Đã có lỗi xảy ra!", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const renderContentForm = () => {
    if (!selectedLayout) return null;

    const fields = [
      {
        name: "title",
        label: "Tiêu đề chính (Title)",
        type: "text",
        required: true,
      },
      {
        name: "subtitle",
        label: "Tiêu đề phụ (Subtitle)",
        type: "text",
        required: false,
      },
      {
        name: "description",
        label: "Mô tả dài (Description)",
        type: "textarea",
        required: false,
      },
      {
        name: "image_url",
        label: "URL Hình ảnh (Image URL)",
        type: "text",
        required: false,
      },
      {
        name: "background_color",
        label: "Màu nền (Background Color)",
        type: "color_text",
        required: false,
      },
      {
        name: "category_id",
        label: "Chọn danh mục",
        type: "select_category",
        required: false,
      },
    ];

    const layoutFields =
      layoutOptions.find((l) => l.id === selectedLayout.id)?.defaultContent ||
      {};
    const relevantFields = fields.filter(
      (field) =>
        field.name in layoutFields ||
        (field.name === "category_id" &&
          selectedLayout.id === "item_listing_layout")
    );

    return (
      <div className="space-y-3">
        {relevantFields.map((field) => (
          <div key={field.name} className="form-group mb-3">
            <label className={`form-label ${field.required ? "required" : ""}`}>
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                className="form-control"
                rows="4"
                value={sectionData[field.name] || ""}
                onChange={(e) =>
                  handleContentChange(field.name, e.target.value)
                }
                placeholder={`Mô tả chi tiết về ${field.label}...`}
              />
            ) : field.type === "color_text" ? (
              <div className="input-group">
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={sectionData[field.name] || "#ffffff"}
                  onChange={(e) =>
                    handleContentChange(field.name, e.target.value)
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  value={sectionData[field.name] || ""}
                  onChange={(e) =>
                    handleContentChange(field.name, e.target.value)
                  }
                  placeholder="#ffffff hoặc transparent"
                />
              </div>
            ) : field.type === "select_category" ? (
              <select
                className="form-select"
                value={sectionData.category_id || ""}
                onChange={(e) =>
                  handleContentChange(
                    "category_id",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.tourCategoryName}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-control"
                value={sectionData[field.name] || ""}
                onChange={(e) =>
                  handleContentChange(field.name, e.target.value)
                }
                placeholder={`Nhập ${field.label}...`}
              />
            )}
          </div>
        ))}
        {selectedLayout.id === "about_testimonials" && (
          <div className="alert alert-info">
            <strong>Lưu ý:</strong> Section Đánh giá lấy dữ liệu trực tiếp từ
            bảng Comment và không thể chỉnh sửa nội dung đánh giá tại đây.
          </div>
        )}
      </div>
    );
  };

  const renderItemsForm = () => {
    if (!selectedLayout || !selectedLayout.hasItems) return null;

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Danh sách Items</h4>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleAddItem}
          >
            <IconPlus size={16} className="me-1" />
            Thêm Item
          </button>
        </div>

        {items.length === 0 ? (
          <div className="alert alert-warning">
            Chưa có item nào. Nhấn "Thêm Item" để bắt đầu.
          </div>
        ) : (
          <div>
            {items.map((item, index) => (
              <div className="card mb-3" key={item.id}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <strong>Item #{index + 1}</strong>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>

                <div className="card-body">
                  <div className="row">
                    {selectedLayout.itemFields.map((field) => (
                      <div
                        key={field.name}
                        className={
                          field.type === "textarea"
                            ? "col-12 mb-3"
                            : "col-md-6 mb-3"
                        }
                      >
                        <label className="form-label">
                          {field.label}
                          {field.required && (
                            <span className="text-danger">*</span>
                          )}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            className="form-control"
                            rows="3"
                            value={item[field.name] || ""}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                field.name,
                                e.target.value
                              )
                            }
                            required={field.required}
                          />
                        ) : field.type === "color" ? (
                          <div className="input-group">
                            <input
                              type="color"
                              className="form-control form-control-color"
                              value={item[field.name] || "#000000"}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  field.name,
                                  e.target.value
                                )
                              }
                            />

                            <input
                              type="text"
                              className="form-control"
                              value={item[field.name] || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  field.name,
                                  e.target.value
                                )
                              }
                              placeholder="#000000"
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            value={item[field.name] || ""}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                field.name,
                                e.target.value
                              )
                            }
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!show) return null;

  const totalSteps = selectedLayout ? (selectedLayout.hasItems ? 3 : 2) : 1;
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal modal-blur fade show"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content" style={{ overflowX: "hidden" }}>
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === "edit"
                  ? `Chỉnh sửa Section: ${editData?.type}`
                  : "Thêm Section Mới"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="progress progress-sm">
              <div
                className="progress-bar bg-primary"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span className="visually-hidden">
                  {progressPercentage}% Complete
                </span>
              </div>
            </div>

            <div className="modal-body" style={{ overflowX: "hidden" }}>
              {step === 1 && (
                <div
                  className="row row-cards"
                  style={{ margin: 0, overflowX: "hidden" }}
                >
                  {layoutOptions.map((layout) => (
                    <div key={layout.id} className="col-md-6 mb-3">
                      <label className="form-selectgroup-item flex-fill">
                        <input
                          type="radio"
                          name="layout-selection"
                          value={layout.id}
                          className="form-selectgroup-input"
                          checked={selectedLayout?.id === layout.id}
                          onChange={() => handleLayoutSelect(layout)}
                        />
                        <div className="form-selectgroup-label d-flex flex-column p-3">
                          <div className="mb-3">
                            <div
                              className="ratio ratio-16x9 bg-light rounded-2 d-flex align-items-center justify-content-center"
                              style={{
                                minHeight: "120px",
                              }}
                            >
                              <div className="text-muted">
                                <IconCheck size={36} />
                              </div>
                            </div>
                          </div>
                          <div className="font-weight-medium mb-1">
                            {layout.name}
                            {layout.hasItems && (
                              <span className="badge bg-azure ms-2">
                                Có items
                              </span>
                            )}
                          </div>
                          <div className="text-muted small">
                            {layout.description}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="alert alert-info" role="alert">
                    <div className="d-flex">
                      <div>
                        <IconCheck className="icon alert-icon" size={24} />
                      </div>
                      <div>
                        <h4 className="alert-title">Layout đã chọn</h4>
                        <div className="text-muted">
                          {selectedLayout?.name} - {selectedLayout?.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {renderContentForm()}
                </div>
              )}

              {step === 3 && renderItemsForm()}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn btn-danger me-auto"
                onClick={handleClose}
              >
                Hủy
              </button>

              {step > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handlePrevStep}
                  disabled={mode === "edit" && step === 2}
                >
                  <IconArrowLeft size={18} className="me-1" />
                  Quay lại
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextStep}
                  disabled={step === 1 && !selectedLayout}
                >
                  Tiếp theo
                  <IconArrowRight size={18} className="ms-1" />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      {mode === "edit" ? "Đang lưu..." : "Đang tạo..."}
                    </>
                  ) : (
                    <>
                      <IconCheck size={18} className="me-1" />
                      {mode === "edit" ? "Lưu" : "Tạo"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function AboutUsAdmin() {
  const { showToast, showConfirm } = useContext(UIContext);
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [originalSections, setOriginalSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const [categories, setCategories] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const showEditSection = (section) => {
    setEditModalData(section);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchSections(), fetchCategories()]);
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("tours/categories");
      if (res.data?.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await api.get(`pages/${ABOUT_US_PAGE_ID}/sections`);
      if (res.data?.success) {
        const sorted = res.data.data.sort((a, b) => a.order - b.order);
        setSections(sorted);
        setOriginalSections(sorted);
      }
    } catch (err) {
      console.error(err);
      showToast("Không thể tải danh sách section!", "danger");
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSections = Array.from(sections);
    const [moved] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, moved);
    const updated = newSections.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(updated);
    setChanged(true);
  };

  const handleCancelChanges = () => {
    setSections(originalSections);
    setChanged(false);
  };

  const handleSaveOrder = async () => {
    try {
      setSaving(true);
      await api.put("/sections/reorder", { sections });
      showToast("Đã lưu thay đổi thứ tự thành công!", "success");
      setChanged(false);
    } catch (error) {
      console.error(error);
      showToast("Có lỗi khi lưu thay đổi.", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = (id) => {
    showConfirm("Bạn có chắc muốn xóa section này không?", async () => {
      try {
        const res = await api.delete(`/sections/${id}`);
        if (res.data?.success) {
          setSections((prev) => prev.filter((s) => s.id !== id));
          showToast("Đã xoá section thành công!", "success");
        } else {
          showToast(
            "Xoá thất bại: " + (res.data?.message || "Không rõ lỗi"),
            "danger"
          );
        }
      } catch (error) {
        console.error(error);
        showToast("Có lỗi xảy ra khi xoá section!", "danger");
      }
    });
  };

  if (loading) return <LoadingComponent />;

  return (
    <div
      className="page-wrapper p-4"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="page-header d-flex justify-content-between mb-3">
        {/* Tên tiêu đề */}
        <h2 className="page-title">Quản lý Page: About Us</h2>

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary d-flex align-items-center gap-1"
            onClick={() => setShowAddModal(true)}
          >
            <IconPlus size={18} /> Thêm Section
          </button>
          {changed && (
            <>
              <button
                className="btn btn-success d-flex align-items-center gap-1"
                onClick={handleSaveOrder}
                disabled={saving}
              >
                <IconCheck size={18} />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                className="btn btn-danger d-flex align-items-center gap-1"
                onClick={handleCancelChanges}
              >
                <IconX size={18} /> Hủy thay đổi
              </button>
            </>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddSectionModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            fetchSections();
          }}
          mode="add"
          categories={categories}
        />
      )}

      {showEditModal && (
        <AddSectionModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            fetchSections();
          }}
          mode="edit"
          editData={editModalData}
          categories={categories}
        />
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                flex: 1,
                overflowY: "auto",
                paddingBottom: 20,
                backgroundColor: snapshot.isDraggingOver
                  ? "#f0f7ff"
                  : "transparent",
                borderRadius: 8,
              }}
            >
              {sections.map((section, index) => {
                const SectionComp = sectionComponents[section.type];

                return (
                  <Draggable
                    key={section.id.toString()}
                    draggableId={section.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      const isDragging = snapshot.isDragging;

                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className="card shadow-sm mb-3"
                            style={{
                              transform: isDragging ? "scale(0.7)" : "scale(1)",
                              border: isDragging
                                ? "2px dashed #0d6efd"
                                : "1px solid #e5e7eb",
                            }}
                          >
                            <div className="card-header d-flex justify-content-between align-items-center bg-light">
                              <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-primary">
                                  #{section.order}
                                </span>
                                <strong>{section.type}</strong>
                                <span className="text-muted ms-2 small">
                                  {section.title}
                                </span>
                              </div>

                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => showEditSection(section)}
                                >
                                  <IconEdit size={16} />
                                </button>

                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() =>
                                    handleDeleteSection(section.id)
                                  }
                                >
                                  <IconTrash size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="card-body p-2">
                              {SectionComp ? (
                                <SectionComp data={section} />
                              ) : (
                                <p className="text-muted fst-italic">
                                  Không có component hiển thị.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              {sections.length === 0 && (
                <div className="alert alert-warning text-center mt-3">
                  Chưa có Section nào cho trang About Us. Hãy nhấn "Thêm
                  Section" để bắt đầu!
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
