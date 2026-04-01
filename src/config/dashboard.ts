// Centralized dashboard configuration
// Extract all magic numbers and hardcoded values here

export const MAP_CONFIG = {
  startPosition: [36.1069, -112.1129] as [number, number],
  zoom: 16,
  tileUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  tileAttribution: 'Tiles &copy; Esri &mdash; Source: Esri',
  maxPathLength: 80,
  updateIntervalMs: 1000,
} as const;

export const TELEMETRY_CONFIG = {
  updateIntervalMs: 250,
  defaults: {
    height: 120,
    speed: 45,
    targetDist: 1450,
    direction: 145,
    homeDist: 850,
  },
} as const;

export const AUDIO_CONFIG = {
  baseFrequency: 150,
  maxFrequency: 300,
  fadeInDuration: 3,
  fadeOutDuration: 1,
  muteFadeDuration: 0.5,
  defaultGain: 0.15,
} as const;

export const CONNECTION_CONFIG = {
  bootSequenceDurationMs: 4000,
  ports: [
    { label: 'COM1 (UDP)', value: 'com1-udp' },
    { label: 'COM3 (USB)', value: 'com3-usb' },
    { label: 'COM4 (AUTO)', value: 'com4-auto' },
    { label: 'TCP', value: 'tcp' },
  ],
  baudRates: [57600, 115200, 921600],
} as const;

export const SCENE_CONFIG = {
  camera: { position: [0, 2, 8] as [number, number, number], fov: 45 },
  fog: { color: '#0A0A0A', near: 10, far: 80 },
  stars: { radius: 100, depth: 50, count: 3000, factor: 4 },
} as const;
