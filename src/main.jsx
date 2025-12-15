// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";

// pages
import Home from "./pages/Home";
import Detector from "./pages/Detector";
import About from "./pages/about";

import "./styles/Home.css";
import "./styles/Navbar.css";
import "./App.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="detector" element={<Detector />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
