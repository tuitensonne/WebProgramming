// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { IconCube, IconCheckbox, IconChevronDown } from "@tabler/icons-react";
import { authUtils } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
export default function Header() {
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { userData } = authUtils.getAuth();
  const isAuthenticated = authUtils.isAuthenticated();

  const handleLogout = () => {
    authUtils.clearAuth();
    authUtils.navigateToApp("/");
    setMobileMenuOpen(false);
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await api.get("footers");
        console.log(res.data);
        if (res.data?.success) {
          console.log(res.data.data.logo_url);
          setLogoUrl(res.data.data.logo_url);
        } else {
          console.error("Failed to fetch sections:", res.data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="navbar navbar-expand-md navbar-light d-print-none">
        <div className="container-xl">
          <button
            className="navbar-toggler d-md-none"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a
              role="button"
              className="pe-0"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <img
                  src={logoUrl}
                  alt="Logo"
                  height="32"
                  className="navbar-brand-image"
                />
              )}
            </a>
          </h1>

          <div className="navbar-nav flex-row order-md-last d-none d-md-flex">
            {isAuthenticated && userData ? (
              <div className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link d-flex lh-1 text-reset p-0"
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <span
                    className="avatar avatar-sm"
                    style={{
                      backgroundImage: `url(${
                        userData.avatarUrl || "/default-avatar.png"
                      })`,
                    }}
                  ></span>
                  <div className="d-none d-xl-block ps-2">
                    <div>{userData.fullName}</div>
                    <div className="mt-1 small text-muted">
                      {userData.role || userData.email}
                    </div>
                  </div>
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <a className="dropdown-item" href="/profile">
                    Hồ sơ cá nhân
                  </a>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <a href="/login" className="btn btn-primary">
                Đăng nhập
              </a>
            )}
          </div>

          <div
            className="collapse navbar-collapse d-none d-md-block"
            id="navbar-menu"
          >
            <div>
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#navbar-base"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    role="button"
                    aria-expanded="false"
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <IconCube size={24} stroke={2} />
                    </span>
                    <span className="nav-link-title">Các trang</span>
                  </a>
                  <div className="dropdown-menu">
                    <div className="dropdown-menu-columns">
                      <div className="dropdown-menu-column">
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            navigate("/admin/home-page");
                          }}
                        >
                          Trang chủ
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            navigate("/admin/about-us");
                          }}
                        >
                          Về công ty
                        </button>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#navbar-forms"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    role="button"
                    aria-expanded="false"
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <IconCheckbox size={24} stroke={2} />
                    </span>
                    <span className="nav-link-title">
                      Thông tin của công ty
                    </span>
                  </a>
                  <div className="dropdown-menu">
                    <div className="dropdown-menu-columns">
                      <div className="dropdown-menu-column">
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            navigate("/admin/footer");
                          }}
                        >
                          Cuối trang
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            navigate("/admin/contact");
                          }}
                        >
                          Liên hệ
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            navigate("/admin/faqs");
                          }}
                        >
                          Hỏi/Đáp (FAQ)
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            navigate("/admin/users");
                          }}
                        >
                          Người dùng
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={closeMobileMenu}
        ></div>
      )}

      <div
        className={`offcanvas offcanvas-start ${mobileMenuOpen ? "show" : ""}`}
        tabIndex="-1"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button
            type="button"
            className="btn-close"
            onClick={closeMobileMenu}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {isAuthenticated && userData && (
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <span
                    className="avatar avatar-md me-3"
                    style={{
                      backgroundImage: `url(${
                        userData.avatarUrl || "/default-avatar.png"
                      })`,
                    }}
                  ></span>
                  <div>
                    <div className="fw-bold">{userData.fullName}</div>
                    <div className="text-muted small">
                      {userData.role || userData.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="list-group list-group-transparent mb-3">
            <div>
              <a
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("interface");
                }}
              >
                <span>
                  <span className="me-2">
                    <IconCube size={20} stroke={2} />
                  </span>
                  Các trang
                </span>
                <IconChevronDown
                  size={16}
                  style={{
                    transform:
                      openDropdown === "interface"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </a>
              {openDropdown === "interface" && (
                <div className="list-group ms-4">
                  <button
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      navigate("/admin/home-page");
                    }}
                  >
                    Trang chủ
                  </button>
                  <button
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      navigate("/admin/about-us");
                    }}
                  >
                    Về công ty
                  </button>
                </div>
              )}
            </div>

            <div>
              <a
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("forms");
                }}
              >
                <span>
                  <span className="me-2">
                    <IconCheckbox size={20} stroke={2} />
                  </span>
                  Thông tin của công ty
                </span>
                <IconChevronDown
                  size={16}
                  style={{
                    transform:
                      openDropdown === "forms"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </a>
              {openDropdown === "forms" && (
                <div className="list-group ms-4">
                  <button
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      navigate("/admin/footer");
                    }}
                  >
                    Cuối trang
                  </button>
                  <button
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      navigate("/admin/contact");
                    }}
                  >
                    Liên hệ
                  </button>
                  <button
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      navigate("/admin/faqs");
                    }}
                  >
                    Hỏi/Đáp (FAQ)
                  </button>
                  <button
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      navigate("/admin/users");
                    }}
                  >
                    Người dùng
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-3 border-top">
            {isAuthenticated && userData ? (
              <>
                <a
                  href="/profile"
                  className="btn btn-outline-primary w-100 mb-2"
                >
                  Hồ sơ cá nhân
                </a>
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <a href="/login" className="btn btn-primary w-100">
                Đăng nhập
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Mobile Logo Center */
        @media (max-width: 767.98px) {
          .navbar-brand {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        /* Offcanvas Mobile Menu */
        .offcanvas {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1050;
          width: 320px;
          max-width: 85vw;
          background-color: var(--tblr-bg-surface);
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          visibility: hidden;
        }

        .offcanvas.show {
          transform: translateX(0);
          visibility: visible;
        }

        .offcanvas-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1040;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .offcanvas-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--tblr-border-color);
        }

        .offcanvas-body {
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          overflow-y: auto;
          flex-grow: 1;
        }

        .offcanvas-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        /* Desktop only */
        @media (min-width: 768px) {
          .offcanvas,
          .offcanvas-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
