import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaceLandmarks } from "@/types/glasses";
import { glassesStyles } from "@/data/glassesStyles";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { GlassesRenderer } from "./GlassesRenderer";
import { ControlPanel } from "./ControlPanel";
import { LoadingOverlay } from "./LoadingOverlay";
import { PermissionRequest } from "./PermissionRequest";
import { Header } from "./Header";

export const ARExperience = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [selectedGlassesId, setSelectedGlassesId] = useState(glassesStyles[0].id);
  const [landmarks, setLandmarks] = useState<FaceLandmarks | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const selectedGlasses = glassesStyles.find(g => g.id === selectedGlassesId) || glassesStyles[0];

  const handleLandmarksUpdate = useCallback((newLandmarks: FaceLandmarks | null) => {
    setLandmarks(newLandmarks);
  }, []);

  const { isLoading, isFaceDetected } = useFaceDetection({
    videoRef,
    onLandmarksUpdate: handleLandmarksUpdate,
  });

  // Request camera permission
  const requestPermission = useCallback(async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasPermission(true);
    } catch (error) {
      console.error("Camera permission error:", error);
      setHasPermission(false);
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setPermissionError("Camera access was denied. Please enable camera permissions in your browser settings.");
        } else if (error.name === "NotFoundError") {
          setPermissionError("No camera found. Please connect a camera and try again.");
        } else {
          setPermissionError("Unable to access camera. Please try again.");
        }
      }
    }
  }, []);

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement?.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="ar-container">
      {/* Video Feed */}
      <video
        ref={videoRef}
        className="ar-video"
        playsInline
        muted
        autoPlay
      />

      {/* Gradient Overlay */}
      <div className="ar-overlay" />
      
      {/* Vignette Effect */}
      <div className="ar-vignette" />

      {/* Permission Request */}
      {hasPermission === null && (
        <PermissionRequest onRequestPermission={requestPermission} error={permissionError} />
      )}

      {/* Permission Denied */}
      {hasPermission === false && (
        <PermissionRequest onRequestPermission={requestPermission} error={permissionError} />
      )}

      {/* Loading State */}
      <AnimatePresence>
        {hasPermission && isLoading && (
          <LoadingOverlay message="Initializing face tracking..." />
        )}
      </AnimatePresence>

      {/* AR Content - Only show when ready */}
      {hasPermission && !isLoading && (
        <>
          {/* Glasses Overlay */}
          <GlassesRenderer
            landmarks={landmarks}
            glasses={selectedGlasses}
            containerWidth={containerSize.width}
            containerHeight={containerSize.height}
          />

          {/* Header */}
          <Header selectedGlassesName={selectedGlasses.name} />

          {/* Control Panel */}
          <ControlPanel
            glasses={glassesStyles}
            selectedId={selectedGlassesId}
            onSelect={setSelectedGlassesId}
            isFaceDetected={isFaceDetected}
          />
          
          {/* Corner Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 right-6 hidden lg:block"
          >
            <p className="text-muted-foreground/30 text-xs tracking-[0.3em] uppercase">
              Powered by AI
            </p>
          </motion.div>
        </>
      )}

      {/* Noise Overlay - Always visible for texture */}
      <div className="noise-overlay" />
    </div>
  );
};
