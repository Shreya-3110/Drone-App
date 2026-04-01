import { motion } from 'framer-motion';
import { Gamepad2, Rocket, ArrowDownToLine, TriangleAlert } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';

const KEYBOARD_STEP = 0.3; // fraction of radius per key-repeat frame

export function ControlsOverlay({ isConnected }: { isConnected: boolean }) {
  const [isFlying, setIsFlying] = useState(false);

  // Joystick — direct DOM for zero-lag pointer tracking
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: 0, y: 0 });

  // Track which keyboard keys are held
  const keysRef = useRef(new Set<string>());
  const keyRafRef = useRef<number>(0);

  const updateKnob = useCallback((x: number, y: number) => {
    posRef.current = { x, y };
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, []);

  // --- Pointer handlers ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isConnected || !joystickRef.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rect = joystickRef.current.getBoundingClientRect();
    const radius = rect.width / 2;
    const cx = rect.left + radius;
    const cy = rect.top + radius;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > radius) { dx = (dx / dist) * radius; dy = (dy / dist) * radius; }
    updateKnob(dx, dy);
  }, [isConnected, updateKnob]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current || !joystickRef.current) return;
    cancelAnimationFrame(rafRef.current);
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      if (!joystickRef.current) return;
      const rect = joystickRef.current.getBoundingClientRect();
      const radius = rect.width / 2;
      const cx = rect.left + radius;
      const cy = rect.top + radius;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) { dx = (dx / dist) * radius; dy = (dy / dist) * radius; }
      updateKnob(dx, dy);
    });
  }, [updateKnob]);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    cancelAnimationFrame(rafRef.current);
    updateKnob(0, 0);
  }, [updateKnob]);

  // --- Keyboard handlers (WASD + Arrows) ---
  const keyboardLoop = useCallback(() => {
    if (!joystickRef.current || keysRef.current.size === 0) {
      // All keys released — snap to center
      if (posRef.current.x !== 0 || posRef.current.y !== 0) {
        updateKnob(0, 0);
      }
      keyRafRef.current = 0;
      return;
    }

    const radius = joystickRef.current.getBoundingClientRect().width / 2;
    const step = radius * KEYBOARD_STEP;
    let { x, y } = posRef.current;

    const keys = keysRef.current;
    if (keys.has('ArrowUp') || keys.has('w')) y -= step;
    if (keys.has('ArrowDown') || keys.has('s')) y += step;
    if (keys.has('ArrowLeft') || keys.has('a')) x -= step;
    if (keys.has('ArrowRight') || keys.has('d')) x += step;

    // Clamp to circle
    const dist = Math.sqrt(x * x + y * y);
    if (dist > radius) { x = (x / dist) * radius; y = (y / dist) * radius; }

    updateKnob(x, y);
    keyRafRef.current = requestAnimationFrame(keyboardLoop);
  }, [updateKnob]);

  useEffect(() => {
    if (!isConnected) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        if (!keysRef.current.has(key)) {
          keysRef.current.add(key);
          setIsDragging(true);
          if (!keyRafRef.current) {
            keyRafRef.current = requestAnimationFrame(keyboardLoop);
          }
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
      if (keysRef.current.size === 0) {
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(keyRafRef.current);
      keysRef.current.clear();
    };
  }, [isConnected, keyboardLoop]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(keyRafRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className={`glass-panel p-4 md:p-6 rounded-xl flex flex-col gap-4 md:gap-6 w-full h-full pointer-events-auto border transition-colors duration-1000 ${isConnected ? 'border-[#7B61FF]/20 bg-black/40' : 'border-white/5 bg-black/80'}`}
      role="region"
      aria-label="Flight controls"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className={`w-4 h-4 md:w-5 md:h-5 ${isConnected ? 'text-[#7B61FF]' : 'text-white/30'}`} />
          <h2 className={`font-orbitron font-bold tracking-widest text-sm md:text-base uppercase ${isConnected ? 'text-[#7B61FF]' : 'text-white/30'}`}>
            Drive Controls
          </h2>
        </div>
        {!isConnected ? (
          <span className="text-white/30 font-orbitron text-[10px] md:text-xs tracking-widest border border-white/10 px-2 py-1 rounded bg-white/5 animate-pulse" aria-live="polite">NO LINK</span>
        ) : !isFlying ? (
          <span className="text-red-400 font-orbitron text-[10px] md:text-xs animate-pulse tracking-widest border border-red-500/30 px-2 py-1 rounded bg-red-500/10" aria-live="polite">ON GROUND</span>
        ) : (
          <span className="text-[#00FF9C] font-orbitron text-[10px] md:text-xs tracking-widest border border-[#00FF9C]/30 px-2 py-1 rounded bg-[#00FF9C]/10 drop-shadow-[0_0_8px_#00FF9C]" aria-live="polite">IN AIR</span>
        )}
      </div>

      <div className={`flex flex-col gap-3 md:gap-4 transition-opacity duration-1000 ${isConnected ? 'opacity-100' : 'opacity-30'}`}>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsFlying(true)}
            disabled={isFlying || !isConnected}
            aria-label="Take off drone"
            className={`py-5 md:py-8 rounded-2xl flex flex-col items-center justify-center gap-2 md:gap-3 transition-all duration-300 font-orbitron font-bold tracking-widest border-2 ${
              !isFlying && isConnected
                ? 'bg-gradient-to-b from-[#00D4FF]/20 to-transparent border-[#00D4FF] hover:from-[#00D4FF]/40 text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] cursor-pointer'
                : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Rocket className={`w-7 h-7 md:w-10 md:h-10 ${!isFlying && isConnected && 'animate-bounce'}`} />
            <span className="text-[10px] md:text-xs uppercase">Take Off</span>
          </button>

          <button
            onClick={() => setIsFlying(false)}
            disabled={!isFlying || !isConnected}
            aria-label="Land drone"
            className={`py-5 md:py-8 rounded-2xl flex flex-col items-center justify-center gap-2 md:gap-3 transition-all duration-300 font-orbitron font-bold tracking-widest border-2 ${
              isFlying && isConnected
                ? 'bg-gradient-to-b from-[#00FF9C]/20 to-transparent border-[#00FF9C] hover:from-[#00FF9C]/40 text-[#00FF9C] shadow-[0_0_20px_rgba(0,255,156,0.3)] hover:scale-[1.02] cursor-pointer'
                : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <ArrowDownToLine className="w-7 h-7 md:w-10 md:h-10" />
            <span className="text-[10px] md:text-xs uppercase">Land</span>
          </button>
        </div>

        <button
          disabled={!isConnected}
          aria-label="Emergency stop drone"
          className={`w-full py-3 md:py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] font-orbitron font-bold tracking-widest text-xs md:text-sm ${
             isConnected ? 'bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent border border-red-500 text-red-500 hover:bg-red-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer' : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          <TriangleAlert className="w-5 h-5 md:w-6 md:h-6" />
          <span>STOP</span>
        </button>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center min-h-[140px] md:min-h-[160px] rounded-2xl p-3 md:p-4 transition-all duration-1000 ${isConnected ? 'bg-black/30 border border-white/5' : 'bg-transparent border-transparent opacity-30'}`}>
        <span className="font-inter text-white/50 text-[10px] tracking-widest uppercase mb-1 md:mb-2">Direction Stick</span>
        <span className="font-inter text-white/30 text-[8px] tracking-wider uppercase mb-2 md:mb-3">WASD or Arrow Keys</span>
        <div
          ref={joystickRef}
          role="application"
          aria-label="Directional joystick — use WASD or arrow keys, or drag with mouse/touch"
          tabIndex={0}
          className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-2 relative flex flex-col items-center justify-center shadow-inner select-none outline-none focus-visible:ring-2 focus-visible:ring-[#7B61FF]/50 ${isConnected ? 'border-white/10 bg-black/40' : 'border-white/5 bg-transparent'}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'none', cursor: isConnected ? 'crosshair' : 'not-allowed' }}
        >
          {/* Track markers */}
          <div className="absolute top-2 w-1 h-3 bg-white/20 rounded-full" />
          <div className="absolute bottom-2 w-1 h-3 bg-white/20 rounded-full" />
          <div className="absolute left-2 w-3 h-1 bg-white/20 rounded-full" />
          <div className="absolute right-2 w-3 h-1 bg-white/20 rounded-full" />

          <div
            ref={knobRef}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 will-change-transform ${
              !isConnected ? 'bg-white/10 border-white/20' : isDragging ? 'bg-[#7B61FF] border-[#7B61FF] scale-110 shadow-[0_0_20px_#7B61FF]' : 'bg-[#7B61FF]/60 border-[#7B61FF]/50 shadow-[0_0_10px_#7B61FF]'
            }`}
            style={{
              transform: 'translate(0px, 0px)',
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.2s, border-color 0.2s, box-shadow 0.2s',
            }}
          >
             <div className="w-5 h-5 rounded-full border border-black/20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
