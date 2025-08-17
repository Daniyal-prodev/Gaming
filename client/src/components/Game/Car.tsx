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
  
  const [, get] = useKeyboardControls();
  
  const chassisBodyRef = useRef<THREE.Mesh>(null);
  const position = useRef([0, 2, 0]);
  const rotation = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);
  
  const [tireTemp, setTireTemp] = useState(80);
  const [brakeTemp, setBrakeTemp] = useState(200);
  const [currentGear, setCurrentGear] = useState(1);
  const [currentFuel, setCurrentFuel] = useState(100);
  const [currentDamage, setCurrentDamage] = useState(0);
  const [isTrailBraking, setIsTrailBraking] = useState(false);
  const [racingLine, setRacingLine] = useState({ deviation: 0, optimal: true });
  
  const maxSpeed = 300;
  const gearRatios = [0, 2.8, 1.8, 1.3, 1.0, 0.8, 0.6];
  const optimalShiftRPM = 7500;
  const redlineRPM = 8500;

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
    velocity.current[2] -= Math.cos(rotation.current[1]) * engineValue * tireGrip;
    
    const slipAngle = steeringValue * Math.min(1, currentSpeed / 50);
    rotation.current[1] += slipAngle * tireGrip;
    
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
        playEngineSound(currentRPM);
      }
    }
  });

  return (
    <group>
      <mesh ref={chassisBodyRef} castShadow receiveShadow>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial color="#00ffff" metalness={0.8} roughness={0.2} />
        
        <mesh position={[0, 0.3, 1.5]} castShadow>
          <boxGeometry args={[1.8, 0.8, 1]} />
          <meshStandardMaterial color="#001122" transparent opacity={0.3} />
        </mesh>
        
        <pointLight position={[0.8, 0, 2]} intensity={2} color="#00ffff" distance={10} />
        <pointLight position={[-0.8, 0, 2]} intensity={2} color="#00ffff" distance={10} />
        
        <pointLight position={[0.8, 0, -2]} intensity={1} color="#ff0000" distance={5} />
        <pointLight position={[-0.8, 0, -2]} intensity={1} color="#ff0000" distance={5} />
      </mesh>

      <mesh position={[-1, 1.5, 1.3]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[1, 1.5, 1.3]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-1, 1.5, -1.3]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[1, 1.5, -1.3]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}
