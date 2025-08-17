import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AudioStore {
  masterVolume: number;
  engineVolume: number;
  musicVolume: number;
  effectsVolume: number;
  muted: boolean;
  engineSound: HTMLAudioElement | null;
  musicTrack: HTMLAudioElement | null;
  
  setMasterVolume: (volume: number) => void;
  setEngineVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  toggleMute: () => void;
  playEngineSound: (rpm: number) => void;
  playCollisionSound: () => void;
  playLapCompleteSound: () => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  initializeAudio: () => void;
}

export const useAudio = create<AudioStore>()(
  subscribeWithSelector((set, get) => ({
    masterVolume: 0.7,
    engineVolume: 0.8,
    musicVolume: 0.5,
    effectsVolume: 0.6,
    muted: false,
    engineSound: null,
    musicTrack: null,
    
    setMasterVolume: (volume) => set({ masterVolume: volume }),
    
    setEngineVolume: (volume) => set({ engineVolume: volume }),
    
    setMusicVolume: (volume) => set({ musicVolume: volume }),
    
    setEffectsVolume: (volume) => set({ effectsVolume: volume }),
    
    toggleMute: () => set((state) => ({ muted: !state.muted })),
    
    playEngineSound: (rpm) => {
      const { engineSound, engineVolume, masterVolume, muted } = get();
      if (engineSound && !muted) {
        engineSound.volume = (engineVolume * masterVolume) * Math.min(rpm / 6000, 1);
        engineSound.playbackRate = 0.5 + (rpm / 8000);
        if (engineSound.paused) {
          engineSound.play().catch(() => {});
        }
      }
    },
    
    playCollisionSound: () => {
      const { effectsVolume, masterVolume, muted } = get();
      if (!muted) {
        const audio = new Audio('/sounds/collision.mp3');
        audio.volume = effectsVolume * masterVolume;
        audio.play().catch(() => {});
      }
    },
    
    playLapCompleteSound: () => {
      const { effectsVolume, masterVolume, muted } = get();
      if (!muted) {
        const audio = new Audio('/sounds/lap-complete.mp3');
        audio.volume = effectsVolume * masterVolume;
        audio.play().catch(() => {});
      }
    },
    
    playBackgroundMusic: () => {
      const { musicTrack, musicVolume, masterVolume, muted } = get();
      if (musicTrack && !muted) {
        musicTrack.volume = musicVolume * masterVolume;
        musicTrack.loop = true;
        musicTrack.play().catch(() => {});
      }
    },
    
    stopBackgroundMusic: () => {
      const { musicTrack } = get();
      if (musicTrack) {
        musicTrack.pause();
        musicTrack.currentTime = 0;
      }
    },
    
    initializeAudio: () => {
      const engineSound = new Audio('/sounds/engine.mp3');
      const musicTrack = new Audio('/sounds/background-music.mp3');
      
      engineSound.loop = true;
      musicTrack.loop = true;
      
      set({ engineSound, musicTrack });
    },
  }))
);
