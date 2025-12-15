import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "./Webcam";

export default function EmotionDetector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const runningRef = useRef(false);
  const modelsLoadedRef = useRef(false);

  const [status, setStatus] = useState("Loading AI models...");
  const [emotion, setEmotion] = useState("—");
  const [emoji, setEmoji] = useState("🙂");

  /* =========================================================
     1. LOAD MODELS (SSD + LANDMARKS + EXPRESSIONS)
  ========================================================= */
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";

        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        modelsLoadedRef.current = true;
        setStatus("Models loaded. Waiting for camera...");
      } catch (err) {
        console.error(err);
        setStatus("Failed to load models");
      }
    };

    loadModels();

    return () => {
      runningRef.current = false;
    };
  }, []);

  /* =========================================================
     2. CAMERA READY (START ONLY IF MODELS READY)
  ========================================================= */
  const handleVideoReady = (video) => {
    if (!modelsLoadedRef.current) {
      setStatus("Models not ready yet...");
      return;
    }

    if (runningRef.current) return;

    videoRef.current = video;
    runningRef.current = true;

    setStatus("Detecting expressions...");
    detectLoop();
  };

  /* =========================================================
     3. EMOTION → EMOJI
  ========================================================= */
  const emotionToEmoji = (emotion, score) => {
    if (emotion === "happy" && score > 0.8) return "😂";
    if (emotion === "happy") return "😄";
    if (emotion === "sad") return "😢";
    if (emotion === "angry") return "😠";
    if (emotion === "surprised") return "😲";
    if (emotion === "fearful") return "😨";
    if (emotion === "neutral") return "😐";
    return "🙂";
  };

  /* =========================================================
     4. DETECTION LOOP (1 FPS = stable)
  ========================================================= */
  const detectLoop = async () => {
    if (!runningRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === 4) {
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      canvas.width = displaySize.width;
      canvas.height = displaySize.height;
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi
        .detectSingleFace(video, new faceapi.SsdMobilenetv1Options({
          minConfidence: 0.4, // VERY sensitive but stable
        }))
        .withFaceLandmarks()
        .withFaceExpressions();

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections) {
        const resized = faceapi.resizeResults(detections, displaySize);
        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);

        const expressions = detections.expressions;
        const [dominant, confidence] = Object.entries(expressions)
          .sort((a, b) => b[1] - a[1])[0];

        setEmotion(dominant);
        setEmoji(emotionToEmoji(dominant, confidence));
      } else {
        setEmotion("No face");
        setEmoji("❓");
      }
    }

    // 🔁 detect once per second (smooth & accurate)
    setTimeout(detectLoop, 1000);
  };

  /* =========================================================
     5. RENDER
  ========================================================= */
  return (
    <div className="detector-inner">
      <div className="webcam-box" style={{ position: "relative" }}>
        <Webcam onReady={handleVideoReady} />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            pointerEvents: "none",
          }}
        />
      </div>

      <div className="result-box">
        <h3>Detection Results</h3>
        <div><strong>Status:</strong> {status}</div>
        <div><strong>Emotion:</strong> {emotion} {emoji}</div>
      </div>
    </div>
  );
}
