import Navbar from "./components/navbar";
import Home from "./pages/Home";
import "./App.css";
import React from "react";
import "./styles/Navbar.css";
import "./styles/Home.css";
// ... other imports

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="app-content">
        <Home />
      </main>
    </div>
  );
}
