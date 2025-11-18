// src/components/Header.jsx
import React from "react";
import {
  IconHome,
  IconCube,
  IconCheckbox,
  IconStar,
  IconLayoutBoard,
  IconPuzzle,
  IconGift,
  IconHelpCircle,
  IconBell,
} from "@tabler/icons-react";

export default function Header() {
  return (
    <div className="navbar navbar-expand-md navbar-light bg-white border-bottom">
      <div className="container-fluid">
        {/* Logo */}
        <a href="#" className="navbar-brand d-flex align-items-center gap-2">
          <img src="/path-to-your-logo.png" alt="Logo" className="me-2" style={{height: '32px'}} />
        </a>

        {/* Navbar links */}
        <ul className="navbar-nav me-auto mb-2 mb-md-0">
          <li className="nav-item">
            <a className="nav-link active" href="#"><IconHome size={16} /> Home</a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              <IconCube size={16} /> Interface
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">Sub-item 1</a></li>
              <li><a className="dropdown-item" href="#">Sub-item 2</a></li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              <IconCheckbox size={16} /> Forms
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">Sub-item A</a></li>
              <li><a className="dropdown-item" href="#">Sub-item B</a></li>
            </ul>
          </li>
          <li className="nav-item"><a className="nav-link" href="#"><IconStar size={16} /> Extra</a></li>
          <li className="nav-item"><a className="nav-link" href="#"><IconLayoutBoard size={16} /> Layout</a></li>
          <li className="nav-item"><a className="nav-link" href="#"><IconPuzzle size={16} /> Plugins</a></li>
          <li className="nav-item"><a className="nav-link" href="#"><IconGift size={16} /> Addons</a></li>
          <li className="nav-item"><a className="nav-link" href="#"><IconHelpCircle size={16} /> Help</a></li>
        </ul>

        {/* Right section */}
        <div className="d-flex align-items-center gap-2">
          <button className="btn  btn-icon"><IconBell size={20} /></button>
          <div className="d-flex align-items-center gap-2">
            <img src="/path-to-user-avatar.jpg" alt="User" className="avatar rounded-circle" style={{height: '32px'}} />
            <div className="d-flex flex-column">
              <span className="fw-medium">Paweł Kuna</span>
              <span className="text-muted small">UI Designer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
