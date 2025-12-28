import { motion } from "framer-motion";
import { Camera, Shield, Sparkles, ArrowRight } from "lucide-react";

interface PermissionRequestProps {
  onRequestPermission: () => void;
  error?: string | null;
}

export const PermissionRequest = ({ onRequestPermission, error }: PermissionRequestProps) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, hsl(265 100% 68% / 0.08) 0%, transparent 60%)' }} />
      
      {/* Floating Orbs */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
      />

      <div className="relative max-w-lg mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo Mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10 inline-flex items-center justify-center"
          >
            <div className="relative">
              {/* Glow Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border border-primary/20"
              />
              
              {/* Icon Container */}
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 glow-subtle">
                <Camera className="w-14 h-14 text-primary" strokeWidth={1.5} />
              </div>
              
              {/* Sparkle */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-gradient text-4xl md:text-5xl font-bold mb-4 tracking-[0.12em]">
              SHUUVORA
            </h1>
            <p className="text-muted-foreground/80 text-sm tracking-[0.3em] uppercase mb-8">
              Virtual Try-On Experience
            </p>
          </motion.div>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed font-light"
          >
            Discover your perfect frame with our{" "}
            <span className="text-foreground font-normal">AI-powered</span> augmented reality experience
          </motion.p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mb-8 p-5 rounded-2xl bg-destructive/10 border border-destructive/20 backdrop-blur-sm"
            >
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.button
            onClick={onRequestPermission}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary group w-full py-5 px-10 rounded-2xl font-medium text-lg text-primary-foreground flex items-center justify-center gap-3"
          >
            <span>Start Experience</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Privacy Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-2.5 text-muted-foreground/60"
          >
            <Shield className="w-4 h-4" />
            <span className="text-xs tracking-wide">Camera feed stays on your device · Privacy first</span>
          </motion.div>
          
          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            {["Real-time Tracking", "4 Premium Frames", "Zero Latency"].map((feature, i) => (
              <span 
                key={feature}
                className="px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground tracking-wide"
              >
                {feature}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Noise Overlay */}
      <div className="noise-overlay" />
    </div>
  );
};
