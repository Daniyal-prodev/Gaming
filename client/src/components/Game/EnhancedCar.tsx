import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRacing } from '../../stores/useRacing';
import { useAudio } from '../../stores/useAudio';

export default function EnhancedCar() {
  const chassisBodyRef = useRef<THREE.Mesh>(null);
  const position = useRef<[number, number, number]>([0, 0.5, 0]);
  const velocity = useRef<[number, number, number]>([0, 0, 0]);
  const rotation = useRef<[number, number, number]>([0, 0, 0]);
  const engineSoundPlaying = useRef(false);
  
  const { setCarPosition, setSpeed } = useRacing();
  const { playEngineSound } = useAudio();
  
  const [, get] = useKeyboardControls();

  const obstacles = [
    { pos: [19, 0, 8], radius: 1.5, type: 'ramp' },
    { pos: [-19, 0, -8], radius: 1.5, type: 'ramp' },
    { pos: [8, 0, 19], radius: 1, type: 'barrier' },
    { pos: [-8, 0, -19], radius: 1, type: 'barrier' },
    { pos: [22, 0, -5], radius: 1.5, type: 'ramp' },
    { pos: [-22, 0, 5], radius: 1.5, type: 'ramp' },
  ];

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward, brake } = get();
    
    const engineValue = forward ? 1 : backward ? -1 : 0;
    const steerValue = leftward ? -1 : rightward ? 1 : 0;
    
    if (engineValue !== 0 && !engineSoundPlaying.current) {
      playEngineSound(100);
      engineSoundPlaying.current = true;
    } else if (engineValue === 0 && engineSoundPlaying.current) {
      engineSoundPlaying.current = false;
    }

    const maxSpeed = 0.8;
    const acceleration = 0.02;
    const brakeForce = 0.04;
    const friction = 0.98;
    const turnSpeed = 0.03;

    if (engineValue !== 0) {
      const force = engineValue * acceleration;
      velocity.current[0] += Math.sin(rotation.current[1]) * force;
      velocity.current[2] += Math.cos(rotation.current[1]) * force;
    }

    if (brake) {
      velocity.current[0] *= (1 - brakeForce);
      velocity.current[2] *= (1 - brakeForce);
    }

    velocity.current[0] *= friction;
    velocity.current[2] *= friction;

    const speed = Math.sqrt(velocity.current[0] ** 2 + velocity.current[2] ** 2);
    if (speed > maxSpeed) {
      velocity.current[0] = (velocity.current[0] / speed) * maxSpeed;
      velocity.current[2] = (velocity.current[2] / speed) * maxSpeed;
    }

    if (steerValue !== 0 && Math.abs(engineValue) > 0) {
      rotation.current[1] += steerValue * turnSpeed * Math.min(speed / 0.3, 1);
    }

    const carX = position.current[0];
    const carZ = position.current[2];
    const carRadius = 1.5;
    
    obstacles.forEach(obstacle => {
      const distance = Math.sqrt(
        (carX - obstacle.pos[0]) ** 2 + (carZ - obstacle.pos[2]) ** 2
      );
      
      if (distance < carRadius + obstacle.radius) {
        if (obstacle.type === 'barrier') {
          const angle = Math.atan2(carZ - obstacle.pos[2], carX - obstacle.pos[0]);
          velocity.current[0] = Math.cos(angle) * 0.1;
          velocity.current[2] = Math.sin(angle) * 0.1;
        } else if (obstacle.type === 'ramp') {
          if (Math.abs(engineValue) > 0) {
            velocity.current[0] *= 1.1;
            velocity.current[2] *= 1.1;
          }
        }
      }
    });

    position.current[0] += velocity.current[0];
    position.current[2] += velocity.current[2];

    const trackRadius = 20;
    const distanceFromCenter = Math.sqrt(position.current[0] ** 2 + position.current[2] ** 2);
    
    if (distanceFromCenter > trackRadius) {
      const angle = Math.atan2(position.current[2], position.current[0]);
      position.current[0] = Math.cos(angle) * trackRadius;
      position.current[2] = Math.sin(angle) * trackRadius;
      velocity.current[0] *= 0.5;
      velocity.current[2] *= 0.5;
    }

    if (chassisBodyRef.current) {
      chassisBodyRef.current.position.set(...position.current);
      chassisBodyRef.current.rotation.set(...rotation.current);
    }

    setCarPosition(position.current);
    setSpeed(speed * 200);
  });

  return (
    <group>
      <mesh ref={chassisBodyRef} castShadow receiveShadow>
        {/* Realistic hypercar body - main chassis */}
        <boxGeometry args={[2.4, 0.4, 6]} />
        <meshStandardMaterial 
          color="#1a2332" 
          metalness={0.98} 
          roughness={0.02}
          emissive="#0d4f8c"
          emissiveIntensity={0.4}
        />
        
        {/* Carbon fiber monocoque */}
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
            emissiveIntensity={engineSoundPlaying.current ? 1.2 : 0.6}
          />
        </mesh>
        <mesh position={[-0.5, -0.1, -3.2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.4]} />
          <meshStandardMaterial 
            color="#ff6600" 
            emissive="#ff6600"
            emissiveIntensity={engineSoundPlaying.current ? 1.2 : 0.6}
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
      </mesh>
    </group>
  );
}
