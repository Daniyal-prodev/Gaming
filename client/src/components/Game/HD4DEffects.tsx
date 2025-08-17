import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HD4DEffectsProps {
  carPosition: [number, number, number];
  carSpeed: number;
}

export default function HD4DEffects({ carPosition, carSpeed }: HD4DEffectsProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const speedLinesRef = useRef<THREE.Points>(null);
  const atmosphereRef = useRef<THREE.Points>(null);
  
  const particleCount = 2000;
  const speedLineCount = 500;
  const atmosphereCount = 1000;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      
      colors[i * 3] = 0.2 + Math.random() * 0.8;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1;
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  const speedLines = useMemo(() => {
    const positions = new Float32Array(speedLineCount * 3);
    const colors = new Float32Array(speedLineCount * 3);
    const velocities = new Float32Array(speedLineCount * 3);
    
    for (let i = 0; i < speedLineCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 25;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    return { positions, colors, velocities };
  }, []);
  
  const atmosphere = useMemo(() => {
    const positions = new Float32Array(atmosphereCount * 3);
    const colors = new Float32Array(atmosphereCount * 3);
    
    for (let i = 0; i < atmosphereCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = Math.random() * 30 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      
      const intensity = Math.random();
      colors[i * 3] = intensity * 0.3;
      colors[i * 3 + 1] = intensity * 0.6;
      colors[i * 3 + 2] = intensity;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= delta * 3;
        
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 50;
          positions[i * 3] = (Math.random() - 0.5) * 400;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (speedLinesRef.current && carSpeed > 30) {
      const positions = speedLinesRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = speedLines.velocities;
      const intensity = Math.min(carSpeed / 150, 1);
      
      for (let i = 0; i < speedLineCount; i++) {
        positions[i * 3] += velocities[i * 3] + carPosition[0] * 0.02;
        positions[i * 3 + 2] += velocities[i * 3 + 2] + carPosition[2] * 0.02;
        
        const distance = Math.sqrt(
          (positions[i * 3] - carPosition[0]) ** 2 + 
          (positions[i * 3 + 2] - carPosition[2]) ** 2
        );
        
        if (distance > 30) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 8 + Math.random() * 25;
          
          positions[i * 3] = carPosition[0] + Math.cos(angle) * radius;
          positions[i * 3 + 2] = carPosition[2] + Math.sin(angle) * radius;
        }
      }
      
      speedLinesRef.current.geometry.attributes.position.needsUpdate = true;
      (speedLinesRef.current.material as THREE.PointsMaterial).opacity = intensity * 0.9;
    }
    
    if (atmosphereRef.current) {
      const positions = atmosphereRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < atmosphereCount; i++) {
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.01;
        positions[i * 3 + 1] += Math.cos(state.clock.elapsedTime + i) * 0.005;
        positions[i * 3 + 2] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.01;
      }
      
      atmosphereRef.current.geometry.attributes.position.needsUpdate = true;
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
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {carSpeed > 30 && (
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
            size={0.4}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
      
      <points ref={atmosphereRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={atmosphereCount}
            array={atmosphere.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={atmosphereCount}
            array={atmosphere.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          vertexColors
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {carSpeed > 80 && (
        <mesh position={carPosition}>
          <sphereGeometry args={[12, 32, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            transparent
            opacity={0.08}
            emissive="#00ffff"
            emissiveIntensity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {carSpeed > 120 && (
        <mesh position={carPosition}>
          <torusGeometry args={[15, 2, 16, 100]} />
          <meshStandardMaterial
            color="#ff00ff"
            transparent
            opacity={0.6}
            emissive="#ff00ff"
            emissiveIntensity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}
