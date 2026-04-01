import { useState } from 'react';
import { StatusHeader } from './StatusHeader';
import { LiveCameraPanel } from './LiveCameraPanel';
import { TelemetryPanel } from './TelemetryPanel';
import { ControlsOverlay } from './ControlsOverlay';
import { SatelliteMap } from './SatelliteMap';
import { MonitorPlay, Map as MapIcon } from 'lucide-react';

interface DashboardProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function Dashboard({ isMuted, onToggleMute, isConnected, onConnect, onDisconnect }: DashboardProps) {
  const [centerView, setCenterView] = useState<'camera' | 'map'>('camera');

  return (
    <div className="absolute inset-0 z-10 flex flex-col font-inter pointer-events-none">
      <div className="p-4 md:p-6 pointer-events-auto shrink-0 z-50">
        <StatusHeader 
          isMuted={isMuted} 
          onToggleMute={onToggleMute} 
          isConnected={isConnected}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 px-4 md:px-6 pb-4 md:pb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 relative overflow-y-auto xl:overflow-hidden pointer-events-auto md:pointer-events-none">
        
        {/* Left Sidebar - Telemetry Grid 6x */}
        <div className="md:col-span-1 xl:col-span-3 flex flex-col justify-between pointer-events-auto order-2 md:order-2 xl:order-1 mt-2 md:mt-0 xl:min-w-[320px] lg:min-w-[300px]">
          <TelemetryPanel isConnected={isConnected} />
        </div>

        {/* Center - Toggleable Camera/Map */}
        <div className="md:col-span-2 xl:col-span-6 h-[50vh] min-h-[400px] xl:h-full xl:min-h-0 flex flex-col relative pointer-events-auto order-1 md:order-1 xl:order-2">
           
           {/* Center View Toggle Bar */}
           <div className="flex justify-center shrink-0 z-30 mb-4 absolute lg:relative -top-8 lg:top-0 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 w-max max-w-full">
             <div className="flex bg-black/80 backdrop-blur-md rounded-full border border-white/20 p-1 shadow-xl">
               <button 
                  onClick={() => setCenterView('camera')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-orbitron text-[10px] md:text-sm font-bold tracking-widest transition-colors ${centerView === 'camera' ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/50' : 'text-white/50 hover:text-white border border-transparent'}`}
               >
                  <MonitorPlay className="w-4 h-4 md:w-5 md:h-5" /> CAMERA
               </button>
               <button 
                  onClick={() => setCenterView('map')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-orbitron text-[10px] md:text-sm font-bold tracking-widest transition-colors ${centerView === 'map' ? 'bg-[#00FF9C]/20 text-[#00FF9C] border border-[#00FF9C]/50' : 'text-white/50 hover:text-white border border-transparent'}`}
               >
                  <MapIcon className="w-4 h-4 md:w-5 md:h-5" /> SATELLITE
               </button>
             </div>
           </div>

           <div className="flex-1 w-full relative">
             {centerView === 'camera' ? <LiveCameraPanel isConnected={isConnected} /> : <SatelliteMap isConnected={isConnected} />}
           </div>
        </div>

        {/* Right Sidebar - Controls */}
        <div className="md:col-span-1 xl:col-span-3 flex flex-col justify-end pointer-events-auto order-3 md:order-3 xl:order-3 mt-2 md:mt-0 xl:min-w-[320px] lg:min-w-[300px]">
           <ControlsOverlay isConnected={isConnected} />
        </div>
      </div>
    </div>
  );
}
