/* ============================================================
   Page: Home.jsx
   Project: Emotion Detection Web App
   Author: Abhishek Kumar
   Role: Founder & Developer
   Date: 2025-10-XX
   Description:
     - Main landing page for the Emotion Detection application.
     - Content-oriented: Hero, Features, How it Works, Quick Start.
     - Uses a separate CSS file: ../styles/Home.css
   Notes:
     - CTA "Open Detector" uses `window.location.hash = "#detector"`
       so it can be handled later by Router or by simple hash-check.
   ============================================================ */

import React from "react";
import "../styles/Home.css";
import "../styles/Navbar.css";
import "../App.css";

export default function Home() {
  function openDetector() {
    // simple navigation pattern (replace with router later if needed)
    window.location.hash = "#detector";
    // optional: if you plan to use state-based navigation, call callback instead
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Welcome to Emotion Detection</h1>
          <p className="hero-sub">
            Real-time emotion recognition in your browser using TensorFlow.js and face-api.js.
            Fast, private (on-device), and easy to use — no server required.
          </p>

          <div className="hero-actions">
            <button className="btn primary" onClick={openDetector}>
              Open Detector
            </button>
            <a className="btn outline" href="#about" aria-label="Read more about the project">
              Learn more
            </a>
          </div>
        </div>

        <div className="hero-image">
          {/* Replace with an actual image in public/images/hero.png if you like */}
          <div className="hero-placeholder">🎥 Webcam • AI • Browser</div>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Features</h2>
        <div className="cards">
          <article className="card">
            <h3>Client-side AI</h3>
            <p>All processing runs in your browser using TensorFlow.js — no uploads, full privacy.</p>
          </article>

          <article className="card">
            <h3>Real-time Detection</h3>
            <p>Detects face, landmarks, and classifies emotions live from your webcam feed.</p>
          </article>

          <article className="card">
            <h3>Lightweight Models</h3>
            <p>Uses tiny models for low-latency inference — works on most modern laptops and phones.</p>
          </article>
        </div>
      </section>

      <section className="howitworks" id="about">
        <h2>How it works</h2>
        <ol>
          <li>Grant camera access from your browser (secure origin required: localhost or HTTPS).</li>
          <li>The app loads pretrained models from <code>/models</code> (placed in <code>public/models</code>).</li>
          <li>face-api.js performs face detection + landmark extraction + expression prediction.</li>
          <li>Results are drawn on a canvas overlay and shown in the Detector panel.</li>
        </ol>
      </section>

      <section className="quick-start">
        <h2>Quick start</h2>
        <ul>
          <li>Make sure the model files exist in <code>public/models</code>.</li>
          <li>Open the detector (click "Open Detector") and allow camera permission.</li>
          <li>Try different expressions and see live labels and snapshots.</li>
        </ul>
      </section>

      <footer className="home-footer">
        <div>© {new Date().getFullYear()} Abhishek Kumar — Emotion Detection Web App</div>
      </footer>
    </div>
  );
}
