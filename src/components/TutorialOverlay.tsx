import { motion } from 'framer-motion';
import { Play, Navigation, AlertCircle, Gamepad2 } from 'lucide-react';

interface TutorialProps {
  onStart: () => void;
}

export function TutorialOverlay({ onStart }: TutorialProps) {
  const steps = [
    { icon: <Navigation className="w-5 h-5 md:w-6 md:h-6 text-[#00D4FF]" />, title: "FLIGHT INFO", desc: "Check your drone's Height and Speed on the left side of your screen." },
    { icon: <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-[#00FF9C]" />, title: "DRONE CAMERA", desc: "Watch the live video feed straight from the drone directly in the center." },
    { icon: <Gamepad2 className="w-5 h-5 md:w-6 md:h-6 text-red-400" />, title: "DRIVE CONTROLS", desc: "Use the big buttons on the right to Take Off, Land, or Stop the drone!" },
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.8 } }}
    >
      <div className="max-w-xl w-full glass-panel border border-[#00D4FF]/30 p-6 md:p-10 rounded-3xl flex flex-col gap-6 md:gap-8 pointer-events-auto shadow-[0_0_50px_rgba(0,212,255,0.2)]">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 justify-center">
          <Play className="w-6 h-6 md:w-8 md:h-8 text-[#00D4FF] fill-[#00D4FF]" />
          <h2 className="font-orbitron font-bold text-xl md:text-3xl tracking-widest text-white neon-text-blue uppercase">
            HOW TO PLAY
          </h2>
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.2), duration: 0.5 }}
              className="flex items-center gap-4 p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">{step.icon}</div>
              <div className="flex flex-col gap-1 font-inter">
                <h3 className="font-orbitron tracking-widest text-[#00D4FF] text-xs md:text-sm font-bold uppercase">{step.title}</h3>
                <p className="text-white/60 text-[11px] md:text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-2 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={onStart}
            aria-label="Start flying the drone"
            className="w-full px-6 py-4 font-orbitron text-sm md:text-lg tracking-[0.2em] text-black bg-gradient-to-r from-[#00FF9C] to-[#00D4FF] hover:scale-105 rounded-xl font-bold shadow-[0_0_20px_#00FF9C] transition-all"
          >
            START FLYING!
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
