import {} from "@tabler/icons-react";

export default function AdminHeader({ onToggleSidebar }) {
  return (
    <header className="navbar navbar-expand-md d-print-none sticky-top">
      <div className="container-xl">
        {/* Nút toggle menu cho mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
          <a href="#">Tours Admin</a>
        </h1>
      </div>
    </header>
  );
}
