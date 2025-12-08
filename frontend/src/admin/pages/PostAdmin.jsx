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
  IconSearch,
  IconMessage,
} from "@tabler/icons-react";

const ITEMS_PER_PAGE = 10;

// Sort Icons
const getSortIcon = (key, sortConfig) => {
  if (sortConfig.key !== key) return null;
  return sortConfig.direction === "asc" ? (
    <IconChevronUp size={16} className="ms-1" />
  ) : (
    <IconChevronDown size={16} className="ms-1" />
  );
};

export default function PostAdmin() {
  const { showToast, showConfirm } = useContext(UIContext);

  // Posts Management
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    readTime: 5,
    thumbnailUrl: "",
  });

  // Comments Management
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // ===== FETCH POSTS =====
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort: sortConfig.direction === "asc" ? "oldest" : "latest",
      };
      const res = await api.get("/posts", { params });
      if (res.data?.success) {
        setPosts(res.data.data.posts || []);
        setTotalPosts(res.data.data.total || 0);
      }
    } catch (error) {
      showToast("Lỗi khi tải bài viết", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchQuery, sortConfig]);

  // ===== HANDLE MODAL OPEN/CLOSE =====
  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title || "",
        description: post.description || "",
        location: post.location || "",
        readTime: post.readTime || 5,
        thumbnailUrl: post.thumbnailUrl || "",
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        description: "",
        location: "",
        readTime: 5,
        thumbnailUrl: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
  };

  // ===== HANDLE FORM SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Tiêu đề không được để trống", "danger");
      return;
    }

    try {
      if (editingPost) {
        // Update
        await api.put(`/admin/posts/${editingPost.id}`, formData);
        showToast("Cập nhật bài viết thành công!", "success");
      } else {
        // Create
        await api.post("/admin/posts", formData);
        showToast("Thêm bài viết thành công!", "success");
      }
      closeModal();
      setCurrentPage(1);
      fetchPosts();
    } catch (error) {
      showToast("Lỗi khi lưu bài viết", "danger");
    }
  };

  // ===== HANDLE DELETE POST =====
  const handleDeletePost = (post) => {
    showConfirm(
      `Bạn có chắc muốn xóa bài viết "${post.title}" không?`,
      async () => {
        try {
          await api.delete(`/admin/posts/${post.id}`);
          showToast("Xóa bài viết thành công!", "success");
          fetchPosts();
        } catch (error) {
          showToast("Lỗi khi xóa bài viết", "danger");
        }
      }
    );
  };

  // ===== FETCH COMMENTS FOR A POST =====
  const openCommentsModal = async (post) => {
    setSelectedPostForComments(post);
    setLoadingComments(true);
    try {
      const res = await api.get(`/posts/${post.id}/comments`);
      setComments(res.data?.data || []);
    } catch (error) {
      showToast("Lỗi khi tải bình luận", "danger");
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
    setShowCommentsModal(true);
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setSelectedPostForComments(null);
    setComments([]);
  };

  // ===== DELETE COMMENT =====
  const handleDeleteComment = (comment) => {
    showConfirm(`Xóa bình luận này?`, async () => {
      try {
        await api.delete(
          `/admin/posts/${selectedPostForComments.id}/comments/${comment.id}`
        );
        showToast("Xóa bình luận thành công!", "success");
        const res = await api.get(
          `/posts/${selectedPostForComments.id}/comments`
        );
        setComments(res.data?.data || []);
      } catch (error) {
        showToast("Lỗi khi xóa bình luận", "danger");
      }
    });
  };

  // ===== PAGINATION =====
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  if (loading && posts.length === 0) {
    return <LoadingComponent />;
  }

  return (
    <div className="page-wrapper">
      <div className="container-xl">
        {/* HEADER */}
        <div className="page-header d-print-none mb-4">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Quản Lý Bài Viết</h2>
            </div>
            <div className="col-auto">
              <button className="btn btn-primary" onClick={() => openModal()}>
                <IconPlus size={20} className="me-2" />
                Thêm Bài Viết
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className="input-group-text">
                <IconSearch size={18} />
              </span>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="card">
          <div className="table-responsive">
            <table className="table card-table table-vcenter">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    Tiêu Đề
                    <button
                      className="btn btn-sm btn-ghost-secondary"
                      onClick={() =>
                        setSortConfig({
                          key: "title",
                          direction:
                            sortConfig.direction === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      {getSortIcon("title", sortConfig)}
                    </button>
                  </th>
                  <th>Mô Tả</th>
                  <th>Địa Điểm</th>
                  <th>Thời Gian Đọc</th>
                  <th>Hình Ảnh</th>
                  <th>Ngày Tạo</th>
                  <th className="w-1">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id}>
                      <td className="text-muted">{post.id}</td>
                      <td>
                        <span
                          className="text-truncate d-block"
                          title={post.title}
                        >
                          {post.title}
                        </span>
                      </td>
                      <td>
                        <span
                          className="text-truncate d-block"
                          style={{ maxWidth: "150px" }}
                        >
                          {post.description?.substring(0, 50)}...
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-soft-blue">
                          {post.location}
                        </span>
                      </td>
                      <td>{post.readTime || 5} phút</td>
                      <td>
                        {post.thumbnailUrl && (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            style={{ maxWidth: "50px", maxHeight: "50px" }}
                            className="rounded"
                          />
                        )}
                      </td>
                      <td className="text-muted">
                        {post.createdAt?.split("T")[0]}
                      </td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button
                            className="btn btn-sm btn-ghost-info"
                            title="Xem Bình Luận"
                            onClick={() => openCommentsModal(post)}
                          >
                            <IconMessage size={18} />
                          </button>
                          <button
                            className="btn btn-sm btn-ghost-primary"
                            title="Sửa"
                            onClick={() => openModal(post)}
                          >
                            <IconEdit size={18} />
                          </button>
                          <button
                            className="btn btn-sm btn-ghost-danger"
                            title="Xóa"
                            onClick={() => handleDeletePost(post)}
                          >
                            <IconTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Không có bài viết nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Trang {currentPage} / {totalPages} ({totalPosts} bài viết)
                </small>
                <nav>
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <IconArrowLeft size={18} />
                        Trước
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Sau
                        <IconArrowRight size={18} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL: THÊM/SỬA BÀI VIẾT ===== */}
      {showModal && (
        <div
          className="modal modal-blur fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPost ? "Sửa Bài Viết" : "Thêm Bài Viết"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tiêu Đề *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Nhập tiêu đề bài viết"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mô Tả</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Nhập mô tả bài viết"
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Địa Điểm</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="VD: Đà Lạt, Hà Nội"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Thời Gian Đọc (phút)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.readTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            readTime: parseInt(e.target.value),
                          })
                        }
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">URL Hình Ảnh</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.thumbnailUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thumbnailUrl: e.target.value,
                        })
                      }
                      placeholder="https://..."
                    />
                    {formData.thumbnailUrl && (
                      <img
                        src={formData.thumbnailUrl}
                        alt="Preview"
                        style={{ maxWidth: "200px", marginTop: "10px" }}
                        className="rounded"
                      />
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-link link-secondary"
                    onClick={closeModal}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <IconCheck size={18} className="me-1" />
                    {editingPost ? "Cập Nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: QUẢN LÝ BÌNH LUẬN ===== */}
      {showCommentsModal && selectedPostForComments && (
        <div
          className="modal modal-blur fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Bình Luận - {selectedPostForComments.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeCommentsModal}
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {loadingComments ? (
                  <div className="text-center py-4">
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </span>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-top pt-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="fw-bold">
                              {comment.userName || "Ẩn danh"}
                            </div>
                            <small className="text-muted">
                              {new Date(comment.createdAt).toLocaleString(
                                "vi-VN"
                              )}
                            </small>
                          </div>
                          <button
                            className="btn btn-sm btn-ghost-danger"
                            onClick={() => handleDeleteComment(comment)}
                            title="Xóa bình luận"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                        <p className="mt-2 mb-0">{comment.content}</p>
                        <small className="text-muted">
                          {comment.likes || 0} lượt thích
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    Chưa có bình luận nào
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-link link-secondary"
                  onClick={closeCommentsModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
