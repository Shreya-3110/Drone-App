import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a High-Tech Drone marker
const DroneIcon = new L.DivIcon({
  html: `<div style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #00D4FF; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); box-shadow: 0 0 15px rgba(0,212,255,0.8); backdrop-filter: blur(4px);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Clean Map Updater
function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.panTo(position, { animate: true, duration: 1 });
  }, [position, map]);
  return null;
}

export function SatelliteMap({ isConnected }: { isConnected: boolean }) {
  // Start over a visually interesting location: Grand Canyon USA
  const START_POS: [number, number] = [36.1069, -112.1129];
  const [position, setPosition] = useState<[number, number]>(START_POS);
  const [path, setPath] = useState<[number, number][]>([START_POS]);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        const time = Date.now() / 8000;
        const newLat = prev[0] + (Math.sin(time) * 0.00015);
        const newLng = prev[1] + (Math.cos(time * 0.8) * 0.00015);
        
        setPath(curr => {
          const newPath = [...curr, [newLat, newLng] as [number, number]];
          if (newPath.length > 80) newPath.shift(); 
          return newPath;
        });

        return [newLat, newLng];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className={`glass-panel w-full h-full rounded-xl overflow-hidden pointer-events-auto border transition-colors duration-1000 relative z-0 p-2 md:p-3 ${isConnected ? 'border-[#00FF9C]/20' : 'border-white/5 opacity-50'}`}
    >
      <div className="absolute top-6 left-6 flex items-center gap-2 z-[400] bg-black/50 px-3 py-1.5 md:px-4 md:py-2 rounded border border-white/10 backdrop-blur-md">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00FF9C] shadow-[0_0_8px_#00FF9C] animate-pulse' : 'bg-white/30'}`} />
        <span className={`font-orbitron font-bold tracking-widest text-[10px] md:text-sm shadow-none uppercase ${isConnected ? 'text-[#00FF9C]' : 'text-white/30'}`}>
          {isConnected ? 'Live Satellite' : 'NO GPS FIX'}
        </span>
      </div>

      <div className="w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-inner">
        <MapContainer 
          center={position} 
          zoom={16} 
          zoomControl={false}
          className="w-full h-full transition-all duration-1000"
          style={{ filter: isConnected ? 'brightness(0.8) contrast(1.1) saturate(1.2)' : 'brightness(0.3) grayscale(100%) blur(2px)' }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri"
          />
          {isConnected && <Polyline positions={path} pathOptions={{ color: '#FF0055', weight: 4, dashArray: '8, 8', className: 'animate-pulse' }} />}
          {isConnected && <Marker position={position} icon={DroneIcon} />}
          <RecenterMap position={position} />
        </MapContainer>
      </div>
    </motion.div>
  );
}
