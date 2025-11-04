import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="page">
      {/* Sidebar */}
      <aside className="navbar navbar-vertical navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin">Dashboard</Link>
          <ul className="navbar-nav pt-lg-3">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/landing-page">
                <span className="nav-link-title">Landing Page Sections</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main */}
      <div className="page-wrapper">
        <div className="page-header">
          <h2 className="page-title">Quản lý Landing Page</h2>
        </div>

        <div className="page-body container-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
