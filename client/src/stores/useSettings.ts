import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { GameSettings } from '../../../shared/types';

interface SettingsStore extends GameSettings {
  updateAudioSettings: (settings: Partial<GameSettings['audio']>) => void;
  updateGraphicsSettings: (settings: Partial<GameSettings['graphics']>) => void;
  updateControlsSettings: (settings: Partial<GameSettings['controls']>) => void;
  updateGameplaySettings: (settings: Partial<GameSettings['gameplay']>) => void;
  resetToDefaults: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

const defaultSettings: GameSettings = {
  audio: {
    masterVolume: 0.7,
    engineVolume: 0.8,
    musicVolume: 0.5,
    effectsVolume: 0.6,
    muted: false,
  },
  graphics: {
    quality: 'high',
    shadows: true,
    reflections: true,
    particles: true,
    antiAliasing: true,
    vsync: true,
  },
  controls: {
    accelerate: 'ArrowUp',
    brake: 'ArrowDown',
    steerLeft: 'ArrowLeft',
    steerRight: 'ArrowRight',
    handbrake: ' ',
    camera: 'c',
    sensitivity: 1.0,
  },
  gameplay: {
    difficulty: 'normal',
    assists: {
      abs: true,
      tcs: true,
      steeringAssist: false,
      brakingAssist: false,
    },
    hud: {
      speedometer: true,
      minimap: true,
      lapTimes: true,
      position: true,
    },
  },
};

export const useSettings = create<SettingsStore>()(
  subscribeWithSelector((set, get) => ({
    ...defaultSettings,
    
    updateAudioSettings: (settings) => set((state) => ({
      audio: { ...state.audio, ...settings }
    })),
    
    updateGraphicsSettings: (settings) => set((state) => ({
      graphics: { ...state.graphics, ...settings }
    })),
    
    updateControlsSettings: (settings) => set((state) => ({
      controls: { ...state.controls, ...settings }
    })),
    
    updateGameplaySettings: (settings) => set((state) => ({
      gameplay: { ...state.gameplay, ...settings }
    })),
    
    resetToDefaults: () => set(defaultSettings),
    
    loadSettings: () => {
      try {
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
          const settings = JSON.parse(saved);
          set({ ...defaultSettings, ...settings });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    },
    
    saveSettings: () => {
      try {
        const settings = get();
        const { updateAudioSettings, updateGraphicsSettings, updateControlsSettings, updateGameplaySettings, resetToDefaults, loadSettings, saveSettings, ...settingsToSave } = settings;
        localStorage.setItem('gameSettings', JSON.stringify(settingsToSave));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    },
  }))
);
