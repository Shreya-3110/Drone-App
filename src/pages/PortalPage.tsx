import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LandingPage as LandingView } from '../components/LandingPage';
import { TutorialOverlay } from '../components/TutorialOverlay';

export function PortalPage() {
  const [stage, setStage] = useState<'auth' | 'tutorial'>('auth');
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/system');
  };

  return (
    <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
      <AnimatePresence mode="wait">
        {stage === 'auth' && (
          <LandingView key="auth" onEnter={() => setStage('tutorial')} />
        )}

        {stage === 'tutorial' && (
          <TutorialOverlay key="tutorial" onStart={handleStart} />
        )}
      </AnimatePresence>
    </div>
  );
}
