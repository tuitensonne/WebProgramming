import { Link, useLocation } from "react-router-dom";
import {
  IconDashboard,
  IconUsers,
  IconMapSearch,
  IconCategory,
  IconCalendarEvent,
  IconNotes,
  IconPhoto,
  IconHome,
  IconFlag3,
  IconBuilding,
  IconUser,
  IconBell,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <IconDashboard size={20} />, path: "/admin" },
    {
      label: "Quản lý Người dùng",
      icon: <IconUsers size={20} />,
      path: "/admin/users",
    },
    {
      label: "Quản lý Tour",
      icon: <IconMapSearch size={20} />,
      path: "/admin/tours",
    },
    {
      label: "Danh mục Tour",
      icon: <IconCategory size={20} />,
      path: "/admin/tour-categories",
    },
    {
      label: "Lịch trình Tour",
      icon: <IconCalendarEvent size={20} />,
      path: "/admin/tour-itineraries",
    },
    {
      label: "Quản lý Bài viết",
      icon: <IconNotes size={20} />,
      path: "/admin/posts",
    },
    {
      label: "Quản lý Media",
      icon: <IconPhoto size={20} />,
      path: "/admin/media",
    },
    {
      label: "Trang chủ / Sections",
      icon: <IconHome size={20} />,
      path: "/admin/landing-page",
    },
    {
      label: "Quản lý Banner",
      icon: <IconFlag3 size={20} />,
      path: "/admin/banners",
    },
    {
      label: "Quản lý Footer",
      icon: <IconBuilding size={20} />,
      path: "/admin/footer",
    },
  ];

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        className="btn btn-dark d-md-none position-fixed m-3 z-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#adminSidebar"
      >
        <IconMenu2 size={24} />
      </button>

      {/* SIDEBAR */}
      <div
        className="offcanvas offcanvas-start bg-dark text-white"
        tabIndex="-1"
        id="adminSidebar"
        style={{ width: "260px" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Tours Admin</h5>

          <button
            type="button"
            className="btn btn-dark"
            data-bs-dismiss="offcanvas"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  to={item.path}
                  className={
                    "nav-link text-white d-flex align-items-center gap-2 " +
                    (location.pathname === item.path ? "active fw-bold" : "")
                  }
                  data-bs-dismiss="offcanvas"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* FOOTER MENU */}
          <div className="mt-auto pt-3 border-top border-secondary">
            <a className="nav-link text-white d-flex align-items-center gap-2">
              <IconBell size={20} />
              Thông báo
            </a>

            <div className="dropup mt-3">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-2 text-white"
                data-bs-toggle="dropdown"
                href="#"
              >
                <span className="avatar avatar-sm bg-secondary">
                  <IconUser size={18} />
                </span>
                Admin
              </a>

              <div className="dropdown-menu dropdown-menu-end">
                <a className="dropdown-item">Hồ sơ</a>
                <a className="dropdown-item">Cài đặt</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item">Đăng xuất</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside
        className="bg-dark text-white d-none d-md-flex flex-column p-3"
        style={{
          width: "260px",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <h4 className="text-white mb-4">Tours Admin</h4>

        {/* MAIN MENU */}
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                to={item.path}
                className={
                  "nav-link text-white d-flex align-items-center gap-2 " +
                  (location.pathname === item.path ? "active fw-bold" : "")
                }
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <div className="mt-auto pt-3 border-top border-secondary">
          <a className="nav-link text-white d-flex align-items-center gap-2">
            <IconBell size={20} />
            Thông báo
          </a>

          <div className="dropup mt-3">
            <a
              className="nav-link dropdown-toggle d-flex align-items-center gap-2 text-white"
              data-bs-toggle="dropdown"
              href="#"
            >
              <span className="avatar avatar-sm bg-secondary">
                <IconUser size={18} />
              </span>
              Admin
            </a>

            <div className="dropdown-menu dropdown-menu-end">
              <a className="dropdown-item">Hồ sơ</a>
              <a className="dropdown-item">Cài đặt</a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item">Đăng xuất</a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
