<p align="center">
  <img src="https://img.shields.io/badge/NEXUS-Drone%20Control%20System-00D4FF?style=for-the-badge&labelColor=0A0A0A" alt="NEXUS" />
</p>

<h1 align="center">NEXUS — Drone Dashboard</h1>

<p align="center">
  A military-grade drone telemetry interface built with React, Three.js, and Leaflet.<br/>
  Real-time flight metrics, 3D visualization, satellite mapping, and full flight controls — all in the browser.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square" alt="React 19" />
  <img src="https://img.shields.io/badge/Three.js-r183-000000?logo=three.js&logoColor=white&style=flat-square" alt="Three.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white&style=flat-square" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white&style=flat-square" alt="Leaflet" />
</p>

---

## Overview

NEXUS is an immersive, cinematic drone control dashboard designed as a showcase of modern frontend engineering. It features a persistent 3D drone scene, simulated telemetry data, a live artificial horizon camera view, satellite tracking via Leaflet, and responsive flight controls with joystick and keyboard support.

### Key Features

- **3D Drone Visualization** — Persistent Three.js scene with cinematic fly-in, propeller spin, and ambient starfield
- **Live Telemetry Panel** — Simulated height, speed, direction, climb rate, and distance metrics
- **Satellite Map** — Real-time drone path tracking over Esri World Imagery tiles (Leaflet)
- **Drone Camera Feed** — Artificial horizon with pitch/roll simulation and scan-line effects
- **Flight Controls** — Take off, land, emergency stop + directional joystick (mouse, touch, WASD, arrow keys)
- **Audio Engine** — Web Audio API drone hum with fade-in/out and mute control
- **Responsive** — Full mobile and desktop support with adaptive layouts
- **Accessible** — ARIA labels, keyboard navigation, live regions, and focus indicators
- **Error Resilient** — Error boundaries around every major module with retry capability
- **Code-Split** — Lazy-loaded routes keep the initial bundle lean

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| 3D Engine | Three.js (r183) via React Three Fiber + Drei |
| Mapping | Leaflet 1.9 + React Leaflet 5 |
| Animation | Framer Motion 12 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Audio | Web Audio API (custom singleton) |
| Build | Vite 8 |
| Linting | ESLint 9 + typescript-eslint |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9 (or pnpm / yarn)

### Installation

```bash
git clone <repo-url>
cd drone-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── ControlsOverlay.tsx    # Flight controls + joystick (pointer & keyboard)
│   ├── Dashboard.tsx          # Main layout coordinator with memoized panels
│   ├── DroneScene.tsx         # Three.js drone model + animations
│   ├── ErrorBoundary.tsx      # Reusable error boundary with retry
│   ├── LandingPage.tsx        # Portal auth screen
│   ├── LiveCameraPanel.tsx    # Artificial horizon camera feed
│   ├── Navbar.tsx             # Top navigation bar
│   ├── SatelliteMap.tsx       # Leaflet satellite map with path tracking
│   ├── StatusHeader.tsx       # Connection controls + status indicators
│   ├── TelemetryPanel.tsx     # Flight metrics display (6 metrics)
│   └── TutorialOverlay.tsx    # Onboarding tutorial
├── config/
│   └── dashboard.ts           # Centralized configuration (map, telemetry, audio, etc.)
├── pages/
│   ├── HomePage.tsx           # Landing / marketing page
│   ├── PortalPage.tsx         # Auth + tutorial flow
│   └── DashboardPage.tsx      # Dashboard wrapper + connection state machine
├── utils/
│   └── audio.ts               # Web Audio API drone sound engine
├── App.tsx                    # Root — lazy routes, error boundaries, 3D canvas
├── main.tsx                   # Entry point
└── index.css                  # Tailwind base + custom utilities
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Architecture Notes

- **Route-level code splitting** — `HomePage`, `PortalPage`, and `DashboardPage` are lazy-loaded via `React.lazy`, keeping Three.js and Leaflet out of the initial bundle
- **Persistent 3D scene** — The Three.js `<Canvas>` is mounted at the app root and shared across all routes as a background layer
- **Map stays mounted** — Camera/Map tab toggle uses `display:none` instead of unmount/remount to avoid Leaflet tile re-fetching; a `ResizeObserver` triggers `invalidateSize()` on visibility change
- **Zero-lag joystick** — Pointer tracking uses direct DOM manipulation via refs + `requestAnimationFrame` coalescing (no React state in the hot path); keyboard input runs its own rAF loop
- **Centralized config** — All magic numbers (map coordinates, telemetry defaults, baud rates, audio frequencies) live in `src/config/dashboard.ts`
- **Error boundaries** — Wrap the 3D canvas, telemetry, camera, map, and controls independently so a crash in one module doesn't take down the whole dashboard

---

## Controls

| Input | Action |
|-------|--------|
| **WASD** / **Arrow Keys** | Move directional joystick |
| **Mouse drag** on joystick | Analog directional control |
| **Touch drag** on joystick | Mobile directional control |
| **CONNECT** button | Initiate drone link (4s boot sequence) |
| **DISCONNECT** button | Sever drone link |
| **Take Off** / **Land** | Toggle flight state |
| **STOP** | Emergency stop |
| **Mute** button | Toggle drone audio |

---

## License

This project is private and not currently licensed for redistribution.
