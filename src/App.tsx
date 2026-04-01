import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';

import { DroneScene } from './components/DroneScene';
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { droneAudio } from './utils/audio';
import { SCENE_CONFIG } from './config/dashboard';

// Lazy-load heavy route pages — Three.js & Leaflet stay out of initial bundle
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const PortalPage = lazy(() => import('./pages/PortalPage').then(m => ({ default: m.PortalPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));

function RouteLoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
        <span className="font-orbitron text-[#00D4FF]/60 text-xs tracking-widest">LOADING MODULE</span>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const [sceneState, setSceneState] = useState<'parked' | 'arriving' | 'arrived'>('parked');

  const onArriving = useCallback(() => setSceneState('arriving'), []);
  const onArrived = useCallback(() => setSceneState('arrived'), []);
  const onDisconnected = useCallback(() => setSceneState('parked'), []);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/portal') {
      setSceneState('parked');
      droneAudio.stop();
    }
  }, [location.pathname]);

  return (
    <div className="w-screen h-screen bg-[#0A0A0A] overflow-hidden relative cursor-default text-white flex flex-col">

      {/* Global 3D Background — pauses render loop off-dashboard */}
      <div className="absolute inset-0 z-0 bg-[#0A0A0A] pointer-events-none">
        <ErrorBoundary label="3D Scene">
          <Canvas
            camera={{ position: SCENE_CONFIG.camera.position, fov: SCENE_CONFIG.camera.fov }}
          >
            <DroneScene
              isArrived={sceneState === 'arrived'}
              isParked={sceneState === 'parked'}
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Conditionally rendered Navbar logic */}
      {location.pathname !== '/system' && <Navbar />}

      {/* Router Content Overlay */}
      <div className="flex-1 relative z-10 w-full h-full">
        <Suspense fallback={<RouteLoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/portal" element={<PortalPage />} />
              <Route
                path="/system"
                element={
                  <DashboardPage
                    onArriving={onArriving}
                    onArrived={onArrived}
                    onDisconnected={onDisconnected}
                  />
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
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
