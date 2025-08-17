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
        const behindOffset = new THREE.Vector3(0, 4, 10);
        behindOffset.applyEuler(carRot);
        camera.position.lerp(carPos.clone().add(behindOffset), 0.08);
        
        const lookTarget = carPos.clone().add(new THREE.Vector3(0, 1, 0));
        camera.lookAt(lookTarget);
        break;
        
      case 1:
        const topOffset = new THREE.Vector3(0, 20, 5);
        camera.position.lerp(carPos.clone().add(topOffset), 0.06);
        camera.lookAt(carPos);
        break;
        
      case 2:
        const cockpitOffset = new THREE.Vector3(0, 1.2, 1);
        cockpitOffset.applyEuler(carRot);
        camera.position.lerp(carPos.clone().add(cockpitOffset), 0.12);
        
        const lookAhead = new THREE.Vector3(0, 0, -15);
        lookAhead.applyEuler(carRot);
        camera.lookAt(carPos.clone().add(lookAhead));
        break;
    }
  });

  return null;
}
