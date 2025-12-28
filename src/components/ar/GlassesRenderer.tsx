import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaceLandmarks, GlassesStyle } from "@/types/glasses";

interface GlassesRendererProps {
  landmarks: FaceLandmarks | null;
  glasses: GlassesStyle;
  containerWidth: number;
  containerHeight: number;
}

export const GlassesRenderer = memo(({ 
  landmarks, 
  glasses, 
  containerWidth, 
  containerHeight 
}: GlassesRendererProps) => {
  const glassesTransform = useMemo(() => {
    if (!landmarks) return null;

    // Calculate eye distance in pixels for proper scaling
    const leftEyeX = (1 - landmarks.leftEye.x) * containerWidth;
    const rightEyeX = (1 - landmarks.rightEye.x) * containerWidth;
    const leftEyeY = landmarks.leftEye.y * containerHeight;
    const rightEyeY = landmarks.rightEye.y * containerHeight;
    
    const eyeDistance = Math.sqrt(
      Math.pow(rightEyeX - leftEyeX, 2) + 
      Math.pow(rightEyeY - leftEyeY, 2)
    );

    // Center point between eyes
    const centerX = (leftEyeX + rightEyeX) / 2;
    const centerY = (leftEyeY + rightEyeY) / 2;
    
    // Calculate rotation (inverted for mirror)
    const rotation = -landmarks.faceAngle * (180 / Math.PI);
    
    // Scale glasses to fit face - eyeDistance represents the space between eyes
    // We want glasses to extend beyond the eyes, so multiply appropriately
    // A typical glasses frame is about 2.5-3x the eye distance
    const targetGlassesWidth = eyeDistance * 2.8;
    const baseGlassesWidth = glasses.frameWidth * 2; // Base SVG width
    const scale = targetGlassesWidth / baseGlassesWidth;
    
    return {
      x: centerX,
      y: centerY - (eyeDistance * 0.08), // Slight upward offset to sit on nose bridge
      rotation,
      scale: Math.max(0.5, Math.min(2.5, scale)), // Clamp scale
      eyeDistance,
    };
  }, [landmarks, containerWidth, containerHeight, glasses.frameWidth]);

  if (!glassesTransform) return null;

  const renderGlasses = () => {
    const { scale, eyeDistance } = glassesTransform;
    const frameColor = glasses.color;
    
    // Dynamic sizing based on eye distance
    const svgWidth = eyeDistance * 2.8;
    const svgHeight = eyeDistance * 1.1;

    switch (glasses.id) {
      case "aviator":
        return (
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox="0 0 320 120"
            style={{ marginLeft: -svgWidth / 2, marginTop: -svgHeight * 0.35 }}
          >
            <defs>
              <linearGradient id="lensGradientAviator" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.15)" />
                <stop offset="30%" stopColor="rgba(109, 40, 217, 0.25)" />
                <stop offset="70%" stopColor="rgba(76, 29, 149, 0.3)" />
                <stop offset="100%" stopColor="rgba(55, 20, 108, 0.25)" />
              </linearGradient>
              <linearGradient id="frameGradientAviator" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4a4a4a" />
                <stop offset="30%" stopColor={frameColor} />
                <stop offset="70%" stopColor="#0d0d0d" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
              <filter id="glassShadowAviator">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
              </filter>
              <filter id="innerGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="reflectionAviator" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </linearGradient>
            </defs>
            
            {/* Left Lens - Premium Teardrop */}
            <path 
              d="M 30 55 
                 C 30 25, 60 15, 90 15 
                 C 120 15, 130 35, 130 55 
                 C 130 80, 100 100, 70 100 
                 C 40 100, 30 80, 30 55 Z" 
              fill="url(#lensGradientAviator)" 
              filter="url(#glassShadowAviator)" 
            />
            <path 
              d="M 30 55 
                 C 30 25, 60 15, 90 15 
                 C 120 15, 130 35, 130 55 
                 C 130 80, 100 100, 70 100 
                 C 40 100, 30 80, 30 55 Z" 
              fill="url(#reflectionAviator)" 
            />
            <path 
              d="M 30 55 
                 C 30 25, 60 15, 90 15 
                 C 120 15, 130 35, 130 55 
                 C 130 80, 100 100, 70 100 
                 C 40 100, 30 80, 30 55 Z" 
              fill="none" 
              stroke="url(#frameGradientAviator)" 
              strokeWidth="5" 
            />
            
            {/* Right Lens */}
            <path 
              d="M 190 55 
                 C 190 25, 200 15, 230 15 
                 C 260 15, 290 25, 290 55 
                 C 290 80, 280 100, 250 100 
                 C 220 100, 190 80, 190 55 Z" 
              fill="url(#lensGradientAviator)" 
              filter="url(#glassShadowAviator)" 
            />
            <path 
              d="M 190 55 
                 C 190 25, 200 15, 230 15 
                 C 260 15, 290 25, 290 55 
                 C 290 80, 280 100, 250 100 
                 C 220 100, 190 80, 190 55 Z" 
              fill="url(#reflectionAviator)" 
            />
            <path 
              d="M 190 55 
                 C 190 25, 200 15, 230 15 
                 C 260 15, 290 25, 290 55 
                 C 290 80, 280 100, 250 100 
                 C 220 100, 190 80, 190 55 Z" 
              fill="none" 
              stroke="url(#frameGradientAviator)" 
              strokeWidth="5" 
            />
            
            {/* Premium Bridge */}
            <path 
              d="M 130 50 C 145 35, 175 35, 190 50" 
              fill="none" 
              stroke="url(#frameGradientAviator)" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            
            {/* Temple Hinges */}
            <rect x="8" y="45" width="24" height="20" rx="4" fill="url(#frameGradientAviator)" />
            <rect x="288" y="45" width="24" height="20" rx="4" fill="url(#frameGradientAviator)" />
            
            {/* Shuuvora Branding
            <text x="250" y="92" fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="Outfit" fontWeight="500" textAnchor="middle" letterSpacing="2">
              SHUUVORA
            </text> */}
          </svg>
        );

      case "rectangular":
        return (
          <svg
            width={svgWidth}
            height={svgHeight * 0.85}
            viewBox="0 0 320 95"
            style={{ marginLeft: -svgWidth / 2, marginTop: -svgHeight * 0.3 }}
          >
            <defs>
              <linearGradient id="lensGradientRect" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
                <stop offset="50%" stopColor="rgba(109, 40, 217, 0.2)" />
                <stop offset="100%" stopColor="rgba(76, 29, 149, 0.25)" />
              </linearGradient>
              <linearGradient id="frameGradientRect" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#505050" />
                <stop offset="40%" stopColor={frameColor} />
                <stop offset="100%" stopColor="#0a0a0a" />
              </linearGradient>
              <filter id="glassShadowRect">
                <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000" floodOpacity="0.45" />
              </filter>
              <linearGradient id="reflectionRect" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            
            {/* Left Lens */}
            <rect x="18" y="12" width="125" height="65" rx="12" fill="url(#lensGradientRect)" filter="url(#glassShadowRect)" />
            <rect x="18" y="12" width="125" height="65" rx="12" fill="url(#reflectionRect)" />
            <rect x="18" y="12" width="125" height="65" rx="12" fill="none" stroke="url(#frameGradientRect)" strokeWidth="5" />
            
            {/* Right Lens */}
            <rect x="177" y="12" width="125" height="65" rx="12" fill="url(#lensGradientRect)" filter="url(#glassShadowRect)" />
            <rect x="177" y="12" width="125" height="65" rx="12" fill="url(#reflectionRect)" />
            <rect x="177" y="12" width="125" height="65" rx="12" fill="none" stroke="url(#frameGradientRect)" strokeWidth="5" />
            
            {/* Bridge */}
            <path d="M 143 44 L 177 44" fill="none" stroke="url(#frameGradientRect)" strokeWidth="5" strokeLinecap="round" />
            
            {/* Hinges */}
            <rect x="2" y="34" width="20" height="22" rx="4" fill="url(#frameGradientRect)" />
            <rect x="298" y="34" width="20" height="22" rx="4" fill="url(#frameGradientRect)" />
            
            {/* Branding */}
            <text x="240" y="68" fontSize="7" fill="rgba(255,255,255,0.45)" fontFamily="Outfit" fontWeight="500" textAnchor="middle" letterSpacing="1.5">
              SHUUVORA
            </text>
          </svg>
        );

      case "round":
        return (
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox="0 0 300 110"
            style={{ marginLeft: -svgWidth / 2, marginTop: -svgHeight * 0.35 }}
          >
            <defs>
              <linearGradient id="lensGradientRound" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(167, 139, 250, 0.12)" />
                <stop offset="50%" stopColor="rgba(139, 92, 246, 0.22)" />
                <stop offset="100%" stopColor="rgba(109, 40, 217, 0.28)" />
              </linearGradient>
              <linearGradient id="frameGradientRound" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#454545" />
                <stop offset="50%" stopColor={frameColor} />
                <stop offset="100%" stopColor="#0c0c0c" />
              </linearGradient>
              <filter id="glassShadowRound">
                <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity="0.5" />
              </filter>
              <radialGradient id="reflectionRound" cx="30%" cy="30%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            
            {/* Left Lens */}
            <circle cx="75" cy="55" r="45" fill="url(#lensGradientRound)" filter="url(#glassShadowRound)" />
            <circle cx="75" cy="55" r="45" fill="url(#reflectionRound)" />
            <circle cx="75" cy="55" r="45" fill="none" stroke="url(#frameGradientRound)" strokeWidth="6" />
            
            {/* Right Lens */}
            <circle cx="225" cy="55" r="45" fill="url(#lensGradientRound)" filter="url(#glassShadowRound)" />
            <circle cx="225" cy="55" r="45" fill="url(#reflectionRound)" />
            <circle cx="225" cy="55" r="45" fill="none" stroke="url(#frameGradientRound)" strokeWidth="6" />
            
            {/* Bridge */}
            <path d="M 120 55 Q 150 38, 180 55" fill="none" stroke="url(#frameGradientRound)" strokeWidth="5" strokeLinecap="round" />
            
            {/* Hinges */}
            <rect x="22" y="46" width="14" height="18" rx="4" fill="url(#frameGradientRound)" />
            <rect x="264" y="46" width="14" height="18" rx="4" fill="url(#frameGradientRound)" />
            
            {/* Branding */}
            <text x="225" y="88" fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="Outfit" fontWeight="500" textAnchor="middle" letterSpacing="1.5">
              SHUUVORA
            </text>
          </svg>
        );

      case "oversized":
        return (
          <svg
  width={svgWidth * 1.05}
  height={svgHeight * 1.1}
  viewBox="0 0 360 140"
  style={{ marginLeft: -(svgWidth * 1.05) / 2, marginTop: -svgHeight * 0.38 }}
>
  <defs>
    <linearGradient id="lensGradientOver" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="rgba(139, 92, 246, 0.12)" />
      <stop offset="40%" stopColor="rgba(109, 40, 217, 0.22)" />
      <stop offset="100%" stopColor="rgba(76, 29, 149, 0.3)" />
    </linearGradient>

    <linearGradient id="frameGradientOver" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#3a3a3a" />
      <stop offset="50%" stopColor={frameColor} />
      <stop offset="100%" stopColor="#050505" />
    </linearGradient>

    <filter id="glassShadowOver">
      <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
    </filter>

    <linearGradient id="reflectionOver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
      <stop offset="50%" stopColor="rgba(255,255,255,0)" />
    </linearGradient>
  </defs>

 {/* Left Lens */}
<rect x="35" y="18" width="115" height="90" rx="22" fill="url(#lensGradientOver)" filter="url(#glassShadowOver)" />
<rect x="35" y="18" width="115" height="90" rx="22" fill="url(#reflectionOver)" />
<rect x="35" y="18" width="115" height="90" rx="22" fill="none" stroke="url(#frameGradientOver)" strokeWidth="5" />

{/* Right Lens */}
<rect x="210" y="18" width="115" height="90" rx="22" fill="url(#lensGradientOver)" filter="url(#glassShadowOver)" />
<rect x="210" y="18" width="115" height="90" rx="22" fill="url(#reflectionOver)" />
<rect x="210" y="18" width="115" height="90" rx="22" fill="none" stroke="url(#frameGradientOver)" strokeWidth="5" />

{/* Bridge */}
<path
  d="M 150 63 L 210 63"
  fill="none"
  stroke="url(#frameGradientOver)"
  strokeWidth="5"
  strokeLinecap="round"
/>

{/* Hinges
<rect x="15" y=" Fifty" width="24" height="28" rx="6" fill="url(#frameGradientOver)" />
<rect x="321" y=" Fifty" width="24" height="28" rx="6" fill="url(#frameGradientOver)" /> */}

{/* Branding */}
<text
  x="270"
  y="105"
  fontSize="8"
  fill="rgba(255,255,255,0.4)"
  fontFamily="Outfit"
  fontWeight="500"
  textAnchor="middle"
  letterSpacing="2"
>
    SHUUVORA
  </text>
</svg>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={glasses.id}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          left: glassesTransform.x,
          top: glassesTransform.y,
          transform: `rotate(${glassesTransform.rotation}deg)`,
          transformOrigin: "center center",
          willChange: "transform, left, top",
          pointerEvents: "none",
        }}
      >
        {renderGlasses()}
      </motion.div>
    </AnimatePresence>
  );
});

GlassesRenderer.displayName = "GlassesRenderer";
