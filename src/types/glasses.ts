export interface GlassesStyle {
  id: string;
  name: string;
  description: string;
  color: string;
  frameWidth: number;
  frameHeight: number;
  bridgeWidth: number;
  templeLength: number;
}

export interface FaceLandmarks {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  noseBridge: { x: number; y: number };
  leftTemple: { x: number; y: number };
  rightTemple: { x: number; y: number };
  faceWidth: number;
  faceAngle: number;
  scale: number;
}

export interface ARState {
  isLoading: boolean;
  hasPermission: boolean | null;
  isFaceDetected: boolean;
  error: string | null;
}
