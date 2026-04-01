import { motion } from 'framer-motion';
import { Shield, Zap, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const features = [
    { icon: <Crosshair className="w-6 h-6 text-[#00D4FF]" />, title: 'PRECISION TRACKING', desc: 'Real-time telemetry and positional data overlay with sub-millimeter accuracy.' },
    { icon: <Zap className="w-6 h-6 text-[#7B61FF]" />, title: 'ULTRA LOW LATENCY', desc: 'Neuromorphic link enables 12ms round-trip execution for critical maneuvers.' },
    { icon: <Shield className="w-6 h-6 text-[#00FF9C]" />, title: 'DEFENSE GRADE', desc: 'Encrypted uplink ensures full systemic autonomy without external intrusion.' }
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-10 flex items-center justify-center p-6 md:p-12 overflow-y-auto pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.5 } }}
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[500px] mt-24 md:mt-0">
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="inline-block px-3 py-1 border border-[#00D4FF]/30 bg-[#00D4FF]/10 rounded text-[#00D4FF] font-orbitron text-[10px] md:text-xs tracking-widest mb-6 uppercase glass-panel">Next Gen Flight Ops</div>
            <h1 className="text-4xl md:text-6xl font-orbitron font-black text-white leading-tight uppercase tracking-wide">
              Dominate the skies with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">NEXUS</span>
            </h1>
            <p className="font-inter text-white/60 mt-6 max-w-lg leading-relaxed text-sm md:text-base">
              Experience unparalleled control with our military-grade drone telemetry interface. Establish a neural link and monitor live metrics in a stunning, fully immersive 3D environment.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 mt-6"
          >
            <Link to="/portal" className="px-6 py-3 md:px-8 bg-[#00D4FF]/20 border border-[#00D4FF] text-[#00D4FF] font-orbitron text-xs md:text-sm tracking-widest hover:bg-[#00D4FF] hover:text-black transition-colors rounded shadow-[0_0_15px_rgba(0,212,255,0.4)]">
              ENTER SECURE PORTAL
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative"
        >
          {/* Subtle Glass background for features block */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 -z-10 md:scale-105" />
          
          {features.map((f, i) => (
            <div key={i} className={`p-5 md:p-6 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors ${i === 2 ? 'sm:col-span-2' : ''}`}>
               <div className="mb-4 bg-black/30 w-12 h-12 flex items-center justify-center rounded-lg border border-white/5">{f.icon}</div>
               <h3 className="font-orbitron font-bold text-white mb-2 tracking-wide text-xs md:text-sm">{f.title}</h3>
               <p className="font-inter text-xs text-white/50">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
