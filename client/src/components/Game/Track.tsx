import React from 'react';
import * as THREE from 'three';
import Checkpoints from './Checkpoints';

export default function Track() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[15, 25, 32]} />
        <meshStandardMaterial 
          color="#333333" 
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[50, 5, 0]}>
        <boxGeometry args={[1, 10, 100]} />
        <meshStandardMaterial color="#ff0000" transparent opacity={0.3} />
      </mesh>

      <mesh position={[-50, 5, 0]}>
        <boxGeometry args={[1, 10, 100]} />
        <meshStandardMaterial color="#ff0000" transparent opacity={0.3} />
      </mesh>

      <mesh position={[0, 5, 50]}>
        <boxGeometry args={[100, 10, 1]} />
        <meshStandardMaterial color="#ff0000" transparent opacity={0.3} />
      </mesh>

      <mesh position={[0, 5, -50]}>
        <boxGeometry args={[100, 10, 1]} />
        <meshStandardMaterial color="#ff0000" transparent opacity={0.3} />
      </mesh>

      {/* Racing line markers - optimal path */}
      {Array.from({ length: 40 }, (_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const x = Math.cos(angle) * 20;
        const z = Math.sin(angle) * 20;
        return (
          <mesh key={`racing-line-${i}`} position={[x, 0.05, z]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial 
              color="#00ff00" 
              emissive="#00ff00" 
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
      
      {/* Apex markers for corners */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 18;
        const z = Math.sin(angle) * 18;
        return (
          <mesh key={`apex-${i}`} position={[x, 0.1, z]}>
            <coneGeometry args={[0.3, 1, 6]} />
            <meshStandardMaterial 
              color="#ffff00" 
              emissive="#ffff00" 
              emissiveIntensity={0.7}
            />
          </mesh>
        );
      })}
      
      {/* Braking zone markers */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const x = Math.cos(angle) * 25;
        const z = Math.sin(angle) * 25;
        return (
          <mesh key={`brake-${i}`} position={[x, 0.1, z]}>
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshStandardMaterial 
              color="#ff0000" 
              emissive="#ff0000" 
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}

      <Checkpoints />
    </group>
  );
}
