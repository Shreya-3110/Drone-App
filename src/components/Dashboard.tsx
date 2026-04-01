import { useState, memo } from 'react';
import { StatusHeader } from './StatusHeader';
import { LiveCameraPanel } from './LiveCameraPanel';
import { TelemetryPanel } from './TelemetryPanel';
import { ControlsOverlay } from './ControlsOverlay';
import { SatelliteMap } from './SatelliteMap';
import { ErrorBoundary } from './ErrorBoundary';
import { MonitorPlay, Map as MapIcon } from 'lucide-react';

interface DashboardProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const MemoTelemetryPanel = memo(TelemetryPanel);
const MemoLiveCameraPanel = memo(LiveCameraPanel);
const MemoSatelliteMap = memo(SatelliteMap);
const MemoControlsOverlay = memo(ControlsOverlay);

export function Dashboard({ isMuted, onToggleMute, isConnected, onConnect, onDisconnect }: DashboardProps) {
  const [centerView, setCenterView] = useState<'camera' | 'map'>('camera');

  return (
    <div className="absolute inset-0 z-10 flex flex-col font-inter pointer-events-none">
      <div className="p-3 md:p-4 xl:p-6 pointer-events-auto shrink-0 z-50">
        <StatusHeader
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          isConnected={isConnected}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 px-3 md:px-4 xl:px-6 pb-3 md:pb-4 xl:pb-6 flex flex-col xl:grid xl:grid-cols-12 gap-4 md:gap-6 relative overflow-y-auto xl:overflow-hidden pointer-events-auto">

        {/* Left Sidebar - Telemetry */}
        <div className="xl:col-span-3 flex flex-col pointer-events-auto order-2 xl:order-1 xl:min-w-[300px]">
          <ErrorBoundary label="Telemetry">
            <MemoTelemetryPanel isConnected={isConnected} />
          </ErrorBoundary>
        </div>

        {/* Center - Camera/Map with show/hide (map stays mounted) */}
        <div className="xl:col-span-6 h-[45vh] min-h-[280px] md:min-h-[350px] xl:h-full xl:min-h-0 flex flex-col relative pointer-events-auto order-1 xl:order-2">

           {/* Center View Toggle Bar */}
           <div className="flex justify-center shrink-0 z-30 mb-3 md:mb-4" role="tablist" aria-label="Center panel view">
             <div className="flex bg-black/80 backdrop-blur-md rounded-full border border-white/20 p-1 shadow-xl">
               <button
                  role="tab"
                  aria-selected={centerView === 'camera'}
                  aria-controls="panel-camera"
                  aria-label="Switch to drone camera view"
                  onClick={() => setCenterView('camera')}
                  className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-1.5 md:py-2 rounded-full font-orbitron text-[10px] md:text-sm font-bold tracking-widest transition-colors ${centerView === 'camera' ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/50' : 'text-white/50 hover:text-white border border-transparent'}`}
               >
                  <MonitorPlay className="w-3.5 h-3.5 md:w-5 md:h-5" /> CAMERA
               </button>
               <button
                  role="tab"
                  aria-selected={centerView === 'map'}
                  aria-controls="panel-map"
                  aria-label="Switch to satellite map view"
                  onClick={() => setCenterView('map')}
                  className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-1.5 md:py-2 rounded-full font-orbitron text-[10px] md:text-sm font-bold tracking-widest transition-colors ${centerView === 'map' ? 'bg-[#00FF9C]/20 text-[#00FF9C] border border-[#00FF9C]/50' : 'text-white/50 hover:text-white border border-transparent'}`}
               >
                  <MapIcon className="w-3.5 h-3.5 md:w-5 md:h-5" /> SATELLITE
               </button>
             </div>
           </div>

           {/* Both panels stay mounted; hidden one uses display:none to preserve state */}
           <div className="flex-1 w-full relative">
             <div id="panel-camera" role="tabpanel" className={centerView === 'camera' ? 'w-full h-full' : 'hidden'}>
               <ErrorBoundary label="Camera">
                 <MemoLiveCameraPanel isConnected={isConnected} />
               </ErrorBoundary>
             </div>
             <div id="panel-map" role="tabpanel" className={centerView === 'map' ? 'w-full h-full' : 'hidden'}>
               <ErrorBoundary label="Satellite Map">
                 <MemoSatelliteMap isConnected={isConnected} />
               </ErrorBoundary>
             </div>
           </div>
        </div>

        {/* Right Sidebar - Controls */}
        <div className="xl:col-span-3 flex flex-col pointer-events-auto order-3 xl:min-w-[300px]">
          <ErrorBoundary label="Controls">
            <MemoControlsOverlay isConnected={isConnected} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
