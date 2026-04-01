import { motion } from 'framer-motion';
import { VolumeX, Volume2, BatteryCharging, PowerOff, Plug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CONNECTION_CONFIG } from '../config/dashboard';

interface StatusHeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function StatusHeader({ isMuted, onToggleMute, isConnected, onConnect, onDisconnect }: StatusHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      className="w-full flex flex-col xl:flex-row justify-between items-center glass-panel px-4 py-3 md:px-6 rounded-lg pointer-events-auto shadow-lg relative gap-3 xl:gap-0"
      role="banner"
      aria-label="Dashboard status bar"
    >
      {/* Glowing Accents */}
      <div className="absolute top-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-transparent to-[#00D4FF]" />
      <div className="absolute bottom-0 right-0 w-1/4 h-[2px] bg-gradient-to-l from-transparent to-[#7B61FF]" />

      {/* Left side: Mission Planner Connect Block */}
      <div className="flex items-center gap-2 md:gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
        <select
          disabled={isConnected}
          aria-label="Connection port"
          className="bg-black/80 border border-[#00D4FF]/50 text-[#00D4FF] font-orbitron text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-md outline-none focus:border-[#00D4FF] transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_10px_rgba(0,212,255,0.2)]"
        >
          {CONNECTION_CONFIG.ports.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select
          disabled={isConnected}
          aria-label="Baud rate"
          className="bg-black/80 border border-[#00D4FF]/50 text-[#00D4FF] font-orbitron text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-md outline-none focus:border-[#00D4FF] transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_10px_rgba(0,212,255,0.2)]"
        >
          {CONNECTION_CONFIG.baudRates.map(rate => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>

        {!isConnected ? (
          <button
            onClick={onConnect}
            aria-label="Connect to drone"
            className="flex items-center gap-2 bg-gradient-to-r from-[#00FF9C]/20 to-[#00FF9C]/10 hover:from-[#00FF9C]/40 border border-[#00FF9C] text-[#00FF9C] shadow-[0_0_20px_rgba(0,255,156,0.3)] px-4 py-1.5 md:py-2 rounded-md font-orbitron font-bold text-xs md:text-sm tracking-widest transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plug className="w-4 h-4 md:w-5 md:h-5 drop-shadow-[0_0_5px_#00FF9C]" /> CONNECT
          </button>
        ) : (
          <button
            onClick={onDisconnect}
            aria-label="Disconnect from drone"
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] px-4 py-1.5 md:py-2 rounded-md font-orbitron font-bold text-xs md:text-sm tracking-widest transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PowerOff className="w-4 h-4" /> DISCONNECT
          </button>
        )}
      </div>

      {/* Center: Branding */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 flex-col items-center pointer-events-none">
        <span className="font-orbitron font-bold text-xl tracking-[0.4em] text-[#00D4FF] neon-text-blue">
          NEXUS
        </span>
        <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent mt-1" />
      </div>

      {/* Right side: Exit, Battery, Audio Toggle */}
      <div className="flex items-center justify-between w-full xl:w-auto xl:justify-end gap-x-3 md:gap-6 text-sm font-orbitron border-t border-white/10 xl:border-none pt-2 xl:pt-0">

        <div
          className={`flex gap-2 items-center px-4 py-1.5 rounded-full border ${isConnected ? 'text-[#00FF9C] border-[#00FF9C]/30 bg-[#00FF9C]/10 shadow-[0_0_10px_rgba(0,255,156,0.2)]' : 'text-white/30 border-white/10 bg-white/5'}`}
          role="status"
          aria-label={`Battery ${isConnected ? '84%' : 'unavailable'}`}
        >
          <BatteryCharging className={`w-4 h-4 ${isConnected && 'animate-pulse'}`} />
          <span className="font-orbitron tracking-widest text-[10px] md:text-xs font-bold">{isConnected ? '84%' : '--%'}</span>
        </div>

        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          className="flex gap-2 items-center text-white/50 hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 shrink-0"
        >
          {isMuted ? <VolumeX className="w-3 h-3 md:w-4 md:h-4 text-red-500" /> : <Volume2 className="w-3 h-3 md:w-4 md:h-4 text-[#00D4FF]" />}
        </button>

        <button
          onClick={() => navigate('/')}
          aria-label="Exit dashboard"
          className="text-red-400 border border-red-500/50 bg-red-500/10 px-4 py-1.5 rounded-full text-[10px] md:text-xs tracking-widest hover:bg-red-500/30 transition-colors font-bold shrink-0 cursor-pointer"
        >
           EXIT
        </button>
      </div>
    </motion.div>
  );
}
