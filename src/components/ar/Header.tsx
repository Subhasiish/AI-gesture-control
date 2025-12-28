import { motion } from "framer-motion";
import { Scan, Share2 } from "lucide-react";

interface HeaderProps {
  selectedGlassesName: string;
}

export const Header = ({ selectedGlassesName }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="control-panel top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 rounded-2xl px-5 py-4 flex items-center justify-between safe-area-inset"
    >
      {/* Logo */}
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/20"
        >
          <span className="text-gradient text-lg font-bold">S</span>
        </motion.div>
        <div className="hidden sm:block">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] mb-0.5">Now Trying</p>
          <p className="text-sm font-medium text-foreground">{selectedGlassesName}</p>
        </div>
      </div>

      {/* Mobile Title */}
      <div className="sm:hidden text-center flex-1 px-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Trying</p>
        <p className="text-sm font-medium text-foreground truncate">{selectedGlassesName}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-glass p-2.5 rounded-xl hidden sm:flex"
        >
          <Scan className="w-4 h-4 text-muted-foreground" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-glass p-2.5 rounded-xl"
        >
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </div>
    </motion.header>
  );
};
