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
  IconGripVertical,
} from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import LoadingComponent from "../components/LoadingComponent";
import { ItemListingLayout } from "../../client/components/LandingPage/ItemListingLayout";
import { WhyChooseUsSection } from "../../client/components/LandingPage/WhyChooseUsSection";
import { LandingPageLayoutOne } from "../../client/components/LandingPage/LandingPageLayoutOne";
import { LandingPageLayoutTwo } from "../../client/components/LandingPage/LandingPageLayoutTwo";
import { LandingPageLayoutThree } from "../../client/components/LandingPage/LandingPageLayoutThree";

const sectionComponents = {
  why_choose_us: WhyChooseUsSection,
  content_type_one: LandingPageLayoutOne,
  content_type_two: LandingPageLayoutTwo,
  item_listing_layout: ItemListingLayout,
  content_type_three: LandingPageLayoutThree,
};

const layoutOptions = [
  {
    id: "why_choose_us",
    name: "Why Choose Us",
    description: "Section giới thiệu lý do chọn dịch vụ",
    image: "/images/layouts/why-choose-us.png",
    hasItems: true,
    defaultContent: {
      title: "Tại sao chọn chúng tôi?",
      subtitle: "",
      background_color: "",
    },
    itemFields: [
      { name: "icon", label: "Icon", type: "text", required: true },
      { name: "title", label: "Tiêu đề", type: "text", required: true },
      { name: "desc", label: "Mô tả", type: "textarea", required: true },
    ],
  },
  {
    id: "content_type_one",
    name: "Layout One",
    description: "Layout nội dung kiểu 1",
    image: "/images/layouts/layout-one.png",
    hasItems: true,
    defaultContent: {
      title: "",
      subtitle: "",
      background_color: "",
      image_url: "",
    },
    itemFields: [
      { name: "icon", label: "Icon/Emoji", type: "text", required: true },
      { name: "title", label: "Tiêu đề", type: "text", required: true },
      { name: "desc", label: "Mô tả", type: "textarea", required: true },
      { name: "color", label: "Màu", type: "color", required: false },
    ],
  },
  {
    id: "content_type_two",
    name: "Layout Two",
    description: "Layout nội dung kiểu 2",
    image: "/images/layouts/layout-two.png",
    hasItems: true,
    defaultContent: {},
    itemFields: [
      { name: "title", label: "Tiêu đề", type: "text", required: true },
      { name: "imageUrl", label: "URL Hình ảnh", type: "text", required: true },
      { name: "buttonText", label: "Text nút", type: "text", required: false },
    ],
  },
  {
    id: "item_listing_layout",
    name: "Item Listing",
    description: "Danh sách items/sản phẩm",
    image: "/images/layouts/item-listing.png",
    hasItems: false,
    defaultContent: {
      category_id: null,
    },
    itemFields: [],
  },
  {
    id: "content_type_three",
    name: "Layout Three",
    description: "Layout nội dung kiểu 3",
    image: "/images/layouts/layout-three.png",
    hasItems: false,
    defaultContent: {
      title: "",
      subtitle: "",
      description: "",
      background_color: "",
      image_url: "",
    },
    itemFields: [],
  },
];

