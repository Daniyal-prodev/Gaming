import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Environment, Stats } from '@react-three/drei';
import { useLocation } from 'wouter';
import RealisticTrack from './RealisticTrack';
import EnhancedCar from './EnhancedCar';
import Camera from './Camera';
import HD4DEffects from './HD4DEffects';
import GameHUD from '../UI/GameHUD';
import LoadingScreen from '../UI/LoadingScreen';
import { useGame } from '../../stores/useGame';
import { useSettings } from '../../stores/useSettings';
import { useAudio } from '../../stores/useAudio';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'brake', keys: ['Space'] },
  { name: 'camera', keys: ['KeyC'] },
];

export default function GameCanvas() {
  const [, setLocation] = useLocation();
  const { phase, setPhase } = useGame();
  const { graphics } = useSettings();
  const { playMotivationalMusic, initializeAudio } = useAudio();

  useEffect(() => {
    setPhase('racing');
    initializeAudio();
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLocation('/');
      }
    };

    const handleClick = () => {
      playMotivationalMusic();
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('click', handleClick);
    };
  }, [setPhase, setLocation, initializeAudio, playMotivationalMusic]);

  if (phase === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-full relative">
      <KeyboardControls map={keyboardMap}>
        <div
          className="w-full h-full relative"
          tabIndex={0}
          onClick={(e) => {
            (e.currentTarget as HTMLDivElement).focus();
            if (document.pointerLockElement !== e.currentTarget) {
              e.currentTarget.requestPointerLock?.();
            }
          }}
          style={{ outline: 'none' }}
        >
          <Canvas
            shadows={graphics.shadows}
            camera={{ position: [0, 5, 10], fov: 75 }}
            gl={{ 
              antialias: graphics.antiAliasing,
              powerPreference: 'high-performance'
            }}
          >
            <Suspense fallback={null}>
              <Environment preset="night" />
              
              <ambientLight intensity={0.4} color="#4488ff" />
              <directionalLight
                position={[20, 20, 10]}
                intensity={1.5}
                color="#ffffff"
                castShadow={graphics.shadows}
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-near={0.1}
                shadow-camera-far={100}
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
              />
              <hemisphereLight
                args={["#87ceeb", "#362d1d", 0.6]}
              />
              <pointLight
                position={[0, 15, 0]}
                intensity={2}
                color="#00ffff"
                distance={50}
              />
              
              <fog attach="fog" args={['#1a2a3a', 80, 300]} />

              <RealisticTrack />
              <EnhancedCar />
              <Camera />
              <HD4DEffects carPosition={[0, 0, 0]} carSpeed={0} />
              
              {process.env.NODE_ENV === 'development' && <Stats />}
            </Suspense>
          </Canvas>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white/80 text-sm">
              Click the game to focus. W/↑ to accelerate, A/D or ←/→ to steer, Space to brake, C for camera
            </div>
          </div>
        </div>
      </KeyboardControls>
      
      <GameHUD />
    </div>
  );
}
