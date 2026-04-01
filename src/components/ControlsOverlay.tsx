import { motion } from 'framer-motion';
import { Gamepad2, Rocket, ArrowDownToLine, TriangleAlert } from 'lucide-react';
import { useState, useRef } from 'react';

export function ControlsOverlay({ isConnected }: { isConnected: boolean }) {
  const [isFlying, setIsFlying] = useState(false);
  
  // Joystick State
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !joystickRef.current || !isConnected) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const radius = rect.width / 2;
    const centerX = rect.left + radius;
    const centerY = rect.top + radius;
    
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    
    const distance = Math.sqrt(dx*dx + dy*dy);
    if (distance > radius) {
      dx = (dx / distance) * radius;
      dy = (dy / distance) * radius;
    }
    
    setJoystickPos({ x: dx, y: dy });
  };

  const resetJoystick = () => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className={`glass-panel p-4 md:p-6 rounded-xl flex flex-col gap-6 w-full h-full pointer-events-auto border transition-colors duration-1000 ${isConnected ? 'border-[#7B61FF]/20 bg-black/40' : 'border-white/5 bg-black/80'}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className={`w-4 h-4 md:w-5 md:h-5 ${isConnected ? 'text-[#7B61FF]' : 'text-white/30'}`} />
          <h2 className={`font-orbitron font-bold tracking-widest text-sm md:text-base uppercase ${isConnected ? 'text-[#7B61FF]' : 'text-white/30'}`}>
            Drive Controls
          </h2>
        </div>
        {!isConnected ? (
          <span className="text-white/30 font-orbitron text-[10px] md:text-xs tracking-widest border border-white/10 px-2 py-1 rounded bg-white/5 animate-pulse">NO LINK</span>
        ) : !isFlying ? (
          <span className="text-red-400 font-orbitron text-[10px] md:text-xs animate-pulse tracking-widest border border-red-500/30 px-2 py-1 rounded bg-red-500/10">ON GROUND</span>
        ) : (
          <span className="text-[#00FF9C] font-orbitron text-[10px] md:text-xs tracking-widest border border-[#00FF9C]/30 px-2 py-1 rounded bg-[#00FF9C]/10 drop-shadow-[0_0_8px_#00FF9C]">IN AIR</span>
        )}
      </div>

      <div className={`flex flex-col gap-4 mt-2 transition-opacity duration-1000 ${isConnected ? 'opacity-100' : 'opacity-30'}`}>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setIsFlying(true)}
            disabled={isFlying || !isConnected}
            className={`py-6 md:py-8 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 font-orbitron font-bold tracking-widest border-2 ${
              !isFlying && isConnected
                ? 'bg-gradient-to-b from-[#00D4FF]/20 to-transparent border-[#00D4FF] hover:from-[#00D4FF]/40 text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] cursor-pointer' 
                : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Rocket className={`w-8 h-8 md:w-10 md:h-10 ${!isFlying && isConnected && 'animate-bounce'}`} />
            <span className="text-[10px] md:text-xs uppercase">Take Off</span>
          </button>

          <button 
            onClick={() => setIsFlying(false)}
            disabled={!isFlying || !isConnected}
            className={`py-6 md:py-8 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 font-orbitron font-bold tracking-widest border-2 ${
              isFlying && isConnected
                ? 'bg-gradient-to-b from-[#00FF9C]/20 to-transparent border-[#00FF9C] hover:from-[#00FF9C]/40 text-[#00FF9C] shadow-[0_0_20px_rgba(0,255,156,0.3)] hover:scale-[1.02] cursor-pointer' 
                : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <ArrowDownToLine className="w-8 h-8 md:w-10 md:h-10" />
            <span className="text-[10px] md:text-xs uppercase">Land</span>
          </button>
        </div>

        <button 
          disabled={!isConnected}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] font-orbitron font-bold tracking-widest text-xs md:text-sm ${
             isConnected ? 'bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent border border-red-500 text-red-500 hover:bg-red-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer' : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          <TriangleAlert className="w-5 h-5 md:w-6 md:h-6" />
          <span>STOP</span>
        </button>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center min-h-[160px] md:mt-4 rounded-2xl p-4 transition-all duration-1000 ${isConnected ? 'bg-black/30 border border-white/5' : 'bg-transparent border-transparent opacity-30'}`}>
        <span className="font-inter text-white/50 text-[10px] tracking-widest uppercase mb-4">Direction Stick</span>
        <div 
          ref={joystickRef}
          className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-2 relative flex flex-col items-center justify-center shadow-inner ${isConnected ? 'border-white/10 bg-black/40' : 'border-white/5 bg-transparent'}`}
          onPointerDown={(e) => { if (isConnected) { setIsDragging(true); handlePointerMove(e); } }}
          onPointerMove={handlePointerMove}
          onPointerUp={resetJoystick}
          onPointerLeave={resetJoystick}
          style={{ touchAction: 'none', cursor: isConnected ? 'crosshair' : 'not-allowed' }}
        >
          {/* Track markers */}
          <div className="absolute top-2 w-1 h-3 bg-white/20 rounded-full" />
          <div className="absolute bottom-2 w-1 h-3 bg-white/20 rounded-full" />
          <div className="absolute left-2 w-3 h-1 bg-white/20 rounded-full" />
          <div className="absolute right-2 w-3 h-1 bg-white/20 rounded-full" />
          
          <motion.div 
            animate={{ x: joystickPos.x, y: joystickPos.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-colors ${
              !isConnected ? 'bg-white/10 border-white/20' : isDragging ? 'bg-[#7B61FF] border-[#7B61FF] scale-110 shadow-[0_0_20px_#7B61FF]' : 'bg-[#7B61FF]/60 border-[#7B61FF]/50 shadow-[0_0_10px_#7B61FF]'
            }`}
          >
             <div className="w-5 h-5 rounded-full border border-black/20" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
