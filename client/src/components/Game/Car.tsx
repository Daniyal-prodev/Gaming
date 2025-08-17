import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { useRacing } from '../../stores/useRacing';
import { useAudio } from '../../stores/useAudio';
import { useSettings } from '../../stores/useSettings';

export default function Car() {
  const { setCarPosition, setCarRotation, setSpeed, setRPM } = useRacing();
  const { playEngineSound } = useAudio();
  const { controls } = useSettings();
  
  const [, get] = useKeyboardControls();
  
  const chassisBodyRef = useRef<THREE.Mesh>(null);
  const position = useRef([0, 2, 0]);
  const rotation = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);

  useFrame(() => {
    const { forward, backward, leftward, rightward, brake } = get();
    
    const engineForce = 0.02;
    const maxSteerVal = 0.05;
    const brakeForce = 0.98;
    
    let steeringValue = 0;
    let engineValue = 0;
    let brakeValue = 1;

    if (forward) engineValue = engineForce;
    if (backward) engineValue = -engineForce / 2;
    if (leftward) steeringValue = maxSteerVal;
    if (rightward) steeringValue = -maxSteerVal;
    if (brake) brakeValue = brakeForce;

    steeringValue *= controls.sensitivity;

    velocity.current[0] *= brakeValue;
    velocity.current[2] *= brakeValue;
    
    velocity.current[0] += Math.sin(rotation.current[1]) * engineValue;
    velocity.current[2] += Math.cos(rotation.current[1]) * engineValue;
    
    rotation.current[1] += steeringValue * Math.abs(velocity.current[0] + velocity.current[2]);
    
    position.current[0] += velocity.current[0];
    position.current[2] += velocity.current[2];
    
    if (chassisBodyRef.current) {
      chassisBodyRef.current.position.set(position.current[0], position.current[1], position.current[2]);
      chassisBodyRef.current.rotation.set(rotation.current[0], rotation.current[1], rotation.current[2]);
      
      setCarPosition([position.current[0], position.current[1], position.current[2]]);
      setCarRotation([rotation.current[0], rotation.current[1], rotation.current[2]]);
      
      const speed = Math.sqrt(velocity.current[0] ** 2 + velocity.current[2] ** 2) * 100;
      setSpeed(speed);
      
      const rpm = Math.min(800 + speed * 50, 8000);
      setRPM(rpm);
      
      if (Math.abs(engineValue) > 0) {
        playEngineSound(rpm);
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
