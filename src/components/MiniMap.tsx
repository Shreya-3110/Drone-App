import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export function MiniMap() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="glass-panel p-5 rounded-xl h-64 relative overflow-hidden flex flex-col"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-4 z-10 relative">
        <Target className="w-4 h-4 text-[#00D4FF]" />
        <h2 className="font-orbitron text-sm tracking-widest text-white/90">RADAR SWEEP</h2>
      </div>

      <div className="flex-1 relative border border-[#00D4FF]/20 rounded-full bg-black/40 overflow-hidden flex items-center justify-center m-2">
        {/* Radar Rings */}
        <div className="absolute inset-4 rounded-full border border-white/5" />
        <div className="absolute inset-10 rounded-full border border-white/5" />
        <div className="absolute inset-16 rounded-full border border-white/10" />

        {/* Center dot */}
        <div className="w-2 h-2 rounded-full bg-[#00D4FF] z-10 shadow-[0_0_10px_#00D4FF]" />
        
        {/* Drone Contact */}
        <div className="absolute top-12 right-12 w-1.5 h-1.5 rounded-full bg-white z-10 shadow-[0_0_8px_white] animate-pulse" />
        <div className="absolute bottom-10 left-16 w-1 h-1 rounded-full bg-red-400 z-10 shadow-[0_0_5px_red] opacity-50" />

        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 origin-center flex justify-end"
        >
          {/* Creating the radar cone effect */}
          <div 
            className="w-[50%] h-[50%] bg-gradient-to-br from-[#00D4FF]/30 to-transparent origin-bottom-left absolute bottom-1/2 left-1/2" 
            style={{ borderRadius: '0 100% 0 0' }} 
          />
          <div className="absolute bottom-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-[#00D4FF] to-transparent shadow-[0_0_15px_#00D4FF]" />
        </motion.div>
      </div>

      <div className="absolute bottom-3 right-4 bg-black/80 px-2 py-1 rounded border border-white/10 text-[9px] font-orbitron text-[#00FF9C] tracking-[0.2em] z-10 backdrop-blur-md hidden xl:block">
        COORDS: 34.05N 118.24W
      </div>
    </motion.div>
  );
}
