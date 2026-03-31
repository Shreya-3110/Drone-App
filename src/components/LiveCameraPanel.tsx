import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LiveCameraPanel() {
  const [alt, setAlt] = useState(421.3);
  const [spd, setSpd] = useState(48.2);

  // Simulate slight changes in telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setAlt(prev => prev + (Math.random() - 0.5) * 2);
      setSpd(prev => prev + (Math.random() - 0.5) * 1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="flex-1 relative rounded-xl flex items-center justify-center overflow-hidden"
    >
      {/* Corner UI */}
      <div className="absolute top-4 left-4 border-t-2 border-l-2 border-[#00D4FF] w-8 h-8 md:w-12 md:h-12 opacity-50" />
      <div className="absolute top-4 right-4 border-t-2 border-r-2 border-[#00D4FF] w-8 h-8 md:w-12 md:h-12 opacity-50" />
      <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-[#00D4FF] w-8 h-8 md:w-12 md:h-12 opacity-50" />
      <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-[#00D4FF] w-8 h-8 md:w-12 md:h-12 opacity-50" />

      {/* Target Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <div className="relative flex items-center justify-center scale-75 md:scale-100 mt-[-20px] md:mt-0">
          <Crosshair className="w-56 h-56 text-[#00FF9C] stroke-[0.5]" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full border border-[#00D4FF] border-dashed w-[350px] h-[350px] opacity-30"
          />
           <div className="absolute rounded-full border border-white/20 w-32 h-32" />
        </div>
      </div>

      <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
        <span className="text-red-500 animate-pulse text-[8px] md:text-[10px]">●</span>
        <span className="text-white text-[10px] md:text-xs tracking-[0.2em] font-orbitron">CAM_1 (MAIN)</span>
      </div>

      {/* Pitch Ladder / HUD lines simulation */}
      <div className="absolute left-[10%] md:left-[30%] top-1/2 -translate-y-1/2 flex flex-col gap-[50px] md:gap-[80px] opacity-30">
        {[10, 0, -10].map((v) => (
          <div key={v} className="flex items-center gap-1 md:gap-2">
            <span className="font-orbitron text-[10px] md:text-xs text-[#00D4FF]">{v}</span>
            <div className={`h-px bg-[#00D4FF] ${v===0 ? 'w-10 md:w-24' : 'w-5 md:w-12'}`} />
          </div>
        ))}
      </div>
      <div className="absolute right-[10%] md:right-[30%] top-1/2 -translate-y-1/2 flex flex-col gap-[50px] md:gap-[80px] opacity-30">
        {[10, 0, -10].map((v) => (
          <div key={v} className="flex items-center gap-1 md:gap-2 flex-row-reverse">
            <span className="font-orbitron text-[10px] md:text-xs text-[#00D4FF]">{v}</span>
            <div className={`h-px bg-[#00D4FF] ${v===0 ? 'w-10 md:w-24' : 'w-5 md:w-12'}`} />
          </div>
        ))}
      </div>

      {/* Real-time overlaid metrics */}
      <div className="absolute bottom-6 md:bottom-10 flex justify-between w-full px-6 md:px-16 pointer-events-none">
        <div className="flex flex-col gap-0 md:gap-1 font-orbitron">
          <span className="text-[#00D4FF] text-[10px] md:text-xs tracking-widest opacity-80">ALTITUDE</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl tabular-nums tracking-wider text-white neon-text-blue">{alt.toFixed(1)}</span>
            <span className="text-xs md:text-sm text-white/50">M</span>
          </div>
        </div>
        <div className="flex flex-col gap-0 md:gap-1 text-right font-orbitron">
          <span className="text-[#00D4FF] text-[10px] md:text-xs tracking-widest opacity-80">AIRSPEED</span>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-2xl md:text-3xl tabular-nums tracking-wider text-white neon-text-blue">{spd.toFixed(1)}</span>
            <span className="text-xs md:text-sm text-white/50">KM/H</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
