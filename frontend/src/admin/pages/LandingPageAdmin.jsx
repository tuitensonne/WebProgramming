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

export default function LandingPageAdmin() {
  const navigate = useNavigate(); 
  const { showToast, showConfirm } = useContext(UIContext);
  const [sections, setSections] = useState([]);
  const [originalSections, setOriginalSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);

  const fetchSections = async () => {
    try {
      const res = await api.get("pages/1/sections");
      if (res.data?.success) {
        const sorted = res.data.data.sort((a, b) => a.order - b.order);
        setSections(sorted);
        setOriginalSections(sorted); // lưu bản gốc
      }
    } catch (err) {
      console.error("Error fetching sections:", err);
      showToast("Không thể tải danh sách section!", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

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
      console.error("Save failed:", error);
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
        console.error("Delete failed:", error);
        showToast("Có lỗi xảy ra khi xoá section!", "danger");
      }
    });
  };

  if (loading) return <LoadingComponent />;
  return (
    <div
      className="container-xl py-4"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div
        className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3"
        style={{ flexShrink: 0 }}
      >
        <h2 className="page-title mb-0 fw-bold text-primary">
          Quản lý các Section
        </h2>

        <div className="d-flex align-items-center gap-2">
          {changed && (
            <>
              <button
                className="btn btn-secondary d-flex align-items-center gap-1"
                onClick={handleCancelChanges}
              >
                <IconX size={18} /> Hủy thay đổi
              </button>

              <button
                className="btn btn-success d-flex align-items-center gap-1"
                disabled={saving}
                onClick={handleSaveOrder}
              >
                <IconCheck size={18} />{" "}
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </>
          )}

          <button className="btn btn-primary d-flex align-items-center gap-1">
            <IconPlus size={18} /> Thêm Section
          </button>
        </div>
      </div>

      {/* DRAG & DROP LIST */}
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
