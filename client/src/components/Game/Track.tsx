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

      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const x = Math.cos(angle) * 20;
        const z = Math.sin(angle) * 20;
        return (
          <mesh key={i} position={[x, 0.1, z]}>
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshStandardMaterial 
              color="#00ffff" 
              emissive="#00ffff" 
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      <Checkpoints />
    </group>
  );
}
