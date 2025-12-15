/* ============================================================
   Page: About.jsx
   Author: Abhishek Kumar
   Description:
     - Simple About page for Emotion Detection Web App.
   ============================================================ */

import React from "react";

export default function About() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1>About</h1>
      <p>
        Emotion Detection Web App is a client-side AI project built using
        TensorFlow.js and face-api.js. It runs entirely in your browser without
        sending any data to a server.
      </p>

      <p>Created by <strong>Abhishek Kumar</strong>.</p>
    </div>
  );
}
