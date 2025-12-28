import { useCallback, useEffect, useRef, useState } from "react";
import { FaceLandmarks } from "@/types/glasses";

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
  const faceMeshRef = useRef<any>(null);
  const previousLandmarks = useRef<FaceLandmarks | null>(null);
  const animationFrameRef = useRef<number>();

  const processResults = useCallback((results: any) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setIsFaceDetected(false);
      onLandmarksUpdate(null);
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    
    // Key facial landmarks indices
    // Left eye outer corner: 33, inner: 133
    // Right eye outer corner: 263, inner: 362
    // Nose bridge top: 6
    // Left temple: 127, Right temple: 356
    
    const leftEyeOuter = landmarks[33];
    const leftEyeInner = landmarks[133];
    const rightEyeOuter = landmarks[263];
    const rightEyeInner = landmarks[362];
    const noseBridge = landmarks[6];
    const leftTemple = landmarks[127];
    const rightTemple = landmarks[356];

    // Calculate eye centers
    const leftEye = {
      x: (leftEyeOuter.x + leftEyeInner.x) / 2,
      y: (leftEyeOuter.y + leftEyeInner.y) / 2,
    };

    const rightEye = {
      x: (rightEyeOuter.x + rightEyeInner.x) / 2,
      y: (rightEyeOuter.y + rightEyeInner.y) / 2,
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

    // Scale factor based on face width (normalized 0-1 coords)
    const scale = faceWidth / 0.4; // Baseline face width

    const newLandmarks: FaceLandmarks = {
      leftEye,
      rightEye,
      noseBridge: { x: noseBridge.x, y: noseBridge.y },
      leftTemple: { x: leftTemple.x, y: leftTemple.y },
      rightTemple: { x: rightTemple.x, y: rightTemple.y },
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
  }, [onLandmarksUpdate]);

  useEffect(() => {
    let isMounted = true;

    const initFaceMesh = async () => {
      try {
        // Dynamic import for MediaPipe
        const { FaceMesh } = await import("@mediapipe/face_mesh");
        const { Camera } = await import("@mediapipe/camera_utils");

        if (!isMounted || !videoRef.current) return;

        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(processResults);
        faceMeshRef.current = faceMesh;

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && faceMeshRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720,
        });

        await camera.start();
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to initialize face detection:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initFaceMesh();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
    };
  }, [videoRef, processResults]);

  return { isLoading, isFaceDetected };
};
