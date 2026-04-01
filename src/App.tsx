import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';

import { DroneScene } from './components/DroneScene';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PortalPage } from './pages/PortalPage';
import { DashboardPage } from './pages/DashboardPage';
import { droneAudio } from './utils/audio';

function AppContent() {
  const location = useLocation();
  const [sceneState, setSceneState] = useState<'parked' | 'arriving' | 'arrived'>('parked');

  useEffect(() => {
    // If we land on home or portal, keep the drone parked and ensure audio is cut
    if (location.pathname === '/' || location.pathname === '/portal') {
      setSceneState('parked');
      droneAudio.stop();
    }
  }, [location.pathname]);

  return (
    <div className="w-screen h-screen bg-[#0A0A0A] overflow-hidden relative cursor-default text-white flex flex-col">
      
      {/* Global 3D Background persistently rendered across routes */}
      <div className="absolute inset-0 z-0 bg-[#0A0A0A] pointer-events-none">
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <DroneScene 
            isArrived={sceneState === 'arrived'} 
            isParked={sceneState === 'parked'} 
          />
        </Canvas>
      </div>

      {/* Conditionally rendered Navbar logic */}
      {location.pathname !== '/system' && <Navbar />}

      {/* Router Content Overlay */}
      <div className="flex-1 relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/portal" element={<PortalPage />} />
            <Route 
              path="/system" 
              element={
                <DashboardPage 
                  onArriving={() => setSceneState('arriving')} 
                  onArrived={() => setSceneState('arrived')} 
                  onDisconnected={() => setSceneState('parked')}
                />
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
