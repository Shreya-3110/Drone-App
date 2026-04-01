import { motion, useAnimationFrame } from 'framer-motion';
import { Camera } from 'lucide-react';
import { useRef } from 'react';

export function LiveCameraPanel({ isScanning = true, isConnected }: { isScanning?: boolean, isConnected: boolean }) {
  const horizonRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((time) => {
    // Simulate gentle pitch and roll from wind resistance
    if (horizonRef.current && isConnected) {
      const roll = Math.sin(time / 2000) * 15; // -15 to +15 deg
      const pitch = Math.cos(time / 2500) * 20; // -20 to +20px
      horizonRef.current.style.transform = `translateY(${pitch}px) rotate(${roll}deg)`;
    } else if (horizonRef.current && !isConnected) {
       // Return to absolute zero if no data link
       horizonRef.current.style.transform = `translateY(0px) rotate(0deg)`;
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
      className={`glass-panel p-2 md:p-3 rounded-xl flex flex-col w-full h-full relative overflow-hidden group border transition-colors duration-1000 ${isConnected ? 'border-[#00D4FF]/20' : 'border-white/5 opacity-90'}`}
    >
      <div className="absolute top-4 md:top-6 left-4 md:left-6 flex items-center gap-2 z-[400] bg-black/50 px-3 py-1.5 md:px-4 md:py-2 rounded border border-white/10 backdrop-blur-md">
        <Camera className={`w-3 h-3 md:w-5 md:h-5 ${isConnected ? 'text-red-500 animate-pulse' : 'text-white/30'}`} />
        <span className={`font-orbitron font-bold tracking-widest text-[10px] md:text-sm shadow-none uppercase transition-colors duration-1000 ${isConnected ? 'text-[#00D4FF]' : 'text-white/30'}`}>
          Drone Camera
        </span>
      </div>

      <div className={`flex-1 w-full h-full rounded-lg relative overflow-hidden bg-black/20 border border-white/5 shadow-inner flex items-center justify-center transition-all duration-1000 ${!isConnected && 'grayscale blur-sm opacity-30'}`}>
        
        {/* Simple Artificial Horizon Line */}
        <div className={`absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none transition-opacity duration-1000 ${isConnected ? 'opacity-80' : 'opacity-20'}`} style={{ clipPath: 'circle(40% at center)' }}>
           <div ref={horizonRef} className="w-full flex items-center justify-center gap-8 md:gap-12 transition-transform duration-1000">
              <div className="w-16 md:w-24 h-[3px] bg-[#00FF9C] shadow-[0_0_15px_#00FF9C]" />
              {/* Center dot - represents the nose of the plane */}
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
              <div className="w-16 md:w-24 h-[3px] bg-[#00FF9C] shadow-[0_0_15px_#00FF9C]" />
           </div>
        </div>

        {/* Scan line effect */}
        {isScanning && isConnected && (
          <motion.div 
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#00D4FF]/10 to-transparent pointer-events-none"
          />
        )}
        
        {/* Corner framing */}
        <div className="absolute top-4 left-4 w-6 md:w-10 h-6 md:h-10 border-t-2 border-l-2 border-[#00D4FF]/50 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 md:w-10 h-6 md:h-10 border-t-2 border-r-2 border-[#00D4FF]/50 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 md:w-10 h-6 md:h-10 border-b-2 border-l-2 border-[#00D4FF]/50 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 md:w-10 h-6 md:h-10 border-b-2 border-r-2 border-[#00D4FF]/50 rounded-br-lg pointer-events-none" />

      </div>

      {!isConnected && (
         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
           <div className="font-orbitron font-bold text-red-500 tracking-[0.2em] md:tracking-[0.4em] text-sm md:text-xl animate-pulse bg-black/50 px-6 py-3 rounded-lg border border-red-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.2)]">
             NO VIDEO SIGNAL
           </div>
         </div>
      )}
    </motion.div>
  );
}
