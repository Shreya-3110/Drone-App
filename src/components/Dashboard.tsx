import { StatusHeader } from './StatusHeader';
import { LiveCameraPanel } from './LiveCameraPanel';
import { TelemetryPanel } from './TelemetryPanel';
import { ControlsOverlay } from './ControlsOverlay';
import { MiniMap } from './MiniMap';

export function Dashboard() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col font-inter pointer-events-none">
      <div className="p-4 md:p-6 pointer-events-auto shrink-0">
        <StatusHeader />
      </div>

      {/* Main Content Grid - Scrollable on mobile */}
      <div className="flex-1 px-4 md:px-6 pb-4 md:pb-6 grid grid-cols-1 md:grid-cols-12 gap-6 relative overflow-y-auto md:overflow-hidden pointer-events-auto md:pointer-events-none">
        
        {/* Left Sidebar - Telemetry (order 3 on mobile) */}
        <div className="md:col-span-3 flex flex-col gap-6 justify-between pointer-events-auto order-3 md:order-1 mt-2 md:mt-0">
          <TelemetryPanel />
          <MiniMap />
        </div>

        {/* Center - Camera Feed (order 1 on mobile, takes 40vh so crosshair is central over drone) */}
        <div className="md:col-span-6 h-[40vh] min-h-[300px] md:h-full md:min-h-0 flex flex-col pointer-events-none order-1 md:order-2">
           <LiveCameraPanel />
        </div>

        {/* Right Sidebar - Controls (order 2 on mobile) */}
        <div className="md:col-span-3 flex flex-col justify-end pointer-events-auto order-2 md:order-3 mt-2 md:mt-0">
           <ControlsOverlay />
        </div>
      </div>
    </div>
  );
}
