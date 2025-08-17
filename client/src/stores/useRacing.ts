import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { RacingState, LapTime, Checkpoint } from '../../../shared/types';

interface RacingStore extends RacingState {
  setCarPosition: (position: [number, number, number]) => void;
  setCarRotation: (rotation: [number, number, number]) => void;
  setCarVelocity: (velocity: [number, number, number]) => void;
  setSpeed: (speed: number) => void;
  setRPM: (rpm: number) => void;
  setGear: (gear: number) => void;
  setFuel: (fuel: number) => void;
  setDamage: (damage: number) => void;
  addLapTime: (lapTime: LapTime) => void;
  setCurrentLapTime: (time: number) => void;
  setBestLapTime: (time: number) => void;
  passCheckpoint: (checkpointId: number) => void;
  resetRacing: () => void;
  finishRace: () => void;
}

export const useRacing = create<RacingStore>()(
  subscribeWithSelector((set, get) => ({
    carPosition: [0, 0, 0],
    carRotation: [0, 0, 0],
    carVelocity: [0, 0, 0],
    speed: 0,
    rpm: 800,
    gear: 1,
    fuel: 100,
    damage: 0,
    lapTimes: [],
    currentLapTime: 0,
    checkpointsPassed: 0,
    nextCheckpoint: 0,
    raceFinished: false,
    
    setCarPosition: (position) => set({ carPosition: position }),
    
    setCarRotation: (rotation) => set({ carRotation: rotation }),
    
    setCarVelocity: (velocity) => set({ carVelocity: velocity }),
    
    setSpeed: (speed) => set({ speed }),
    
    setRPM: (rpm) => set({ rpm }),
    
    setGear: (gear) => set({ gear }),
    
    setFuel: (fuel) => set({ fuel }),
    
    setDamage: (damage) => set({ damage }),
    
    addLapTime: (lapTime) => set((state) => ({
      lapTimes: [...state.lapTimes, lapTime],
      bestLapTime: state.bestLapTime ? Math.min(state.bestLapTime, lapTime.time) : lapTime.time
    })),
    
    setCurrentLapTime: (time) => set({ currentLapTime: time }),
    
    setBestLapTime: (time) => set({ bestLapTime: time }),
    
    passCheckpoint: (checkpointId) => set((state) => ({
      checkpointsPassed: state.checkpointsPassed + 1,
      nextCheckpoint: checkpointId + 1
    })),
    
    resetRacing: () => set({
      carPosition: [0, 0, 0],
      carRotation: [0, 0, 0],
      carVelocity: [0, 0, 0],
      speed: 0,
      rpm: 800,
      gear: 1,
      fuel: 100,
      damage: 0,
      lapTimes: [],
      currentLapTime: 0,
      checkpointsPassed: 0,
      nextCheckpoint: 0,
      raceFinished: false
    }),
    
    finishRace: () => set({ raceFinished: true }),
  }))
);
