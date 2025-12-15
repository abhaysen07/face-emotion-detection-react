import React from "react";
import EmotionDetector from "../components/EmotionDetector";
import "../styles/detector.css";

export default function Detector() {
  return (
    <div className="detector-page">
      <h1 className="detector-title">Face Emotion Detector</h1>

      <p className="detector-sub">
        Real-time facial expression recognition using React and face-api.js
      </p>

      {/* Main layout container */}
      <div className="detector-container">
        <EmotionDetector />
      </div>
    </div>
  );
}
