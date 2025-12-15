import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "./Webcam";

export default function EmotionDetector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const runningRef = useRef(false);

  // 🔹 smoothing refs
  const expressionHistoryRef = useRef([]);
  const lastUpdateRef = useRef(Date.now());

  const [status, setStatus] = useState("Loading models...");
  const [emotion, setEmotion] = useState("—");
  const [emoji, setEmoji] = useState("🙂");

  /* =========================================================
     1. LOAD MODELS (SSD + Expressions)
  ========================================================= */
  useEffect(() => {
    let cancelled = false;

    async function loadModels() {
      try {
        const MODEL_URL = "/models";

        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        if (!cancelled) {
          setStatus("Models loaded. Waiting for camera...");
        }
      } catch (err) {
        console.error(err);
        setStatus("Failed to load models");
      }
    }

    loadModels();

    return () => {
      cancelled = true;
      runningRef.current = false;
    };
  }, []);

  /* =========================================================
     2. CAMERA READY
  ========================================================= */
  const handleVideoReady = (video) => {
    if (runningRef.current) return;

    videoRef.current = video;
    runningRef.current = true;

    setStatus("Detecting expressions...");
    detectLoop();
  };

  /* =========================================================
     3. EMOTION → EMOJI MAP
  ========================================================= */
  const emotionToEmoji = (emotion) => {
    switch (emotion) {
      case "happy":
        return "😄";
      case "sad":
        return "😢";
      case "angry":
        return "😠";
      case "surprised":
        return "😲";
      case "fearful":
        return "😨";
      case "disgusted":
        return "🤢";
      case "neutral":
        return "😐";
      default:
        return "🙂";
    }
  };

  /* =========================================================
     4. DETECTION LOOP (SSD + SMOOTHING)
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
        .detectAllFaces(
          video,
          new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.4, // ⚖️ balanced accuracy
          })
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      const resized = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      faceapi.draw.drawDetections(canvas, resized);
      faceapi.draw.drawFaceLandmarks(canvas, resized);

      // 🧠 SMOOTHING LOGIC
      if (resized.length > 0) {
        const expressions = resized[0].expressions;

        // store expressions
        expressionHistoryRef.current.push(expressions);

        // keep approx 1 second (30 frames)
        if (expressionHistoryRef.current.length > 30) {
          expressionHistoryRef.current.shift();
        }

        const now = Date.now();

        // decide emotion once per second
        if (now - lastUpdateRef.current >= 1000) {
          lastUpdateRef.current = now;

          const totals = {};

          expressionHistoryRef.current.forEach((exp) => {
            for (const key in exp) {
              totals[key] = (totals[key] || 0) + exp[key];
            }
          });

          const dominant = Object.entries(totals)
            .sort((a, b) => b[1] - a[1])[0];

          if (dominant) {
            const [emotionName] = dominant;
            setEmotion(emotionName);
            setEmoji(emotionToEmoji(emotionName));
          }

          // reset buffer
          expressionHistoryRef.current = [];
        }
      } else {
        setEmotion("No face");
        setEmoji("❓");
      }
    }

    requestAnimationFrame(detectLoop);
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
