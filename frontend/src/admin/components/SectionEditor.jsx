import { useState } from "react";
import api from "../../api/api";

export default function SectionEditor({ section, onClose, onSave }) {
  const [formData, setFormData] = useState(section);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`sections/${section.id}`, formData);
      onSave();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="modal modal-blur fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa Section #{section.id}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Loại</label>
                <input
                  type="text"
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Thứ tự</label>
                <input
                  type="number"
                  name="order"
                  className="form-control"
                  value={formData.order}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nội dung</label>
                <textarea
                  name="content"
                  className="form-control"
                  value={formData.content || ""}
                  onChange={handleChange}
                  rows={4}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Đóng
              </button>
              <button type="submit" className="btn btn-primary">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