const AddSectionModal = ({ show, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [sectionData, setSectionData] = useState({});
  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (show) {
      fetchCategories();
    }
  }, [show]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("tours/categories");
      if (res.data?.success) {
        console.log(res.data.data);
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedLayout(null);
    setSectionData({});
    setItems([]);
  };

  const handleClose = () => {
    resetModal();
    onClose();
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
    }
  };

  const handlePrevStep = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleContentChange = (field, value) => {
    setSectionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    const newItem = { id: Date.now(), order: items.length + 1 };
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

  const handleItemDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    const updated = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    setItems(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      console.log(sectionData, items);
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderContentForm = () => {
    if (!selectedLayout) return null;

    switch (selectedLayout.id) {
      case "why_choose_us":
        return (
          <div className="space-y-3">
            <div className="form-group mb-3">
              <label className="form-label required">Tiêu đề (Title)</label>
              <input
                type="text"
                className="form-control"
                value={sectionData.title || ""}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="VD: Tại sao nên chọn BKTours"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Phụ đề (Subtitle)</label>
              <input
                type="text"
                className="form-control"
                value={sectionData.subtitle || ""}
                onChange={(e) =>
                  handleContentChange("subtitle", e.target.value)
                }
                placeholder="Phụ đề (có thể để trống)"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Màu nền (Background Color)</label>
              <div className="input-group">
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={sectionData.background_color || "#ffffff"}
                  onChange={(e) =>
                    handleContentChange("background_color", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  value={sectionData.background_color || ""}
                  onChange={(e) =>
                    handleContentChange("background_color", e.target.value)
                  }
                  placeholder="#ffffff hoặc transparent"
                />
              </div>
            </div>
          </div>
        );

      case "content_type_one":
        return (
          <div className="space-y-3">
            <div className="form-group mb-3">
              <label className="form-label required">Tiêu đề (Title)</label>
              <input
                type="text"
                className="form-control"
                value={sectionData.title || ""}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="VD: Get Your Favourite Resort Bookings"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Phụ đề (Subtitle)</label>
              <input
                type="text"
                className="form-control"
                value={sectionData.subtitle || ""}
                onChange={(e) =>
                  handleContentChange("subtitle", e.target.value)
                }
                placeholder="VD: Fast & Easy"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Màu nền (Background Color)</label>
              <div className="input-group">
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={sectionData.background_color || "#ffffff"}
                  onChange={(e) =>
                    handleContentChange("background_color", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  value={sectionData.background_color || ""}
                  onChange={(e) =>
                    handleContentChange("background_color", e.target.value)
                  }
                  placeholder="VD: #d0d0d042"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label className="form-label">URL Hình ảnh (Image URL)</label>
              <input
                type="text"
                className="form-control"
                value={sectionData.image_url || ""}
                onChange={(e) =>
                  handleContentChange("image_url", e.target.value)
                }
                placeholder="https://images.unsplash.com/photo-xxx"
              />
            </div>
          </div>
        );

      case "content_type_two":
        return (
          <div className="space-y-3">
            <div className="alert alert-info">
              <strong>Layout này không có trường thông tin chung.</strong>
              <br />
              Bạn sẽ thêm các items ở bước tiếp theo.
            </div>
          </div>
        );

      case "item_listing_layout":
        return (
          <div className="space-y-3">
            <div className="form-group mb-3">
              <label className="form-label required">
                Chọn danh mục (Category)
              </label>
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
              <small className="form-hint">
                Section này sẽ hiển thị danh sách items thuộc danh mục được
                chọn.
              </small>
            </div>
          </div>
        );

      case "content_type_three":
        return (
          <div className="space-y-3">
            <div className="form-group mb-3">
              <label className="form-label required">Tiêu đề (Title)</label>
              <input
                type="text"
                className="form-control"
                value={sectionData.title || ""}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="VD: We Provide You Best Europe Sightseeing Tours"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Phụ đề (Subtitle)</label>
              <input
                type="text"
                className="form-control"
                value={sectionData.subtitle || ""}
                onChange={(e) =>
                  handleContentChange("subtitle", e.target.value)
                }
                placeholder="VD: PROMOTION"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Mô tả (Description)</label>
              <textarea
                className="form-control"
                rows="4"
                value={sectionData.description || ""}
                onChange={(e) =>
                  handleContentChange("description", e.target.value)
                }
                placeholder="Mô tả chi tiết về section này..."
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Màu nền (Background Color)</label>
              <div className="input-group">
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={sectionData.background_color || "#ffffff"}
                  onChange={(e) =>
                    handleContentChange("background_color", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  value={sectionData.background_color || ""}
                  onChange={(e) =>
                    handleContentChange("background_color", e.target.value)
                  }
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label className="form-label">URL Hình ảnh (Image URL)</label>
              <input
                type="text"
                className="form-control"
                value={sectionData.image_url || ""}
                onChange={(e) =>
                  handleContentChange("image_url", e.target.value)
                }
                placeholder="https://example.com/images/eiffel-tower.jpg"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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
          <DragDropContext onDragEnd={handleItemDragEnd}>
            <Droppable droppableId="items-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id.toString()}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="card mb-3"
                        >
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <div {...provided.dragHandleProps}>
                                <IconGripVertical
                                  size={20}
                                  className="text-muted"
                                  style={{ cursor: "grab" }}
                                />
                              </div>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    );
  };

  if (!show) return null;

  const totalSteps = selectedLayout?.hasItems ? 3 : 2;
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
              <h5 className="modal-title">Thêm Section Mới</h5>
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
                              style={{ minHeight: "120px" }}
                            >
                              <div className="text-muted">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-lg"
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
                                  />
                                  <rect
                                    x="4"
                                    y="4"
                                    width="16"
                                    height="16"
                                    rx="2"
                                  />
                                  <line x1="4" y1="10" x2="20" y2="10" />
                                  <line x1="10" y1="4" x2="10" y2="20" />
                                </svg>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon alert-icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <circle cx="12" cy="12" r="9" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                          <polyline points="11 12 12 12 12 16 13 16" />
                        </svg>
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
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <IconCheck size={18} className="me-1" />
                      Tạo
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

export default function LandingPageAdmin() {
  const navigate = useNavigate();
  const { showToast, showConfirm } = useContext(UIContext);
  const [sections, setSections] = useState([]);
  const [originalSections, setOriginalSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await api.get("pages/1/sections");
      if (res.data?.success) {
        const sorted = res.data.data.sort((a, b) => a.order - b.order);
        setSections(sorted);
        setOriginalSections(sorted);
      }
    } catch (err) {
      console.error(err);
      showToast("Không thể tải danh sách section!", "danger");
    } finally {
      setLoading(false);
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
          setChanged(true);
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

  const handleAddSection = async (data) => {
    try {
      const newOrder = sections.length + 1;
      const payload = {
        page_id: 1,
        section_type: data.section_type,
        order: newOrder,
        is_active: true,
        ...data.content,
      };

      const res = await api.post("/sections", payload);

      if (res.data?.success) {
        showToast("Đã thêm section mới thành công!", "success");
        fetchSections();
      } else {
        showToast("Thêm section thất bại!", "danger");
      }
    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra khi thêm section!", "danger");
    }
  };

  if (loading) return <LoadingComponent />;

  return (
    <div
      className="page-wrapper p-4"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div className="page-header d-flex justify-content-between mb-3">
        <h2 className="page-title">Quản lý các Section</h2>

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

      <AddSectionModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSection}
      />

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
                              </div>

                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() =>
                                    navigate(`/admin/sections/${section.id}`)
                                  }
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
                                  Không có component cho loại này.
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
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
