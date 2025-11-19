import React, { useEffect, useState, useContext } from "react";
import { UIContext } from "../Layouts/AdminLayout";
import { IconCheck, IconX, IconDeviceDesktop } from "@tabler/icons-react";
import api from "../../api/api";
import Footer from "../../client/components/Footer";
import LoadingComponent from "../components/LoadingComponent";

export default function FooterAdmin() {
  const { showToast } = useContext(UIContext);
  const [footerData, setFooterData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [openPlacesModal, setOpenPlacesModal] = useState(false);
  const [places, setPlaces] = useState([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState([]);
  const [originalSelectedPlaceIds, setOriginalSelectedPlaceIds] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [placesLoading, setPlacesLoading] = useState(false);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await api.get("footers");
        if (res.data?.success) {
          setFooterData(res.data.data);
          setOriginalData(res.data.data);
          const placeIds = res.data.data.places?.map((p) => p.id) || [];
          setSelectedPlaceIds(placeIds);
          setOriginalSelectedPlaceIds(placeIds);
        }
      } catch (err) {
        console.error("Error fetching footer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  const fetchPlaces = async () => {
    setPlacesLoading(true);
    try {
      const res = await api.get("footers/places", {
        params: { keyword, page, limit: 10 },
      });
      if (res.data?.success) {
        setPlaces(res.data.data.items);
        setTotalPages(res.data.data.total_pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPlacesLoading(false);
    }
  };

  useEffect(() => {
    if (openPlacesModal) fetchPlaces();
  }, [openPlacesModal, page, keyword]);

  if (loading) return <LoadingComponent />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFooterData((prev) => ({ ...prev, [name]: value }));
    setChanged(true);
  };

  const placesChanged = () => {
    if (selectedPlaceIds.length !== originalSelectedPlaceIds.length)
      return true;
    return !selectedPlaceIds.every((id) =>
      originalSelectedPlaceIds.includes(id)
    );
  };

  const handleSaveFooter = async () => {
    try {
      setSaving(true);

      const promises = [];

      promises.push(api.put(`footers/${footerData.id}`, footerData));

      if (placesChanged()) {
        promises.push(
          api.put(`footers/${footerData.id}/places`, {
            place_ids: selectedPlaceIds,
          })
        );
      }
      const results = await Promise.all(promises);

      const allSuccess = results.every((res) => res.data?.success);

      if (allSuccess) {
        setOriginalData(footerData);
        setOriginalSelectedPlaceIds(selectedPlaceIds);
        setChanged(false);
        showToast("Đã lưu thay đổi Footer thành công!");
      } else {
        showToast("Lưu thất bại!", "danger");
      }
    } catch (err) {
      console.error(err);
      showToast("Có lỗi khi lưu!", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFooterData(originalData);
    setSelectedPlaceIds(originalSelectedPlaceIds);
    setChanged(false);
  };

  const togglePlaceSelect = (id) => {
    if (selectedPlaceIds.includes(id)) {
      setSelectedPlaceIds(selectedPlaceIds.filter((x) => x !== id));
    } else {
      if (selectedPlaceIds.length >= 4) return;
      setSelectedPlaceIds([...selectedPlaceIds, id]);
    }
  };

  const handleConfirmPlaces = async () => {
    const selectedPlaces = places.filter((p) =>
      selectedPlaceIds.includes(p.id)
    );
    setFooterData((prev) => ({
      ...prev,
      places: selectedPlaces,
    }));

    if (placesChanged()) {
      setChanged(true);
    }

    setOpenPlacesModal(false);
  };

  const devices = [
    {
      label: "Desktop",
      icon: <IconDeviceDesktop size={16} />,
      maxWidth: 1200,
      scale: 0.5,
      bg: "#1e293b",
    },
  ];

  return (
    <div
      className="page-body"
      style={{ background: "#f9fafb", minHeight: "100vh" }}
    >
      <div className="container-xl my-4">
        <div className="row g-4">
          {/* Left Form */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-header">
                <h3 className="card-title">Thông tin Footer</h3>
              </div>
              <div className="card-body">
                {[
                  { label: "Tên công ty", name: "company_name" },
                  { label: "Slogan", name: "slogan" },
                  { label: "Facebook Link", name: "facebook_link" },
                  { label: "Instagram Link", name: "instagram_link" },
                  { label: "Email", name: "email" },
                  { label: "Hotline", name: "hotline" },
                  { label: "Địa chỉ", name: "address" },
                ].map((item) => (
                  <div className="mb-3" key={item.name}>
                    <label className="form-label">{item.label}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={item.name}
                      value={footerData[item.name] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label">Địa điểm</label>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={() => setOpenPlacesModal(true)}
                  >
                    Chỉnh sửa những địa điểm đến
                  </button>
                </div>

                {changed && (
                  <div className="d-flex gap-2 mt-4">
                    <button
                      className="btn btn-success w-50 d-flex align-items-center justify-content-center"
                      onClick={handleSaveFooter}
                      disabled={saving}
                    >
                      <IconCheck size={18} className="me-1" />
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                      className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center"
                      onClick={handleCancel}
                    >
                      <IconX size={18} className="me-1" />
                      Huỷ thay đổi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Preview */}
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white text-center fw-bold">
                Live Preview Footer Desktop
              </div>
              <div
                className="card-body d-flex flex-wrap justify-content-center align-items-start gap-4"
                style={{
                  background: "#cececeff",
                  minHeight: "600px",
                  padding: 30,
                }}
              >
                {devices.map((device) => (
                  <div
                    key={device.label}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      width: device.maxWidth * device.scale + 40,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        background: "#ffffffff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: 15,
                      }}
                    >
                      <div
                        style={{
                          width: device.maxWidth,
                          transformOrigin: "top center",
                          transform: `scale(${device.scale})`,
                          background: "#fff",
                          boxShadow: "0 0 0 1px rgba(0,0,0,0.05) inset",
                        }}
                      >
                        <Footer
                          key={`${device.label}`}
                          data={{ ...footerData }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openPlacesModal && (
        <div
          className="modal modal-blur fade show d-block"
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chọn Places (tối đa 4)</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpenPlacesModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-3"
                  placeholder="Tìm kiếm..."
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setPage(1);
                  }}
                />

                {placesLoading ? (
                  <div className="text-center my-4">
                    <span className="spinner-border spinner-border-sm text-blue"></span>
                  </div>
                ) : (
                  <div
                    className="list-group"
                    style={{ maxHeight: 300, overflowY: "auto" }}
                  >
                    {places.map((place) => (
                      <label
                        key={place.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {place.city}, {place.country}
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedPlaceIds.includes(place.id)}
                          disabled={
                            !selectedPlaceIds.includes(place.id) &&
                            selectedPlaceIds.length >= 4
                          }
                          onChange={() => togglePlaceSelect(place.id)}
                        />
                      </label>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </button>
                  <span>
                    Page {page} / {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setOpenPlacesModal(false)}
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmPlaces}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
