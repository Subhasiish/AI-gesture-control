import { motion, AnimatePresence } from "framer-motion";
import { GlassesStyle } from "@/types/glasses";
import { Check, Sparkles } from "lucide-react";

interface ControlPanelProps {
  glasses: GlassesStyle[];
  selectedId: string;
  onSelect: (id: string) => void;
  isFaceDetected: boolean;
}

export const ControlPanel = ({ glasses, selectedId, onSelect, isFaceDetected }: ControlPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="control-panel bottom-6 left-1/2 -translate-x-1/2 rounded-3xl p-5 md:p-6 safe-area-inset max-w-[95vw]"
    >
      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className={`relative w-2.5 h-2.5 rounded-full transition-all duration-500 ${
          isFaceDetected 
            ? 'bg-green-400 status-dot' 
            : 'bg-muted-foreground/50'
        }`} />
        <span className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium">
          {isFaceDetected ? 'Tracking Active' : 'Detecting Face...'}
        </span>
      </div>

      {/* Glass Selection Grid */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {glasses.map((style, index) => (
          <motion.button
            key={style.id}
            onClick={() => onSelect(style.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center gap-2.5 p-3 md:p-4 rounded-2xl transition-all duration-400 ${
              selectedId === style.id
                ? 'btn-glass active'
                : 'btn-glass'
            }`}
          >
            {/* Glasses Icon */}
            <div className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center">
              <GlassesIcon type={style.id} isActive={selectedId === style.id} />
            </div>
            
            {/* Name */}
            <div className="text-center">
              <p className={`text-[10px] md:text-xs font-medium transition-all duration-300 ${
                selectedId === style.id 
                  ? 'text-gradient' 
                  : 'text-muted-foreground'
              }`}>
                {style.name}
              </p>
            </div>

            {/* Selection Indicator */}
            <AnimatePresence>
              {selectedId === style.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Premium Branding Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-5 pt-4 border-t border-border/30 flex items-center justify-center gap-3"
      >
        <Sparkles className="w-3.5 h-3.5 text-primary/60" />
        <span className="text-gradient text-sm font-semibold tracking-[0.25em]">SHUUVORA</span>
        <span className="text-muted-foreground/60 text-[10px] font-light tracking-wider">VIRTUAL TRY-ON</span>
      </motion.div>
    </motion.div>
  );
};

// Premium glasses icons
const GlassesIcon = ({ type, isActive }: { type: string; isActive: boolean }) => {
  const gradientId = `iconGradient-${type}`;
  
  return (
    <svg viewBox="0 0 64 28" className="w-full h-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isActive ? "#a855f7" : "#6b7280"} />
          <stop offset="100%" stopColor={isActive ? "#7c3aed" : "#4b5563"} />
        </linearGradient>
      </defs>
      
      {type === "aviator" && (
        <>
          <ellipse cx="16" cy="14" rx="13" ry="10" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
          <ellipse cx="48" cy="14" rx="13" ry="10" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
          <path d="M 29 14 Q 32 9, 35 14" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" />
        </>
      )}
      
      {type === "rectangular" && (
        <>
          <rect x="2" y="5" width="24" height="18" rx="4" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
          <rect x="38" y="5" width="24" height="18" rx="4" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
          <line x1="26" y1="14" x2="38" y2="14" stroke={`url(#${gradientId})`} strokeWidth="2" />
        </>
      )}
      
      {type === "round" && (
        <>
          <circle cx="16" cy="14" r="11" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
          <circle cx="48" cy="14" r="11" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
          <path d="M 27 14 Q 32 8, 37 14" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" />
        </>
      )}
      
      {type === "oversized" && (
        <>
          <rect x="1" y="2" width="26" height="24" rx="7" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
          <rect x="37" y="2" width="26" height="24" rx="7" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
          <line x1="27" y1="14" x2="37" y2="14" stroke={`url(#${gradientId})`} strokeWidth="2" />
        </>
      )}
    </svg>
  );
};
