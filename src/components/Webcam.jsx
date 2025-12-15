import React, { useEffect, useRef } from "react";
import "../styles/Webcam.css";

export default function Webcam({ onReady }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const readyCalledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 480,
            height: 360,
            facingMode: "user",
          },
          audio: false,
        });

        if (cancelled) return;

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;

        // 🔒 play() can throw AbortError in dev mode — guard it
        try {
          await video.play();
        } catch (e) {
          // Ignore AbortError caused by React StrictMode
        }

        // 🔑 Notify parent ONLY ONCE
        if (onReady && !readyCalledRef.current) {
          readyCalledRef.current = true;
          onReady(video);
        }
      } catch (err) {
        console.error("Camera error:", err);
        alert("Unable to access camera. Please allow permission.");
      }
    }

    startCamera();

    return () => {
      cancelled = true;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [onReady]);

  return (
    <div className="webcam-wrapper">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="webcam-video"
      />
    </div>
  );
}
