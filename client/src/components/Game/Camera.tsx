import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRacing } from '../../stores/useRacing';

export default function Camera() {
  const { camera } = useThree();
  const { carPosition, carRotation } = useRacing();
  const [, get] = useKeyboardControls();
  
  const cameraMode = useRef(0);
  const lastCameraPress = useRef(0);
  
  useFrame(() => {
    const { camera: cameraKey } = get();
    
    if (cameraKey && Date.now() - lastCameraPress.current > 300) {
      cameraMode.current = (cameraMode.current + 1) % 3;
      lastCameraPress.current = Date.now();
    }
    
    const carPos = new THREE.Vector3(...carPosition);
    const carRot = new THREE.Euler(...carRotation);
    
    switch (cameraMode.current) {
      case 0:
        const behindOffset = new THREE.Vector3(0, 3, 8);
        behindOffset.applyEuler(carRot);
        camera.position.lerp(carPos.clone().add(behindOffset), 0.1);
        camera.lookAt(carPos);
        break;
        
      case 1:
        const topOffset = new THREE.Vector3(0, 15, 0);
        camera.position.lerp(carPos.clone().add(topOffset), 0.1);
        camera.lookAt(carPos);
        break;
        
      case 2:
        const frontOffset = new THREE.Vector3(0, 1, 2);
        frontOffset.applyEuler(carRot);
        camera.position.lerp(carPos.clone().add(frontOffset), 0.1);
        
        const lookAhead = new THREE.Vector3(0, 0, -10);
        lookAhead.applyEuler(carRot);
        camera.lookAt(carPos.clone().add(lookAhead));
        break;
    }
  });

  return null;
}
