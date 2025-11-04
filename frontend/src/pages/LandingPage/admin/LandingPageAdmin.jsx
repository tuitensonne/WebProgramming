import { useEffect, useState } from "react";
import api from "../../../api/api";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import LoadingComponent from "../../../components/LoadingComponent";
import SectionEditor from "../../../components/LandingPage/SectionEditor";

export default function LandingPageAdmin() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);

  const fetchSections = async () => {
    try {
      const res = await api.get("pages/1/sections");
      if (res.data?.success) {
        setSections(res.data.data); 
      } else {
        console.error("Failed to fetch sections:", res.data);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa section này?")) return;
    await api.delete(`sections/${id}`);
    fetchSections();
  };

  if (loading) return <LoadingComponent />;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="card-title">Danh sách các section</h3>
        <button className="btn btn-primary">
          <IconPlus size={16} /> Thêm Section
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Loại</th>
              <th>Thứ tự</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.type}</td>
                <td>{s.order}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => handleEdit(s)}
                  >
                    <IconEdit size={16} />
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(s.id)}
                  >
                    <IconTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form chỉnh sửa section */}
      {editingSection && (
        <SectionEditor
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSave={fetchSections}
        />
      )}
    </div>
  );
}
