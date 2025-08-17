import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { GameState, Track, Car } from '../../../shared/types';

interface GameStore extends GameState {
  setPhase: (phase: GameState['phase']) => void;
  setCurrentTrack: (track: Track) => void;
  setCurrentCar: (car: Car) => void;
  startRace: () => void;
  pauseRace: () => void;
  resumeRace: () => void;
  finishRace: () => void;
  resetRace: () => void;
  setPosition: (position: number) => void;
  setCurrentLap: (lap: number) => void;
}

export const useGame = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    phase: 'menu',
    currentLap: 1,
    totalLaps: 3,
    position: 1,
    totalPlayers: 1,
    
    setPhase: (phase) => set({ phase }),
    
    setCurrentTrack: (track) => set({ currentTrack: track }),
    
    setCurrentCar: (car) => set({ currentCar: car }),
    
    startRace: () => set({ 
      phase: 'racing', 
      raceStartTime: Date.now(),
      currentLap: 1,
      position: 1
    }),
    
    pauseRace: () => set({ phase: 'paused' }),
    
    resumeRace: () => set({ phase: 'racing' }),
    
    finishRace: () => set({ phase: 'finished' }),
    
    resetRace: () => set({ 
      phase: 'menu',
      raceStartTime: undefined,
      currentLap: 1,
      position: 1
    }),
    
    setPosition: (position) => set({ position }),
    
    setCurrentLap: (lap) => set({ currentLap: lap }),
  }))
);
