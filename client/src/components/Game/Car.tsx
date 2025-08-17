import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { useRacing } from '../../stores/useRacing';
import { useAudio } from '../../stores/useAudio';
import { useSettings } from '../../stores/useSettings';

export default function Car() {
  const { setCarPosition, setCarRotation, setSpeed, setRPM, setGear, setFuel, setDamage } = useRacing();
  const { playEngineSound } = useAudio();
  const { controls } = useSettings();
  
  const [engineSoundPlaying, setEngineSoundPlaying] = useState(false);
  
  const [, get] = useKeyboardControls();
  
  const chassisBodyRef = useRef<THREE.Mesh>(null);
  const position = useRef([0, 1, 0]);
  const rotation = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);
  
  const [tireTemp, setTireTemp] = useState(80);
  const [brakeTemp, setBrakeTemp] = useState(200);
  const [currentGear, setCurrentGear] = useState(1);
  const [currentFuel, setCurrentFuel] = useState(100);
  const [currentDamage, setCurrentDamage] = useState(0);
  const [isTrailBraking, setIsTrailBraking] = useState(false);
  const [racingLine, setRacingLine] = useState({ deviation: 0, optimal: true });
  const [hybridBoost, setHybridBoost] = useState(100);
  const [aeroDynamics, setAeroDynamics] = useState({ downforce: 0, drag: 0 });
  
  const maxSpeed = 450; // 450 km/h top speed
  const maxHorsepower = 1250;
  const gearRatios = [0, 3.2, 2.1, 1.6, 1.2, 0.9, 0.7, 0.5]; // 7-speed transmission
  const optimalShiftRPM = 8500;
  const redlineRPM = 10000;

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward, brake } = get();
    
    const currentSpeed = Math.sqrt(velocity.current[0] ** 2 + velocity.current[2] ** 2) * 100;
    const currentRPM = Math.min(800 + currentSpeed * 50, redlineRPM);
    
    const speedFactor = currentSpeed / maxSpeed;
    const newTireTemp = Math.min(120, 80 + speedFactor * 40 + (brake ? 15 : 0));
    setTireTemp(newTireTemp);
    
    const newBrakeTemp = Math.min(800, 200 + (brake ? 50 : -5));
    setBrakeTemp(newBrakeTemp);
    
    const optimalGear = Math.min(6, Math.max(1, Math.floor(currentSpeed / 50) + 1));
    if (currentRPM > optimalShiftRPM && currentGear < 6) {
      setCurrentGear(currentGear + 1);
      setGear(currentGear + 1);
    } else if (currentRPM < 3000 && currentGear > 1) {
      setCurrentGear(currentGear - 1);
      setGear(currentGear - 1);
    }
    
    const gearRatio = gearRatios[currentGear] || 1;
    const engineEfficiency = Math.min(1, (redlineRPM - currentRPM) / redlineRPM + 0.3);
    const baseEngineForce = 0.03 * gearRatio * engineEfficiency;
    
    const optimalTireTemp = 100;
    const tempDiff = Math.abs(tireTemp - optimalTireTemp);
    const tireGrip = Math.max(0.3, 1 - (tempDiff / 50));
    
    const maxSteerVal = 0.06 * tireGrip;
    const brakeForce = 0.95 * (brakeTemp < 600 ? 1 : 0.7); // Brake fade at high temps
    
    let steeringValue = 0;
    let engineValue = 0;
    let brakeValue = 1;
    
    if (brake && (forward || backward)) {
      setIsTrailBraking(true);
      brakeValue = 0.85; // Reduced braking for trail braking
    } else {
      setIsTrailBraking(false);
      if (brake) brakeValue = brakeForce;
    }

    if (forward) engineValue = baseEngineForce;
    if (backward) engineValue = -baseEngineForce / 2;
    if (leftward) steeringValue = maxSteerVal;
    if (rightward) steeringValue = -maxSteerVal;

    steeringValue *= controls.sensitivity * (1 - speedFactor * 0.3);
    
    const trackCenter = { x: 0, z: 0 };
    const distanceFromCenter = Math.sqrt(position.current[0] ** 2 + position.current[2] ** 2);
    const optimalRadius = 20; // Optimal racing line radius
    const lineDeviation = Math.abs(distanceFromCenter - optimalRadius) / optimalRadius;
    setRacingLine({ 
      deviation: lineDeviation, 
      optimal: lineDeviation < 0.1 
    });

    velocity.current[0] *= brakeValue;
    velocity.current[2] *= brakeValue;
    
    velocity.current[0] += Math.sin(rotation.current[1]) * engineValue * tireGrip;
    velocity.current[2] += Math.cos(rotation.current[1]) * engineValue * tireGrip;
    
    const slipAngle = steeringValue * Math.min(1, currentSpeed / 50);
    rotation.current[1] += slipAngle * tireGrip;
    
    const carX = position.current[0];
    const carZ = position.current[2];
    const carRadius = 1.5;
    
    const obstacles = [
      { pos: [19, 0, 8], radius: 1.5, type: 'ramp' },
      { pos: [-19, 0, -8], radius: 1.5, type: 'ramp' },
      { pos: [8, 0, 19], radius: 1, type: 'barrier' },
      { pos: [-8, 0, -19], radius: 1, type: 'barrier' },
      { pos: [22, 0, -5], radius: 1.5, type: 'ramp' },
      { pos: [-22, 0, 5], radius: 1.5, type: 'ramp' },
    ];
    
    obstacles.forEach(obstacle => {
      const distance = Math.sqrt(
        (carX - obstacle.pos[0]) ** 2 + (carZ - obstacle.pos[2]) ** 2
      );
      
      if (distance < carRadius + obstacle.radius) {
        if (obstacle.type === 'barrier') {
          const angle = Math.atan2(carZ - obstacle.pos[2], carX - obstacle.pos[0]);
          velocity.current[0] = Math.cos(angle) * 0.1;
          velocity.current[2] = Math.sin(angle) * 0.1;
          
          const newDamage = currentDamage + 5;
          setCurrentDamage(newDamage);
          setDamage(newDamage);
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
    
    const fuelConsumption = Math.abs(engineValue) * 0.01 + currentSpeed * 0.0001;
    setCurrentFuel(Math.max(0, currentFuel - fuelConsumption));
    setFuel(Math.max(0, currentFuel - fuelConsumption));
    
    if (currentSpeed > maxSpeed * 0.9) {
      const newDamage = currentDamage + 0.01;
      setCurrentDamage(newDamage);
      setDamage(newDamage);
    }
    
    if (chassisBodyRef.current) {
      chassisBodyRef.current.position.set(position.current[0], position.current[1], position.current[2]);
      chassisBodyRef.current.rotation.set(rotation.current[0], rotation.current[1], rotation.current[2]);
      
      setCarPosition([position.current[0], position.current[1], position.current[2]]);
      setCarRotation([rotation.current[0], rotation.current[1], rotation.current[2]]);
      setSpeed(currentSpeed);
      setRPM(currentRPM);
      
      if (Math.abs(engineValue) > 0) {
        if (!engineSoundPlaying) {
          setEngineSoundPlaying(true);
        }
        playEngineSound(currentRPM);
      } else {
        setEngineSoundPlaying(false);
      }
    }
  });

  return (
    <group>
      {/* Enhanced futuristic hypercar body */}
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
        
        {/* Carbon fiber side panels */}
        <mesh position={[1.3, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.35, 5.5]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            metalness={0.9} 
            roughness={0.3}
            normalScale={new THREE.Vector2(2, 2)}
          />
        </mesh>
        <mesh position={[-1.3, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.35, 5.5]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            metalness={0.9} 
            roughness={0.3}
            normalScale={new THREE.Vector2(2, 2)}
          />
        </mesh>
        
        {/* Aerodynamic front splitter */}
        <mesh position={[0, -0.2, 2.8]} castShadow>
          <boxGeometry args={[2.4, 0.05, 0.8]} />
          <meshStandardMaterial 
            color="#ff3300" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#ff3300"
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Advanced cockpit canopy */}
        <mesh position={[0, 0.4, 0.8]} castShadow>
          <sphereGeometry args={[1.2, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
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
        
        {/* Cockpit frame */}
        <mesh position={[0, 0.5, 0.8]} castShadow>
          <torusGeometry args={[1.1, 0.05, 8, 16]} />
          <meshStandardMaterial 
            color="#ff3300" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#ff3300"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Aerodynamic front section */}
        <mesh position={[0, 0, 3.5]} castShadow>
          <coneGeometry args={[1.1, 2, 8]} />
          <meshStandardMaterial 
            color="#1a2332" 
            metalness={0.98} 
            roughness={0.02}
            emissive="#0d4f8c"
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
        <mesh position={[0.8, 0.6, -2.8]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        <mesh position={[-0.8, 0.6, -2.8]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
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
        
        {/* Side vents with glow */}
        <mesh position={[1.1, 0.2, -1]} castShadow>
          <planeGeometry args={[0.3, 1]} />
          <meshStandardMaterial 
            color="#ff3300" 
            emissive="#ff3300"
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[-1.1, 0.2, -1]} castShadow>
          <planeGeometry args={[0.3, 1]} />
          <meshStandardMaterial 
            color="#ff3300" 
            emissive="#ff3300"
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Advanced LED headlight arrays */}
        <mesh position={[0.7, 0.1, 3]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.1]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ffff"
            emissiveIntensity={1}
          />
        </mesh>
        <mesh position={[-0.7, 0.1, 3]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.1]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ffff"
            emissiveIntensity={1}
          />
        </mesh>
        
        {/* Holographic dashboard */}
        <mesh position={[0, 0.6, 1.2]} castShadow>
          <planeGeometry args={[1.2, 0.6]} />
          <meshStandardMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.7}
            emissive="#00ffff"
            emissiveIntensity={0.9}
          />
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
      </mesh>

      {/* High-performance racing wheels */}
      <mesh position={[-1.2, 0.3, 2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 20]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1.2, 0.3, 2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 20]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-1.2, 0.3, -2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 20]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1.2, 0.3, -2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 20]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Advanced wheel rims with LED accents */}
      <mesh position={[-1.2, 0.3, 2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 6]} />
        <meshStandardMaterial 
          color="#ff3300" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#ff3300"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[1.2, 0.3, 2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 6]} />
        <meshStandardMaterial 
          color="#ff3300" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#ff3300"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-1.2, 0.3, -2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 6]} />
        <meshStandardMaterial 
          color="#ff3300" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#ff3300"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[1.2, 0.3, -2]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 6]} />
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
    </group>
  );
}
