import { motion } from 'framer-motion';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <motion.div 
      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-[4px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="max-w-3xl w-full flex flex-col items-center justify-center gap-12 text-center pointer-events-auto">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="font-orbitron font-black text-4xl md:text-7xl tracking-[0.2em] text-white neon-text-blue">
              NEXUS
            </h1>
            <h2 className="font-orbitron text-sm md:text-xl tracking-[0.5em] text-[#00D4FF] mt-2">
              DRONE CONTROL SYSTEM
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-full max-w-[200px] md:max-w-md h-[1px] bg-gradient-to-r from-transparent via-[#00FF9C] to-transparent mt-4 opacity-50" 
          />
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="font-inter text-white/60 text-xs md:text-base max-w-xl"
        >
          Welcome to the next-generation autonomous flight telemetry interface.
          Ensure your neural link is stable before proceeding.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(0,212,255)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="mt-4 md:mt-8 px-8 py-3 md:px-10 md:py-4 font-orbitron font-bold tracking-[0.2em] text-[#00D4FF] border justify-center border-[#00D4FF]/40 bg-[#00D4FF]/10 rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:bg-[#00D4FF]/20 hover:border-[#00D4FF] transition-all duration-300 neon-border-blue"
        >
           ENTER SYSTEM
        </motion.button>
      </div>
    </motion.div>
  );
}
