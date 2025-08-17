import React from 'react';
import * as THREE from 'three';
import Checkpoints from './Checkpoints';

export default function Track() {
  return (
    <group>
      {/* Main track surface - completely dark professional circuit */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Racing circuit - clean dark asphalt */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[18, 25, 64]} />
        <meshStandardMaterial 
          color="#111111" 
          roughness={0.8}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Track boundaries - subtle dark barriers */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[25, 26, 64]} />
        <meshStandardMaterial 
          color="#222222" 
          roughness={0.9}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[17, 18, 64]} />
        <meshStandardMaterial 
          color="#222222" 
          roughness={0.9}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Minimal track lighting - subtle blue glow for racing line */}
      {Array.from({ length: 32 }, (_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const x = Math.cos(angle) * 21.5;
        const z = Math.sin(angle) * 21.5;
        return (
          <mesh key={`track-light-${i}`} position={[x, 0.05, z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.1]} />
            <meshStandardMaterial 
              color="#003366" 
              emissive="#003366" 
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      <Checkpoints />
    </group>
  );
}
