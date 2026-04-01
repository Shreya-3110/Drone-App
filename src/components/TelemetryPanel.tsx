import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TELEMETRY_CONFIG } from '../config/dashboard';

export function TelemetryPanel({ isConnected }: { isConnected: boolean }) {
  const [data, setData] = useState({
    height: 0,
    speed: 0,
    targetDist: 0,
    direction: 0,
    climbRate: 0,
    homeDist: 0,
  });

  const d = TELEMETRY_CONFIG.defaults;

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      const time = Date.now() / 2000;
      setData({
        height: d.height + Math.sin(time) * 10,
        speed: d.speed + Math.cos(time * 0.8) * 5,
        targetDist: d.targetDist + Math.sin(time * 0.5) * 50,
        direction: (d.direction + time * 5) % 360,
        climbRate: Math.sin(time) * 2.5,
        homeDist: d.homeDist + Math.cos(time * 0.4) * 40,
      });
    }, TELEMETRY_CONFIG.updateIntervalMs);
    return () => clearInterval(interval);
  }, [isConnected, d]);

  const metrics = [
    { label: "Height (m)", value: isConnected ? Math.abs(data.height).toFixed(1) : "--", color: "text-[#B026FF]", shadow: "drop-shadow-[0_0_10px_rgba(176,38,255,0.4)]" },
    { label: "Speed (m/s)", value: isConnected ? Math.abs(data.speed).toFixed(1) : "--", color: "text-[#FF8A00]", shadow: "drop-shadow-[0_0_10px_rgba(255,138,0,0.4)]" },
    { label: "Target Dist (m)", value: isConnected ? Math.max(0, data.targetDist).toFixed(1) : "--", color: "text-[#FF0055]", shadow: "drop-shadow-[0_0_10px_rgba(255,0,85,0.4)]" },
    { label: "Direction (\u00B0)", value: isConnected ? Math.round(data.direction).toString() : "--", color: "text-[#00FF9C]", shadow: "drop-shadow-[0_0_10px_rgba(0,255,156,0.4)]" },
    { label: "Climb Rate", value: isConnected ? data.climbRate.toFixed(1) : "--", color: "text-[#FFE600]", shadow: "drop-shadow-[0_0_10px_rgba(255,230,0,0.4)]" },
    { label: "Home Dist (m)", value: isConnected ? data.homeDist.toFixed(1) : "--", color: "text-[#00D4FF]", shadow: "drop-shadow-[0_0_10px_rgba(0,212,255,0.4)]" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className={`glass-panel p-3 md:p-5 rounded-xl flex flex-col gap-3 md:gap-4 w-full min-h-0 md:min-h-[400px] h-full pointer-events-auto border transition-colors duration-1000 ${isConnected ? 'border-white/10 bg-black/40' : 'border-white/5 bg-black/80'}`}
      role="region"
      aria-label="Flight telemetry data"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 md:w-5 md:h-5 text-white/50" />
          <h2 className="font-orbitron font-bold tracking-widest text-white/50 text-xs md:text-sm uppercase">
            Flight Info
          </h2>
        </div>
        {!isConnected && <span className="text-[10px] md:text-xs font-orbitron text-white/30 tracking-widest animate-pulse" aria-live="polite">NO DATA</span>}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3 md:gap-4 content-center opacity-100 transition-opacity duration-1000">
        {metrics.map((m, i) => (
          <div
            key={i}
            className={`bg-black/60 border rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-500 shadow-inner ${isConnected ? 'border-white/5 hover:bg-white/5' : 'border-black opacity-50'}`}
            role="status"
            aria-label={`${m.label}: ${m.value}`}
          >
            <span className="font-inter text-white/40 text-[9px] md:text-[11px] tracking-widest uppercase mb-1 md:mb-2">{m.label}</span>
            <span className={`font-orbitron text-2xl md:text-4xl font-bold tracking-wider tabular-nums transition-colors duration-1000 ${isConnected ? `${m.color} ${m.shadow}` : 'text-white/20'}`}>
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
