import { motion } from 'framer-motion';
import { Power, ArrowUpCircle, OctagonAlert } from 'lucide-react';
import { useState } from 'react';

export function ControlsOverlay() {
  const [isArmed, setIsArmed] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="glass-panel p-5 rounded-xl flex flex-col gap-8 h-full"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <Power className="w-4 h-4 text-[#7B61FF]" />
        <h2 className="font-orbitron text-sm tracking-widest text-white/90">FLIGHT CONTROLS</h2>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        
        <button 
          onClick={() => setIsArmed(!isArmed)}
          className={`relative group overflow-hidden border p-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 font-orbitron tracking-widest text-sm
            ${isArmed ? 'bg-red-500/10 border-red-500/50 text-red-500 neon-border-red hover:bg-red-500/20 text-shadow-sm' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70'}
          `}
        >
          <OctagonAlert className={`w-5 h-5 ${isArmed ? 'animate-pulse' : ''}`} />
          {isArmed ? 'EMERGENCY STOP' : 'ARM MOTORS'}
          {isArmed && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />}
        </button>

        <button 
          disabled={!isArmed}
          className={`p-4 rounded-lg flex items-center justify-center gap-3 font-orbitron tracking-widest text-sm transition-all duration-300
            ${isArmed ? 'bg-[#00D4FF]/20 border border-[#00D4FF]/50 text-[#00D4FF] hover:bg-[#00D4FF]/30 neon-border-blue' : 'bg-black/40 border border-white/5 text-white/20 cursor-not-allowed'}
          `}
        >
          <ArrowUpCircle className="w-5 h-5" />
          COMMENCE TAKEOFF
        </button>

        {/* Joystick UI visual placeholder */}
        <div className="flex-1 min-h-[180px] flex items-center justify-center mt-6">
          <div className="relative w-40 h-40 rounded-full border-2 border-dashed border-white/20 bg-black/40 shadow-[inset_0_0_20px_rgba(0,0,0,1)] flex items-center justify-center">
            {/* Axis marks */}
            <div className="absolute top-2 w-1.5 h-3 bg-white/20 rounded-full" />
            <div className="absolute bottom-2 w-1.5 h-3 bg-white/20 rounded-full" />
            <div className="absolute left-2 w-3 h-1.5 bg-white/20 rounded-full" />
            <div className="absolute right-2 w-3 h-1.5 bg-white/20 rounded-full" />
            
            {/* Stick (Interactive) */}
            <motion.div 
              drag
              dragConstraints={{ top: -40, left: -40, right: 40, bottom: 40 }}
              dragElastic={0.15}
              whileDrag={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#3a1d94] shadow-[0_0_25px_rgba(123,97,255,0.6)] cursor-grab active:cursor-grabbing border-2 border-white/20 flex items-center justify-center overflow-hidden"
            >
              <div className="w-8 h-8 rounded-full bg-black/40 blur-[3px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)] opacity-60 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
