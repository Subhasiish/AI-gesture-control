import { motion } from "framer-motion";

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = ({ message = "Initializing AR..." }: LoadingOverlayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-12"
      >
        {/* Outer Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-32 h-32 rounded-full border border-primary/20"
        />
        
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-primary/30"
        />
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border border-primary/40"
        />

        {/* Center Glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-8 rounded-full bg-primary/20 blur-xl"
        />
        
        {/* Center Logo */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary"
          >
            <span className="text-2xl font-bold text-white">S</span>
          </motion.div>
        </div>

        {/* Orbiting Dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
          >
            <div 
              className="w-2 h-2 rounded-full bg-primary glow-subtle"
              style={{ transform: `translateX(${56 + i * 8}px)` }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-gradient text-3xl font-semibold mb-3 tracking-[0.15em]">SHUUVORA</h2>
        <p className="text-muted-foreground text-sm tracking-wide">{message}</p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "12rem" }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-10 h-0.5 rounded-full bg-muted overflow-hidden"
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "50%" }}
        />
      </motion.div>
    </motion.div>
  );
};
