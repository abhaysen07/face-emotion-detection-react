// src/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function AppLayout() {
  return (
    <div>
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
