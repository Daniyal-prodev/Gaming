import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Environment, Stats } from '@react-three/drei';
import { useLocation } from 'wouter';
import Car from './Car';
import Track from './Track';
import Camera from './Camera';
import GameHUD from '../UI/GameHUD';
import LoadingScreen from '../UI/LoadingScreen';
import { useGame } from '../../stores/useGame';
import { useSettings } from '../../stores/useSettings';

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

  useEffect(() => {
    setPhase('racing');
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLocation('/');
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [setPhase, setLocation]);

  if (phase === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-full relative">
      <KeyboardControls map={keyboardMap}>
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
            
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow={graphics.shadows}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            
            <fog attach="fog" args={['#0a0a0a', 50, 200]} />

            <Track />
            <Car />
            <Camera />
            
            {process.env.NODE_ENV === 'development' && <Stats />}
          </Suspense>
        </Canvas>
      </KeyboardControls>
      
      <GameHUD />
    </div>
  );
}
