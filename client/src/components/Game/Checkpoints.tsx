import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRacing } from '../../stores/useRacing';
import { useGame } from '../../stores/useGame';
import { useAudio } from '../../stores/useAudio';

const checkpointPositions = [
  { position: [20, 1, 0], rotation: [0, 0, 0], order: 0 },
  { position: [0, 1, 20], rotation: [0, Math.PI / 2, 0], order: 1 },
  { position: [-20, 1, 0], rotation: [0, Math.PI, 0], order: 2 },
  { position: [0, 1, -20], rotation: [0, -Math.PI / 2, 0], order: 3, isFinishLine: true },
];

function Checkpoint({ position, rotation, order, isFinishLine = false }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { carPosition, nextCheckpoint, passCheckpoint, addLapTime, currentLapTime } = useRacing();
  const { currentLap, setCurrentLap } = useGame();
  const { playLapCompleteSound } = useAudio();

  useFrame(() => {
    if (meshRef.current) {
      const distance = new THREE.Vector3(...carPosition).distanceTo(new THREE.Vector3(...position));
      
      if (distance < 3 && nextCheckpoint === order) {
        passCheckpoint(order);
        
        if (isFinishLine) {
          addLapTime({
            lapNumber: currentLap,
            time: currentLapTime,
            sectorTimes: [currentLapTime / 4, currentLapTime / 4, currentLapTime / 4, currentLapTime / 4],
            timestamp: new Date(),
          });
          
          setCurrentLap(currentLap + 1);
          playLapCompleteSound();
        }
      }
      
      const isNext = nextCheckpoint === order;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      
      if (isFinishLine) {
        material.color.setHex(isNext ? 0x00ff00 : 0x004400);
        material.emissive.setHex(isNext ? 0x002200 : 0x001100);
      } else {
        material.color.setHex(isNext ? 0x00ffff : 0x004444);
        material.emissive.setHex(isNext ? 0x002222 : 0x001111);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={[4, 2, 0.5]} />
      <meshStandardMaterial 
        transparent 
        opacity={0.7}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export default function Checkpoints() {
  return (
    <group>
      {checkpointPositions.map((checkpoint, index) => (
        <Checkpoint key={index} {...checkpoint} />
      ))}
    </group>
  );
}
