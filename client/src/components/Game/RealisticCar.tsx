import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RealisticCarProps {
  position: [number, number, number];
  rotation: [number, number, number];
  engineSoundPlaying: boolean;
  velocity: React.MutableRefObject<[number, number, number]>;
}

export default function RealisticCar({ position, rotation, engineSoundPlaying, velocity }: RealisticCarProps) {
  const carGroupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (carGroupRef.current) {
      carGroupRef.current.position.set(...position);
      carGroupRef.current.rotation.set(...rotation);
    }
  });

  return (
    <group ref={carGroupRef}>
      {/* Main hypercar body - realistic proportions */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.4, 6]} />
        <meshStandardMaterial 
          color="#1a2332" 
          metalness={0.98} 
          roughness={0.02}
          emissive="#0d4f8c"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Carbon fiber monocoque chassis */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.2, 0.3, 5.8]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.95} 
          roughness={0.1}
          normalScale={new THREE.Vector2(3, 3)}
        />
      </mesh>
      
      {/* Aerodynamic front nose cone */}
      <mesh position={[0, 0, 3.5]} castShadow>
        <coneGeometry args={[1.1, 2, 12]} />
        <meshStandardMaterial 
          color="#1a2332" 
          metalness={0.98} 
          roughness={0.02}
          emissive="#0d4f8c"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Advanced cockpit canopy */}
      <mesh position={[0, 0.4, 0.8]} castShadow>
        <sphereGeometry args={[1.2, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial 
          color="#001122" 
          transparent 
          opacity={0.1}
          metalness={0.95}
          roughness={0.02}
          emissive="#0066cc"
          emissiveIntensity={0.3}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Cockpit frame with LED accents */}
      <mesh position={[0, 0.5, 0.8]} castShadow>
        <torusGeometry args={[1.1, 0.05, 12, 24]} />
        <meshStandardMaterial 
          color="#ff3300" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ff3300"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Front air intakes */}
      <mesh position={[0.7, -0.1, 3.2]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.7, -0.1, 3.2]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Side air intakes with mesh detail */}
      <mesh position={[1.3, 0.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 2]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-1.3, 0.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 2]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Large rear wing with supports */}
      <mesh position={[0, 1.2, -2.8]} castShadow>
        <boxGeometry args={[2.6, 0.15, 1.2]} />
        <meshStandardMaterial 
          color="#0a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ff3300"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Wing supports */}
      <mesh position={[0.8, 0.6, -2.8]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      <mesh position={[-0.8, 0.6, -2.8]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      
      {/* Matrix-style LED headlight arrays */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={`headlight-left-${i}`} position={[0.8, 0.1 + i * 0.1, 3.1]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.1]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ffff"
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={`headlight-right-${i}`} position={[-0.8, 0.1 + i * 0.1, 3.1]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.1]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ffff"
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
      
      {/* High-performance racing wheels */}
      <mesh position={[-1.2, 0.3, 2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 24]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1.2, 0.3, 2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 24]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-1.2, 0.3, -2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 24]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1.2, 0.3, -2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 24]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Advanced wheel rims with LED accents */}
      <mesh position={[-1.2, 0.3, 2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 8]} />
        <meshStandardMaterial 
          color="#ff3300" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#ff3300"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[1.2, 0.3, 2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 8]} />
        <meshStandardMaterial 
          color="#ff3300" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#ff3300"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-1.2, 0.3, -2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 8]} />
        <meshStandardMaterial 
          color="#ff3300" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#ff3300"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[1.2, 0.3, -2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 8]} />
        <meshStandardMaterial 
          color="#ff3300" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#ff3300"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Brake calipers */}
      <mesh position={[-1.2, 0.1, 2]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#ffff00" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#ffff00"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[1.2, 0.1, 2]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#ffff00" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#ffff00"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[-1.2, 0.1, -2]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#ffff00" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#ffff00"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[1.2, 0.1, -2]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#ffff00" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#ffff00"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Enhanced lighting system */}
      <pointLight position={[0.8, 0.2, 3.3]} intensity={8} color="#00ffff" distance={25} />
      <pointLight position={[-0.8, 0.2, 3.3]} intensity={8} color="#00ffff" distance={25} />
      
      {/* Rear LED strips */}
      <mesh position={[0.8, 0.1, -2.8]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.05]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[-0.8, 0.1, -2.8]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.05]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000"
          emissiveIntensity={1}
        />
      </mesh>
      
      {/* Enhanced underglow */}
      <pointLight position={[0, -0.4, 1]} intensity={2} color="#00ffff" distance={8} />
      <pointLight position={[0, -0.4, -1]} intensity={2} color="#00ffff" distance={8} />
      
      {/* Dual exhaust with flame effect */}
      <mesh position={[0.5, -0.1, -3.2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.4]} />
        <meshStandardMaterial 
          color="#ff6600" 
          emissive="#ff6600"
          emissiveIntensity={engineSoundPlaying ? 1.2 : 0.6}
        />
      </mesh>
      <mesh position={[-0.5, -0.1, -3.2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.4]} />
        <meshStandardMaterial 
          color="#ff6600" 
          emissive="#ff6600"
          emissiveIntensity={engineSoundPlaying ? 1.2 : 0.6}
        />
      </mesh>
      
      {/* Enhanced speed effects with particle trails */}
      {Math.abs(velocity.current[0]) + Math.abs(velocity.current[2]) > 0.1 && (
        <>
          <pointLight position={[0, 0, -4]} intensity={4} color="#0088ff" distance={15} />
          <mesh position={[0, 0, -3.5]} castShadow>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial 
              color="#0088ff" 
              transparent
              opacity={0.7}
              emissive="#0088ff"
              emissiveIntensity={1.2}
            />
          </mesh>
          <mesh position={[0, 0, -4]} castShadow>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial 
              color="#ff6600" 
              transparent
              opacity={0.5}
              emissive="#ff6600"
              emissiveIntensity={0.8}
            />
          </mesh>
        </>
      )}
      
      {/* Nitro boost effect */}
      {Math.abs(velocity.current[0]) + Math.abs(velocity.current[2]) > 0.3 && (
        <>
          <pointLight position={[0, 0, -5]} intensity={6} color="#ff00ff" distance={20} />
          <mesh position={[0, 0, -4.5]} castShadow>
            <cylinderGeometry args={[0.1, 0.5, 3]} />
            <meshStandardMaterial 
              color="#ff00ff" 
              transparent
              opacity={0.8}
              emissive="#ff00ff"
              emissiveIntensity={1.5}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
