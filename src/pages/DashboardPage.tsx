import { useState, useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { droneAudio } from '../utils/audio';
import { AnimatePresence, motion } from 'framer-motion';

interface DashboardPageProps {
  onArriving: () => void;
  onArrived: () => void;
  onDisconnected: () => void; // Tell App.tsx to park drone
}

export function DashboardPage({ onArriving, onArrived, onDisconnected }: DashboardPageProps) {
  // connectionState replaces "stage" logic
  // 'disconnected' (initial state waiting for user) -> 'connecting' (boot sequence) -> 'connected' (active telemetry)
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (connectionState === 'connecting') {
      droneAudio.init();
      droneAudio.play();
      droneAudio.setMuted(isMuted);

      const timer1 = setTimeout(() => {
        setConnectionState('connected');
        onArrived(); 
        droneAudio.stop(); // Automatically silence the hum once the drone arrives
      }, 4000); // 4-second boot sequence
      
      onArriving(); // Tell App.tsx to start drone fly-in immediately when CONNECT is clicked
      
      return () => clearTimeout(timer1);
    } else if (connectionState === 'disconnected') {
      onDisconnected();
      droneAudio.stop();
    }
  }, [connectionState, onArrived, onArriving, onDisconnected]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnect = () => {
    setConnectionState('connecting');
  };

  const handleDisconnect = () => {
    setConnectionState('disconnected');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    droneAudio.setMuted(!isMuted);
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence>
        {connectionState === 'connecting' && (
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 text-center pointer-events-auto"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <p className="text-white/40 font-orbitron tracking-[0.2em] md:tracking-[0.5em] text-xs md:text-sm animate-pulse flex items-center justify-center">INITIATING CONTROL SYSTEM</p>
            <p className="text-white/20 font-inter text-[10px] md:text-xs mt-4">ESTABLISHING CONNECTION...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
         <Dashboard 
            isMuted={isMuted} 
            onToggleMute={toggleMute} 
            isConnected={connectionState === 'connected'}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
         />
      </AnimatePresence>
    </div>
  );
}
