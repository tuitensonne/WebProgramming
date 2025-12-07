import React, { useEffect, useState, useContext } from "react";
import {
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconSearch,
  IconSquare,
  IconSquareCheck,
  IconArrowForward,
  IconMailOpenedFilled,
  IconMailFilled,
} from "@tabler/icons-react";
import api from "../../api/api";
import { UIContext } from "../Layouts/AdminLayout";

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination] = useState({
    limit: 10,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { showToast, showConfirm } = useContext(UIContext);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyData, setReplyData] = useState({
    to: selected?.email || "",
    subject: selected ? "Re: " + selected.title : "",
    body: "",
  });

  const fetchData = async (page = currentPage, limit = pagination.limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        offset: (page - 1) * limit,
        limit,
        search,
      });

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      const res = await api.get(`/contacts?${params.toString()}`);
      const data = res.data.data;

      setMessages(data.items || []);
      setTotalPages(data.total_pages || 1);
      setTotalItems(data.total_items || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchData(1);
  }, []);

  const updateReadStatus = async (id, status) => {
    try {
      await api.put(`/contacts/${id}/status`, { status });

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, isRead: status } : msg))
      );

      showToast("Cập nhật trạng thái thành công!", "success");
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi cập nhật trạng thái!", "danger");
    }
  };

  const deleteMessage = (id) => {
    showConfirm("Bạn có chắc muốn xóa contact này không?", async () => {
      try {
        const res = await api.delete(`/contacts/${id}`);
        if (res.data?.success) {
          fetchData(currentPage);
          setSelected(null);
          showToast("Đã xoá contact thành công!", "success");
        } else {
          showToast("Xoá thất bại!", "danger");
        }
      } catch (err) {
        console.error(err);
        showToast("Có lỗi xảy ra khi xoá contact!", "danger");
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === messages.length ? [] : messages.map((m) => m.id)
    );
  };

  const handleSelectOne = (id, e) => {
    e.stopPropagation();
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    showConfirm(
      `Bạn có chắc muốn xóa ${selectedIds.length} contact đã chọn?`,
      async () => {
        try {
          await Promise.all(
            selectedIds.map((id) => api.delete(`/contacts/${id}`))
          );
          fetchData(currentPage);
          setSelectedIds([]);
          setSelected(null);
          showToast("Đã xoá các contact thành công!", "success");
        } catch (err) {
          console.error(err);
          showToast("Có lỗi xảy ra khi xoá!", "danger");
        }
      }
    );
  };

  const sendReply = async () => {
    setSending(true);

    try {
      await api.post(`/contacts/${selected.id}/replyMail`, {
        to: selected.email,
        subject: replyData.subject,
        body: replyData.body,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === selected.id ? { ...msg, isReplied: "replied" } : msg
        )
      );

      showToast("Đã gửi phản hồi!", "success");
      setShowReplyModal(false);
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi gửi phản hồi!", "danger");
    } finally {
      setSending(false);
    }
  };

  const handleMessageClick = (msg) => {
    setSelected(msg);
    if (msg.isRead === "unread") {
      updateReadStatus(msg.id, "read");
    }
  };

  const getRowBgClass = (msg) => {
    if (selectedIds.includes(msg.id)) return "bg-blue-lt";
    return msg.isRead === "unread" ? "bg-white" : "bg-gray-200";
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
    });
  };

  if (selected) {
    return (
      <div className="container-fluid p-2 p-md-4">
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-3 mb-md-4 gap-2">
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => setSelected(null)}
              className="btn btn-ghost-secondary btn-icon rounded-circle"
            >
              <IconChevronLeft size={20} />
            </button>
            <h5 className="mb-0 fw-bold">Chi tiết liên hệ</h5>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => deleteMessage(selected.id)}
          >
            <IconTrash size={18} className="me-1" />
            <span className="d-none d-sm-inline">Xoá</span>
          </button>
        </div>

        <div className="bg-white rounded shadow-sm p-3 p-md-4">
          <h4 className="mb-3 mb-md-4 fs-5 fs-md-4">{selected.title}</h4>

          <div className="d-flex flex-column flex-sm-row align-items-start mb-3 mb-md-4 gap-3">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: "50px", height: "50px", fontSize: "20px" }}
            >
              {selected.fullName.charAt(0)}
            </div>
            <div className="flex-grow-1 w-100">
              <div className="fw-bold">{selected.fullName}</div>
              {selected.email && (
                <div className="text-muted small text-break">
                  &lt;{selected.email}&gt;
                </div>
              )}
              {selected.phone && (
                <div className="text-muted small mt-1">{selected.phone}</div>
              )}
              <div className="text-muted small mt-2 d-sm-none">
                {new Date(selected.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="text-muted small d-none d-sm-block flex-shrink-0">
              {new Date(selected.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>

          <div
            className="mb-3 mb-md-4"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {selected.message}
          </div>

          <div className="d-flex flex-column flex-sm-row gap-2">
            <button
              onClick={() => setShowReplyModal(true)}
              className="btn btn-outline-secondary rounded-pill d-flex align-items-center justify-content-center gap-2"
            >
              <IconArrowForward size={18} />
              Trả lời
            </button>
          </div>
        </div>
        {showReplyModal && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Trả lời liên hệ</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowReplyModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Email người nhận</label>
                    <input
                      type="email"
                      className="form-control"
                      value={selected.email}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input
                      type="text"
                      className="form-control"
                      value={replyData.subject}
                      onChange={(e) =>
                        setReplyData({ ...replyData, subject: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nội dung</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={replyData.body}
                      onChange={(e) =>
                        setReplyData({ ...replyData, body: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowReplyModal(false)}
                    disabled={sending}
                  >
                    Hủy
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={sendReply}
                    disabled={sending}
                  >
                    {sending ? "Đang gửi..." : "Gửi"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Quản lý liên hệ</h2>
      </div>

      <div
        className="bg-white rounded shadow-sm"
        style={{
          height: "calc(100vh - 180px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="p-3 border-bottom">
          <div className="position-relative">
            <IconSearch
              size={20}
              className="position-absolute text-muted"
              style={{
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm liên hệ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control rounded-pill"
              style={{
                backgroundColor: "#f1f3f4",
                paddingLeft: "46px",
              }}
            />
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="btn btn-ghost-secondary btn-icon"
            >
              {selectedIds.length === messages.length && messages.length > 0 ? (
                <IconSquareCheck size={20} />
              ) : (
                <IconSquare size={20} />
              )}
            </button>

            <button
              onClick={() => fetchData(currentPage)}
              className="btn btn-ghost-secondary btn-icon"
            >
              <IconRefresh size={20} />
            </button>

            {selectedIds.length > 0 && (
              <>
                <div className="vr"></div>
                <button
                  onClick={handleBulkDelete}
                  className="btn btn-ghost-danger btn-icon"
                >
                  <IconTrash size={20} />
                </button>
              </>
            )}
          </div>

          <div className="d-flex align-items-center gap-3">
            <small className="text-muted">
              {(currentPage - 1) * pagination.limit + 1}-
              {Math.min(currentPage * pagination.limit, totalItems)} trong số{" "}
              {totalItems}
            </small>
            <button
              disabled={currentPage === 1}
              onClick={() => fetchData(currentPage - 1)}
              className="btn btn-ghost-secondary btn-icon"
            >
              <IconChevronLeft size={20} />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => fetchData(currentPage + 1)}
              className="btn btn-ghost-secondary btn-icon"
            >
              <IconChevronRight size={20} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div className="text-center py-5">Đang tải...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Không có liên hệ nào
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleMessageClick(msg)}
                className={`d-flex align-items-center px-2 py-2 border-bottom cursor-pointer ${getRowBgClass(
                  msg
                )}`}
                style={{
                  transition: "box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  e.currentTarget.style.zIndex = "10";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.zIndex = "auto";
                }}
              >
                <button
                  onClick={(e) => handleSelectOne(msg.id, e)}
                  className="btn btn-ghost-secondary btn-icon"
                >
                  {selectedIds.includes(msg.id) ? (
                    <IconSquareCheck size={20} />
                  ) : (
                    <IconSquare size={20} />
                  )}
                </button>

                <div className="flex-grow-1 ms-2" style={{ minWidth: 0 }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div
                      className={`text-truncate me-2 ${
                        msg.isRead === "unread"
                          ? "fw-bold text-dark"
                          : "text-dark"
                      }`}
                      style={{ maxWidth: "70%" }}
                    >
                      {msg.fullName}
                    </div>

                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      {msg.isReplied === "replied" && (
                        <span className="badge bg-success-subtle text-success small">
                          Đã phản hồi
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="d-grid align-items-center"
                    style={{
                      gridTemplateColumns: "1fr auto auto",
                      gap: "8px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      className="small text-truncate text-dark"
                      style={{ minWidth: 0 }}
                    >
                      <span className={"fw-semibold text-dark"}>
                        {msg.title}
                      </span>{" "}
                      {msg.message}
                    </div>

                    <button
                      className="btn btn-icon btn-ghost-secondary p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateReadStatus(
                          msg.id,
                          msg.isRead === "unread" ? "read" : "unread"
                        );
                      }}
                    >
                      {msg.isRead === "unread" ? (
                        <IconMailFilled size={18} />
                      ) : (
                        <IconMailOpenedFilled size={18} />
                      )}
                    </button>

                    <small
                      className="text-dark text-nowrap"
                      style={{ width: "50px" }}
                    >
                      {formatTime(msg.createdAt)}
                    </small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
