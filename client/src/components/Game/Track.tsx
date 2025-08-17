import React from 'react';
import * as THREE from 'three';
import Checkpoints from './Checkpoints';

export default function Track() {
  return (
    <group>
      {/* Enhanced HD track surface with realistic terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300, 64, 64]} />
        <meshStandardMaterial 
          color="#1a2a1a" 
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>
      
      {/* Track center grass with 3D depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[17, 64]} />
        <meshStandardMaterial 
          color="#1a4a1a" 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Enhanced HD racing circuit with realistic textures */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[18, 25, 128]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          roughness={0.9}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Track lane markings */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[21.3, 21.7, 128]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner track markings */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[18.3, 18.7, 128]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Enhanced 3D track boundaries with LED strips */}
      {Array.from({ length: 64 }, (_, i) => {
        const angle = (i / 64) * Math.PI * 2;
        const innerX = Math.cos(angle) * 17.5;
        const innerZ = Math.sin(angle) * 17.5;
        const outerX = Math.cos(angle) * 25.5;
        const outerZ = Math.sin(angle) * 25.5;
        
        return (
          <group key={i}>
            <mesh position={[innerX, 0.3, innerZ]} castShadow>
              <boxGeometry args={[0.15, 0.6, 0.15]} />
              <meshStandardMaterial 
                color="#ff3300" 
                emissive="#ff3300"
                emissiveIntensity={0.6}
              />
            </mesh>
            <mesh position={[outerX, 0.3, outerZ]} castShadow>
              <boxGeometry args={[0.15, 0.6, 0.15]} />
              <meshStandardMaterial 
                color="#00ff88" 
                emissive="#00ff88"
                emissiveIntensity={0.6}
              />
            </mesh>
            {i % 4 === 0 && (
              <>
                <pointLight position={[innerX, 1, innerZ]} intensity={1} color="#ff3300" distance={3} />
                <pointLight position={[outerX, 1, outerZ]} intensity={1} color="#00ff88" distance={3} />
              </>
            )}
          </group>
        );
      })}

      {/* Minimal track lighting - subtle blue glow for racing line */}
      {Array.from({ length: 32 }, (_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const x = Math.cos(angle) * 21.5;
        const z = Math.sin(angle) * 21.5;
        return (
          <mesh key={`track-light-${i}`} position={[x, 0.05, z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.1]} />
            <meshStandardMaterial 
              color="#003366" 
              emissive="#003366" 
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      {/* Futuristic obstacles and buildings */}
      
      {/* Energy barriers around the track */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 23;
        const z = Math.sin(angle) * 23;
        return (
          <group key={`energy-barrier-${i}`}>
            <mesh position={[x, 1, z]} rotation={[0, angle, 0]} castShadow>
              <boxGeometry args={[0.2, 2, 1]} />
              <meshStandardMaterial 
                color="#00ffff" 
                transparent 
                opacity={0.7}
                emissive="#00ffff"
                emissiveIntensity={0.5}
              />
            </mesh>
            <pointLight position={[x, 1.5, z]} intensity={2} color="#00ffff" distance={5} />
          </group>
        );
      })}

      {/* Futuristic buildings/skyscrapers */}
      {[
        { pos: [35, 0, 15] as [number, number, number], height: 25, width: 4 },
        { pos: [-35, 0, -15] as [number, number, number], height: 30, width: 5 },
        { pos: [15, 0, 35] as [number, number, number], height: 20, width: 3 },
        { pos: [-15, 0, -35] as [number, number, number], height: 35, width: 6 },
        { pos: [40, 0, -20] as [number, number, number], height: 28, width: 4 },
        { pos: [-40, 0, 20] as [number, number, number], height: 22, width: 3 },
        { pos: [50, 0, 0] as [number, number, number], height: 15, width: 8 },
        { pos: [-50, 0, 0] as [number, number, number], height: 18, width: 6 },
        { pos: [0, 0, 50] as [number, number, number], height: 12, width: 10 },
        { pos: [0, 0, -50] as [number, number, number], height: 16, width: 7 },
      ].map((building, i) => (
        <group key={`building-${i}`}>
          <mesh position={[building.pos[0], building.height/2, building.pos[2]]} castShadow>
            <boxGeometry args={[building.width, building.height, building.width]} />
            <meshStandardMaterial 
              color="#001122" 
              metalness={0.8} 
              roughness={0.2}
              emissive="#003366"
              emissiveIntensity={0.1}
            />
          </mesh>
          {Array.from({ length: Math.floor(building.height / 3) }, (_, floor) => (
            <mesh key={floor} position={[building.pos[0], floor * 3 + 2, building.pos[2] + building.width/2 + 0.1]}>
              <planeGeometry args={[building.width * 0.8, 0.5]} />
              <meshStandardMaterial 
                color="#00ffff" 
                emissive="#00ffff"
                emissiveIntensity={0.6}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Houses and farms around the track */}
      {[
        { pos: [60, 0, 30] as [number, number, number], type: 'house', size: [6, 4, 8] },
        { pos: [-60, 0, -30] as [number, number, number], type: 'house', size: [5, 3, 6] },
        { pos: [45, 0, 45] as [number, number, number], type: 'farm', size: [12, 3, 10] },
        { pos: [-45, 0, -45] as [number, number, number], type: 'farm', size: [10, 3, 8] },
        { pos: [70, 0, -10] as [number, number, number], type: 'house', size: [7, 5, 9] },
        { pos: [-70, 0, 10] as [number, number, number], type: 'house', size: [6, 4, 7] },
        { pos: [30, 0, 60] as [number, number, number], type: 'farm', size: [15, 2, 12] },
        { pos: [-30, 0, -60] as [number, number, number], type: 'farm', size: [14, 2, 11] },
      ].map((structure, i) => (
        <group key={`structure-${i}`}>
          <mesh position={[structure.pos[0], structure.size[1]/2, structure.pos[2]]} castShadow>
            <boxGeometry args={structure.size as [number, number, number]} />
            <meshStandardMaterial 
              color={structure.type === 'house' ? "#8B4513" : "#228B22"} 
              metalness={0.1} 
              roughness={0.8}
            />
          </mesh>
          {structure.type === 'house' && (
            <>
              <mesh position={[structure.pos[0], structure.size[1] + 1, structure.pos[2]]} castShadow>
                <coneGeometry args={[structure.size[0] * 0.7, 2, 4]} />
                <meshStandardMaterial color="#8B0000" />
              </mesh>
              <pointLight position={[structure.pos[0], structure.size[1] + 0.5, structure.pos[2]]} intensity={1} color="#ffff88" distance={10} />
            </>
          )}
          {structure.type === 'farm' && (
            <>
              <mesh position={[structure.pos[0] + structure.size[0]/3, structure.size[1] + 2, structure.pos[2]]} castShadow>
                <cylinderGeometry args={[0.5, 0.5, 4]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
              <mesh position={[structure.pos[0] + structure.size[0]/3, structure.size[1] + 4.5, structure.pos[2]]} castShadow>
                <boxGeometry args={[3, 1, 0.2]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
            </>
          )}
        </group>
      ))}

      {/* Truck obstacles on track */}
      {[
        { pos: [16, 0, 12] as [number, number, number], rotation: [0, Math.PI/3, 0] as [number, number, number] },
        { pos: [-16, 0, -12] as [number, number, number], rotation: [0, -Math.PI/3, 0] as [number, number, number] },
        { pos: [12, 0, -16] as [number, number, number], rotation: [0, Math.PI/6, 0] as [number, number, number] },
      ].map((truck, i) => (
        <group key={`truck-${i}`}>
          <mesh position={truck.pos} rotation={truck.rotation} castShadow>
            <boxGeometry args={[2, 1.5, 6]} />
            <meshStandardMaterial 
              color="#FF4500" 
              metalness={0.7} 
              roughness={0.3}
            />
          </mesh>
          <mesh position={[truck.pos[0], truck.pos[1] + 0.8, truck.pos[2] + 2]} rotation={truck.rotation} castShadow>
            <boxGeometry args={[2, 1.6, 2]} />
            <meshStandardMaterial 
              color="#FF6347" 
              metalness={0.6} 
              roughness={0.4}
            />
          </mesh>
          <pointLight position={[truck.pos[0], truck.pos[1] + 1, truck.pos[2] + 3]} intensity={2} color="#ffff00" distance={8} />
        </group>
      ))}

      {/* Track obstacles - ramps and barriers */}
      {[
        { pos: [19, 0, 8] as [number, number, number], type: 'ramp', rotation: [0, Math.PI/4, 0] as [number, number, number] },
        { pos: [-19, 0, -8] as [number, number, number], type: 'ramp', rotation: [0, -Math.PI/4, 0] as [number, number, number] },
        { pos: [8, 0, 19] as [number, number, number], type: 'barrier', rotation: [0, Math.PI/2, 0] as [number, number, number] },
        { pos: [-8, 0, -19] as [number, number, number], type: 'barrier', rotation: [0, -Math.PI/2, 0] as [number, number, number] },
        { pos: [22, 0, -5] as [number, number, number], type: 'ramp', rotation: [0, -Math.PI/6, 0] as [number, number, number] },
        { pos: [-22, 0, 5] as [number, number, number], type: 'ramp', rotation: [0, Math.PI/6, 0] as [number, number, number] },
      ].map((obstacle, i) => (
        <group key={`obstacle-${i}`}>
          {obstacle.type === 'ramp' ? (
            <mesh position={obstacle.pos} rotation={obstacle.rotation} castShadow>
              <boxGeometry args={[3, 0.5, 1]} />
              <meshStandardMaterial 
                color="#333333" 
                metalness={0.7} 
                roughness={0.3}
                emissive="#001133"
                emissiveIntensity={0.2}
              />
            </mesh>
          ) : (
            <mesh position={[obstacle.pos[0], 0.5, obstacle.pos[2]]} rotation={obstacle.rotation} castShadow>
              <boxGeometry args={[0.3, 1, 2]} />
              <meshStandardMaterial 
                color="#ff3300" 
                metalness={0.8} 
                roughness={0.2}
                emissive="#ff3300"
                emissiveIntensity={0.4}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Holographic billboards */}
      {[
        { pos: [30, 8, 0] as [number, number, number], rotation: [0, -Math.PI/2, 0] as [number, number, number] },
        { pos: [-30, 8, 0] as [number, number, number], rotation: [0, Math.PI/2, 0] as [number, number, number] },
        { pos: [0, 8, 30] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] },
        { pos: [0, 8, -30] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
      ].map((billboard, i) => (
        <group key={`billboard-${i}`}>
          <mesh position={billboard.pos} rotation={billboard.rotation}>
            <planeGeometry args={[8, 4]} />
            <meshStandardMaterial 
              color="#00ffff" 
              transparent 
              opacity={0.6}
              emissive="#00ffff"
              emissiveIntensity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight position={billboard.pos} intensity={3} color="#00ffff" distance={15} />
        </group>
      ))}

      <Checkpoints />
    </group>
  );
}
