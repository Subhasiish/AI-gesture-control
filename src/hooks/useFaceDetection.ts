import { useCallback, useEffect, useRef, useState } from "react";
import { FaceLandmarks } from "@/types/glasses";
import * as faceapi from "face-api.js";

interface UseFaceDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onLandmarksUpdate: (landmarks: FaceLandmarks | null) => void;
}

// Temporal smoothing for stable tracking
const smoothValue = (current: number, previous: number, factor = 0.3): number => {
  return previous + (current - previous) * factor;
};

export const useFaceDetection = ({ videoRef, onLandmarksUpdate }: UseFaceDetectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const previousLandmarks = useRef<FaceLandmarks | null>(null);
  const animationFrameRef = useRef<number>();
  const isInitialized = useRef(false);

  const processVideo = useCallback(async () => {
    if (!videoRef.current || !isInitialized.current) return;

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
        .withFaceLandmarks();

      if (!detections) {
        setIsFaceDetected(false);
        onLandmarksUpdate(null);
        return;
      }

      const landmarks = detections.landmarks;
      const positions = landmarks.positions;

      // Key facial landmarks indices for face-api.js
      // Left eye: indices 36-41 (we'll use corners)
      // Right eye: indices 42-47
      // Nose: indices 27-35
      // Jaw: indices 0-16

      // Calculate eye centers
      const leftEyePoints = positions.slice(36, 42);
      const rightEyePoints = positions.slice(42, 48);

      const leftEye = {
        x: leftEyePoints.reduce((sum, p) => sum + p.x, 0) / leftEyePoints.length / videoRef.current!.videoWidth,
        y: leftEyePoints.reduce((sum, p) => sum + p.y, 0) / leftEyePoints.length / videoRef.current!.videoHeight,
      };

      const rightEye = {
        x: rightEyePoints.reduce((sum, p) => sum + p.x, 0) / rightEyePoints.length / videoRef.current!.videoWidth,
        y: rightEyePoints.reduce((sum, p) => sum + p.y, 0) / rightEyePoints.length / videoRef.current!.videoHeight,
      };

      // Nose bridge (use nose tip)
      const noseBridge = {
        x: positions[30].x / videoRef.current!.videoWidth,
        y: positions[30].y / videoRef.current!.videoHeight,
      };

      // Temples (approximate using jaw points)
      const leftTemple = {
        x: positions[0].x / videoRef.current!.videoWidth,
        y: positions[0].y / videoRef.current!.videoHeight,
      };

      const rightTemple = {
        x: positions[16].x / videoRef.current!.videoWidth,
        y: positions[16].y / videoRef.current!.videoHeight,
      };

      // Calculate face width and angle
      const faceWidth = Math.sqrt(
        Math.pow(rightTemple.x - leftTemple.x, 2) +
        Math.pow(rightTemple.y - leftTemple.y, 2)
      );

      const faceAngle = Math.atan2(
        rightEye.y - leftEye.y,
        rightEye.x - leftEye.x
      );

      // Scale factor based on face width
      const scale = faceWidth / 0.4;

      const newLandmarks: FaceLandmarks = {
        leftEye,
        rightEye,
        noseBridge,
        leftTemple,
        rightTemple,
        faceWidth,
        faceAngle,
        scale,
      };

      // Apply temporal smoothing
      if (previousLandmarks.current) {
        const smoothed: FaceLandmarks = {
          leftEye: {
            x: smoothValue(newLandmarks.leftEye.x, previousLandmarks.current.leftEye.x),
            y: smoothValue(newLandmarks.leftEye.y, previousLandmarks.current.leftEye.y),
          },
          rightEye: {
            x: smoothValue(newLandmarks.rightEye.x, previousLandmarks.current.rightEye.x),
            y: smoothValue(newLandmarks.rightEye.y, previousLandmarks.current.rightEye.y),
          },
          noseBridge: {
            x: smoothValue(newLandmarks.noseBridge.x, previousLandmarks.current.noseBridge.x),
            y: smoothValue(newLandmarks.noseBridge.y, previousLandmarks.current.noseBridge.y),
          },
          leftTemple: {
            x: smoothValue(newLandmarks.leftTemple.x, previousLandmarks.current.leftTemple.x),
            y: smoothValue(newLandmarks.leftTemple.y, previousLandmarks.current.leftTemple.y),
          },
          rightTemple: {
            x: smoothValue(newLandmarks.rightTemple.x, previousLandmarks.current.rightTemple.x),
            y: smoothValue(newLandmarks.rightTemple.y, previousLandmarks.current.rightTemple.y),
          },
          faceWidth: smoothValue(newLandmarks.faceWidth, previousLandmarks.current.faceWidth),
          faceAngle: smoothValue(newLandmarks.faceAngle, previousLandmarks.current.faceAngle, 0.2),
          scale: smoothValue(newLandmarks.scale, previousLandmarks.current.scale),
        };
        previousLandmarks.current = smoothed;
        setIsFaceDetected(true);
        onLandmarksUpdate(smoothed);
      } else {
        previousLandmarks.current = newLandmarks;
        setIsFaceDetected(true);
        onLandmarksUpdate(newLandmarks);
      }
    } catch (error) {
      console.error("Face detection error:", error);
      setIsFaceDetected(false);
      onLandmarksUpdate(null);
    }

    animationFrameRef.current = requestAnimationFrame(processVideo);
  }, [videoRef, onLandmarksUpdate]);

  useEffect(() => {
    let isMounted = true;

    const initFaceAPI = async () => {
      try {
        // Load face-api.js models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);

        if (!isMounted) return;

        isInitialized.current = true;
        setIsLoading(false);

        // Start processing
        processVideo();
      } catch (error) {
        console.error("Failed to initialize face detection:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initFaceAPI();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isInitialized.current = false;
    };
  }, [processVideo]);

  return { isLoading, isFaceDetected };
};
