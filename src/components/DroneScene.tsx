import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Stars } from '@react-three/drei';
import * as THREE from 'three';

export function DroneScene({ isArrived, isParked }: { isArrived: boolean, isParked?: boolean }) {
  const droneRef = useRef<THREE.Group>(null);
  
  // Custom rotation for container to give cinematic entry
  const containerRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (droneRef.current && containerRef.current) {
      if (isParked) {
        // Stay parked far away and rotate gracefully
        droneRef.current.position.z = THREE.MathUtils.lerp(droneRef.current.position.z, -30, delta * 2);
        containerRef.current.rotation.y = THREE.MathUtils.lerp(containerRef.current.rotation.y, Math.PI / 6, delta * 2);
      } else if (!isArrived) {
        // Fly in animation from far away
        droneRef.current.position.z = THREE.MathUtils.lerp(droneRef.current.position.z, 0, delta * 0.8);
        containerRef.current.rotation.y = THREE.MathUtils.lerp(containerRef.current.rotation.y, 0, delta * 0.5);
      } else {
        // Subtle hover movement after arrived
        droneRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
      
      // Slight continuous rotation
      droneRef.current.rotation.y = THREE.MathUtils.lerp(
        droneRef.current.rotation.y, 
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1, 
        delta
      );
    }
  });

  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#00D4FF" />
      <directionalLight position={[-5, 10, -5]} intensity={1.5} color="#7B61FF" />

      {/* Fog and stars to add to the cinematic vibe */}
      <fog attach="fog" args={['#0A0A0A', 10, 80]} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      <group ref={containerRef} rotation={[0, Math.PI / 4, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
          <group ref={droneRef} position={[0, -0.5, -60]}>
            {/* Main Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.4, 1.5]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Glowing Core */}
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial color="#00D4FF" emissive="#00D4FF" emissiveIntensity={2} toneMapped={false} />
            </mesh>

            {/* Front Camera Array (Red eye) */}
            <mesh position={[0, 0, 0.76]}>
              <boxGeometry args={[0.4, 0.2, 0.1]} />
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={3} toneMapped={false} />
            </mesh>

            {/* Propellers */}
            <Propeller position={[1.2, 0.1, 1.2]} rotOffset={0} />
            <Propeller position={[-1.2, 0.1, 1.2]} rotOffset={Math.PI / 4} />
            <Propeller position={[1.2, 0.1, -1.2]} rotOffset={Math.PI / 4} />
            <Propeller position={[-1.2, 0.1, -1.2]} rotOffset={0} />
          </group>
        </Float>
      </group>
      
      <ContactShadows position={[0, -3, 0]} opacity={0.6} scale={20} blur={2} />
    </>
  );
}

function Propeller({ position, rotOffset }: { position: [number, number, number], rotOffset: number }) {
  const propRef = useRef<THREE.Mesh>(null);

  // Arm bridging body to propeller
  const armAngle = Math.atan2(position[0], position[2]);
  const armLength = Math.sqrt(position[0]*position[0] + position[2]*position[2]);

  useFrame((_, delta) => {
    if (propRef.current) {
      propRef.current.rotation.y += delta * 30; // Spin extremely fast
    }
  });
  
  return (
    <group position={position}>
      {/* Arm attached to main body (adjusting position relative to center) */}
      <mesh position={[-position[0]/2, 0, -position[2]/2]} rotation={[0, armAngle, 0]}>
        <cylinderGeometry args={[0.06, 0.06, armLength]} />
        <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>
      
      {/* Cylinder Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Blade */}
      <mesh ref={propRef} position={[0, 0.15, 0]} rotation={[0, rotOffset, 0]}>
        <boxGeometry args={[1.4, 0.02, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Propeller Glow Ring Effect (Fast spinning illusion) */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.72, 32]} />
        <meshStandardMaterial color="#00FF9C" emissive="#00FF9C" emissiveIntensity={1} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
