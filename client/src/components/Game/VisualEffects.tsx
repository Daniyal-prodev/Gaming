import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VisualEffectsProps {
  carPosition: [number, number, number];
  carSpeed: number;
}

export default function VisualEffects({ carPosition, carSpeed }: VisualEffectsProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const speedLinesRef = useRef<THREE.Points>(null);
  
  const particleCount = 1000;
  const speedLineCount = 200;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      
      colors[i * 3] = 0.2 + Math.random() * 0.8;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1;
    }
    
    return { positions, colors };
  }, []);
  
  const speedLines = useMemo(() => {
    const positions = new Float32Array(speedLineCount * 3);
    const colors = new Float32Array(speedLineCount * 3);
    
    for (let i = 0; i < speedLineCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 15;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= delta * 2;
        
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 20;
          positions[i * 3] = (Math.random() - 0.5) * 200;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (speedLinesRef.current && carSpeed > 50) {
      const positions = speedLinesRef.current.geometry.attributes.position.array as Float32Array;
      const intensity = Math.min(carSpeed / 200, 1);
      
      for (let i = 0; i < speedLineCount; i++) {
        positions[i * 3] += carPosition[0] * 0.01;
        positions[i * 3 + 2] += carPosition[2] * 0.01;
        
        const distance = Math.sqrt(
          (positions[i * 3] - carPosition[0]) ** 2 + 
          (positions[i * 3 + 2] - carPosition[2]) ** 2
        );
        
        if (distance > 20) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 5 + Math.random() * 15;
          
          positions[i * 3] = carPosition[0] + Math.cos(angle) * radius;
          positions[i * 3 + 2] = carPosition[2] + Math.sin(angle) * radius;
        }
      }
      
      speedLinesRef.current.geometry.attributes.position.needsUpdate = true;
      (speedLinesRef.current.material as THREE.PointsMaterial).opacity = intensity * 0.8;
    }
  });
  
  return (
    <group>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      {carSpeed > 50 && (
        <points ref={speedLinesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={speedLineCount}
              array={speedLines.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={speedLineCount}
              array={speedLines.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.3}
            vertexColors
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}
      
      {carSpeed > 100 && (
        <mesh position={carPosition}>
          <sphereGeometry args={[8, 16, 16]} />
          <meshStandardMaterial
            color="#00ffff"
            transparent
            opacity={0.1}
            emissive="#00ffff"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}
