import { motion } from 'framer-motion';
import { Activity, Thermometer } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TelemetryPanel() {
  const [cpuHist, setCpuHist] = useState<number[]>(Array(20).fill(50));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuHist(prev => [...prev.slice(1), 30 + Math.random() * 50]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="glass-panel p-5 rounded-xl flex flex-col gap-6"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <Activity className="w-4 h-4 text-[#00D4FF]" />
        <h2 className="font-orbitron text-sm tracking-widest text-white/90">SYS_TELEMETRY</h2>
      </div>

      {/* Battery */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end font-orbitron">
          <span className="text-xs text-white/50 tracking-wider">BATTERY (LIPO 6S)</span>
          <span className="text-lg text-[#00FF9C] tracking-wide font-bold">84%</span>
        </div>
        <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-600 to-[#00FF9C] shadow-[0_0_10px_#00FF9C]" 
            initial={{ width: 0 }}
            animate={{ width: '84%' }}
            transition={{ duration: 1.5, delay: 1 }}
          />
        </div>
      </div>

      {/* CPU Usage Chart */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end font-orbitron">
          <span className="text-xs text-white/50 tracking-wider">CORE LOAD</span>
          <span className="text-sm text-[#00D4FF] tracking-wide">{Math.round(cpuHist[19])}%</span>
        </div>
        <div className="h-24 w-full flex items-end gap-1 border-b border-[#00D4FF]/20 pb-1 pt-4 relative">
          {/* Background grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_9px,rgba(255,255,255,0.05)_10px)] bg-[length:100%_10px] pointer-events-none" />
          
          {cpuHist.map((val, i) => (
            <motion.div 
              key={i}
              className="flex-1 bg-[#00D4FF]/60 rounded-t-sm relative shadow-[#00D4FF]/20 shadow-[0_0_5px]"
              animate={{ height: `${val}%` }}
              transition={{ type: 'tween', duration: 0.5 }}
            />
          ))}
        </div>
      </div>

      {/* Temp */}
      <div className="flex items-center justify-between border border-white/5 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
        <div className="flex gap-2 items-center">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <span className="font-orbitron text-xs text-white/70 tracking-widest">MOTOR TEMP</span>
        </div>
        <span className="font-orbitron font-bold text-sm text-orange-400 hover:text-orange-300">42°C</span>
      </div>
    </motion.div>
  );
}
