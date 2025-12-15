import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "./Webcam";

export default function EmotionDetector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [status, setStatus] = useState("Loading models...");
  const [emotion, setEmotion] = useState("—");
  const [emoji, setEmoji] = useState("🙂");

  /* =========================================================
     1. LOAD MODELS (ONCE)
  ========================================================= */
  useEffect(() => {
    let cancelled = false;

    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";

        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        if (!cancelled) {
          setModelsLoaded(true);
          setStatus("Models loaded. Waiting for camera...");
        }
      } catch (err) {
        console.error("Model load error:", err);
        setStatus("Failed to load models");
      }
    };

    loadModels();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* =========================================================
     2. CAMERA READY CALLBACK
  ========================================================= */
  const handleVideoReady = (video) => {
    videoRef.current = video;
    setCameraReady(true);
  };

  /* =========================================================
     3. START DETECTION (ONLY WHEN SAFE)
  ========================================================= */
  useEffect(() => {
    if (!modelsLoaded || !cameraReady) return;

    setStatus("Detecting expressions...");
    detectLoop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [modelsLoaded, cameraReady]);

  /* =========================================================
     4. EMOJI MAPPER
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
     5. DETECTION LOOP (SSD Mobilenet)
  ========================================================= */
  const detectLoop = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== 4) {
      rafRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight,
    };

    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    faceapi.matchDimensions(canvas, displaySize);

    const detections = await faceapi
      .detectAllFaces(
        video,
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 })
      )
      .withFaceLandmarks()
      .withFaceExpressions();

    const resized = faceapi.resizeResults(detections, displaySize);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceLandmarks(canvas, resized);

    if (resized.length > 0) {
      const expressions = resized[0].expressions;
      const [topEmotion, confidence] = Object.entries(expressions).sort(
        (a, b) => b[1] - a[1]
      )[0];

      setEmotion(topEmotion);
      setEmoji(emotionToEmoji(topEmotion, confidence));
    } else {
      setEmotion("No face");
      setEmoji("❓");
    }

    rafRef.current = requestAnimationFrame(detectLoop);
  };

  /* =========================================================
     6. RENDER
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
        <div className="result-item">
          <strong>Status:</strong> {status}
        </div>
        <div className="result-item">
          <strong>Emotion:</strong> {emotion} {emoji}
        </div>
      </div>
    </div>
  );
}
