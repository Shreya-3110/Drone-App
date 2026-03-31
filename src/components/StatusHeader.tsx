import { motion } from 'framer-motion';
import { Wifi, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StatusHeader() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      className="w-full flex flex-col md:flex-row justify-between items-center glass-panel px-4 py-3 md:px-6 rounded-lg pointer-events-auto shadow-lg relative gap-3 md:gap-0"
    >
      {/* Glowing Accents */}
      <div className="absolute top-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-transparent to-[#00D4FF]" />
      <div className="absolute bottom-0 right-0 w-1/4 h-[2px] bg-gradient-to-l from-transparent to-[#7B61FF]" />

      <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-4">
        <div className="flex gap-2 items-center text-[#00FF9C]">
          <Wifi className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
          <span className="font-orbitron tracking-widest text-xs md:text-sm neon-text-green font-semibold">UPLINK ACTIVE</span>
        </div>
        <div className="h-4 w-px bg-white/20 mx-2 hidden md:block" />
        <div className="text-white/70 font-orbitron text-[10px] md:text-xs tracking-wider">
          UNIT: <span className="text-white font-medium">AX-7 OBLIVION</span>
        </div>
      </div>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 flex-col items-center pointer-events-none">
        <span className="font-orbitron font-bold text-xl tracking-[0.4em] text-[#00D4FF] neon-text-blue">
          NEXUS
        </span>
        <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent mt-1" />
      </div>

      <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-x-4 md:gap-6 text-sm font-orbitron border-t border-white/10 md:border-none pt-2 md:pt-0">
        <div className="text-white/80 tracking-widest text-[10px] md:text-xs">
          LATENCY: <span className="text-[#00FF9C]">12ms</span>
        </div>
        <div className="flex gap-1 items-center text-[#7B61FF]">
           <Zap className="w-3 h-3 md:w-4 md:h-4" />
          <span className="font-medium tracking-wide text-[10px] md:text-sm">SYS_OK</span>
        </div>
        <div className="text-white/60 tabular-nums tracking-widest bg-white/5 px-2 py-1 rounded border border-white/10 text-[10px] md:text-xs text-center min-w-[60px]">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>
    </motion.div>
  );
}
