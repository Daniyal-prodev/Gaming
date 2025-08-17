import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RaceResult } from '../types';

interface Championship {
  id: string;
  name: string;
  description: string;
  tracks: string[];
  requiredLevel: number;
  completed: boolean;
  rewards: {
    coins: number;
    experience: number;
    unlocks: string[];
  };
  progress: number;
}

interface CareerStore {
  currentLevel: number;
  experience: number;
  experienceToNext: number;
  unlockedCars: string[];
  unlockedTracks: string[];
  championships: Championship[];
  currentChampionship: string | null;
  
  completeRace: (result: RaceResult) => void;
  unlockCar: (carId: string) => void;
  unlockTrack: (trackId: string) => void;
  startChampionship: (championshipId: string) => void;
  completeChampionship: (championshipId: string) => void;
  calculateLevel: (experience: number) => number;
  getExperienceForLevel: (level: number) => number;
}

const initialChampionships: Championship[] = [
  {
    id: 'rookie-series',
    name: 'Rookie Series',
    description: 'Start your racing career with basic circuits',
    tracks: ['cyber-circuit'],
    requiredLevel: 1,
    completed: false,
    rewards: {
      coins: 5000,
      experience: 1000,
      unlocks: ['neon-bolt']
    },
    progress: 0
  },
  {
    id: 'pro-championship',
    name: 'Pro Championship',
    description: 'Advanced racing with challenging tracks',
    tracks: ['cyber-circuit', 'neon-speedway'],
    requiredLevel: 5,
    completed: false,
    rewards: {
      coins: 15000,
      experience: 3000,
      unlocks: ['quantum-racer']
    },
    progress: 0
  },
  {
    id: 'elite-masters',
    name: 'Elite Masters',
    description: 'The ultimate racing challenge for professionals',
    tracks: ['cyber-circuit', 'neon-speedway', 'quantum-track'],
    requiredLevel: 10,
    completed: false,
    rewards: {
      coins: 50000,
      experience: 10000,
      unlocks: ['hypercar-x1']
    },
    progress: 0
  }
];

export const useCareer = create<CareerStore>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      experience: 0,
      experienceToNext: 1000,
      unlockedCars: ['cyber-racer'],
      unlockedTracks: ['cyber-circuit'],
      championships: initialChampionships,
      currentChampionship: null,
      
      calculateLevel: (experience: number) => {
        return Math.floor(experience / 1000) + 1;
      },
      
      getExperienceForLevel: (level: number) => {
        return (level - 1) * 1000;
      },
      
      completeRace: (result: RaceResult) => {
        const { experience, currentLevel, calculateLevel, getExperienceForLevel } = get();
        
        const newExperience = experience + result.experienceEarned;
        const newLevel = calculateLevel(newExperience);
        const experienceForCurrentLevel = getExperienceForLevel(newLevel);
        const experienceForNextLevel = getExperienceForLevel(newLevel + 1);
        const experienceToNext = experienceForNextLevel - newExperience;
        
        set({
          experience: newExperience,
          currentLevel: newLevel,
          experienceToNext
        });
        
        if (newLevel > currentLevel) {
          console.log(`Level up! You are now level ${newLevel}`);
          
          if (newLevel === 5) {
            get().unlockCar('neon-bolt');
          } else if (newLevel === 10) {
            get().unlockCar('quantum-racer');
          } else if (newLevel === 15) {
            get().unlockCar('hypercar-x1');
          }
        }
      },
      
      unlockCar: (carId: string) => {
        set((state) => ({
          unlockedCars: state.unlockedCars.includes(carId) 
            ? state.unlockedCars 
            : [...state.unlockedCars, carId]
        }));
      },
      
      unlockTrack: (trackId: string) => {
        set((state) => ({
          unlockedTracks: state.unlockedTracks.includes(trackId)
            ? state.unlockedTracks
            : [...state.unlockedTracks, trackId]
        }));
      },
      
      startChampionship: (championshipId: string) => {
        set({ currentChampionship: championshipId });
      },
      
      completeChampionship: (championshipId: string) => {
        const { championships, experience } = get();
        
        const championship = championships.find(c => c.id === championshipId);
        if (!championship || championship.completed) return;
        
        const updatedChampionships = championships.map(c => 
          c.id === championshipId 
            ? { ...c, completed: true, progress: 100 }
            : c
        );
        
        const newExperience = experience + championship.rewards.experience;
        const newLevel = get().calculateLevel(newExperience);
        const experienceToNext = get().getExperienceForLevel(newLevel + 1) - newExperience;
        
        set({
          championships: updatedChampionships,
          experience: newExperience,
          currentLevel: newLevel,
          experienceToNext,
          currentChampionship: null
        });
        
        championship.rewards.unlocks.forEach(unlock => {
          if (unlock.startsWith('car-')) {
            get().unlockCar(unlock);
          } else if (unlock.startsWith('track-')) {
            get().unlockTrack(unlock);
          }
        });
      }
    }),
    {
      name: 'career-storage'
    }
  )
);
