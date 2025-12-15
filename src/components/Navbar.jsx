/* ============================================================
   Component: Navbar.jsx
   Project: Emotion Detection Web App
   Author: Abhishek Kumar
   Role: Developer
   Description:
     - Router-aware navigation bar using react-router-dom NavLink.
     - Shows active state and uses the existing Navbar.css for styling.
   ============================================================ */

import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link" end>
            <strong>Emotion Detection</strong>
          </NavLink>
        </div>

        {/* Navigation Buttons (route links) */}
        <nav className="navbar-links" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/detector"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
          >
            Detector
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
          >
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
