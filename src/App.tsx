import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { DroneScene } from './components/DroneScene';
import { Dashboard } from './components/Dashboard';
import { droneAudio } from './utils/audio';

function App() {
  const [stage, setStage] = useState<'initial' | 'entering' | 'dashboard'>('initial');
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    // Stage 1: Initial black screen (2 seconds) then start enter
    const timer1 = setTimeout(() => {
      setStage('entering');
    }, 2000);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    if (stage === 'entering') {
      // Drone fly-in takes ~4 seconds
      const timer2 = setTimeout(() => {
        setStage('dashboard');
      }, 4000);
      return () => clearTimeout(timer2);
    }
  }, [stage]);

  // Handle interaction to unlock audio
  useEffect(() => {
    const handleInteraction = () => {
      if (!audioEnabled && stage !== 'initial') {
        droneAudio.init();
        droneAudio.play();
        setAudioEnabled(true);
      }
    };
    
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, [audioEnabled, stage]);

  return (
    <div className="w-screen h-screen bg-[#0A0A0A] overflow-hidden relative cursor-default text-white">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 bg-[#0A0A0A]">
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          {stage !== 'initial' && <DroneScene isArrived={stage === 'dashboard'} />}
        </Canvas>
      </div>

      {/* Intro Black Screen Overlay */}
      <AnimatePresence>
        {stage === 'initial' && (
          <motion.div 
            className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <p className="text-white/40 font-orbitron tracking-[0.5em] text-sm animate-pulse">INITIATING CONTROL SYSTEM</p>
            <p className="text-white/20 font-inter text-xs mt-4">ESTABLISHING CONNECTION...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click To Start Audio Reminder (Optional) */}
      {!audioEnabled && stage !== 'initial' && (
        <div className="absolute top-4 right-4 z-[60] text-xs font-inter text-white/50 tracking-widest pointer-events-none animate-pulse">
          CLICK ANYWHERE TO ENABLE AUDIO
        </div>
      )}

      {/* Main HUD Dashboard */}
      <AnimatePresence>
        {stage === 'dashboard' && (
           <Dashboard />
        )}
      </AnimatePresence>

    </div>
  )
}

export default App
