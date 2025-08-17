import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AudioStore {
  masterVolume: number;
  motivationalMusic: any;
  engineVolume: number;
  musicVolume: number;
  effectsVolume: number;
  muted: boolean;
  audioContext: AudioContext | null;
  engineOscillator: OscillatorNode | null;
  engineGain: GainNode | null;
  musicOscillator: OscillatorNode | null;
  musicGain: GainNode | null;
  isEngineRunning: boolean;
  isMusicPlaying: boolean;
  
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
  playMotivationalMusic: () => void;
  stopMotivationalMusic: () => void;
  initializeAudio: () => void;
}

export const useAudio = create<AudioStore>()(
  subscribeWithSelector((set, get) => ({
    masterVolume: 0.7,
    motivationalMusic: null,
    engineVolume: 0.8,
    musicVolume: 0.5,
    effectsVolume: 0.6,
    muted: false,
    audioContext: null,
    engineOscillator: null,
    engineGain: null,
    musicOscillator: null,
    musicGain: null,
    isEngineRunning: false,
    isMusicPlaying: false,
    
    setMasterVolume: (volume) => set({ masterVolume: volume }),
    
    setEngineVolume: (volume) => set({ engineVolume: volume }),
    
    setMusicVolume: (volume) => set({ musicVolume: volume }),
    
    setEffectsVolume: (volume) => set({ effectsVolume: volume }),
    
    toggleMute: () => set((state) => ({ muted: !state.muted })),
    
    playEngineSound: (rpm) => {
      const { audioContext, engineOscillator, engineGain, engineVolume, masterVolume, muted, isEngineRunning } = get();
      
      if (!audioContext || muted) return;
      
      try {
        if (!isEngineRunning && engineOscillator && engineGain) {
          const frequency = 80 + (rpm / 8000) * 400;
          engineOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          
          const volume = (engineVolume * masterVolume) * Math.min(rpm / 6000, 1) * 0.3;
          engineGain.gain.setValueAtTime(volume, audioContext.currentTime);
          
          if (audioContext.state === 'suspended') {
            audioContext.resume();
          }
          
          set({ isEngineRunning: true });
        } else if (isEngineRunning && engineOscillator && engineGain) {
          const frequency = 80 + (rpm / 8000) * 400;
          engineOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          
          const volume = (engineVolume * masterVolume) * Math.min(rpm / 6000, 1) * 0.3;
          engineGain.gain.setValueAtTime(volume, audioContext.currentTime);
        }
      } catch (error) {
        console.warn('Audio playback failed:', error);
      }
    },
    
    playCollisionSound: () => {
      const { audioContext, effectsVolume, masterVolume, muted } = get();
      if (!audioContext || muted) return;
      
      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
        
        const volume = effectsVolume * masterVolume * 0.5;
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.warn('Collision sound failed:', error);
      }
    },
    
    playLapCompleteSound: () => {
      const { audioContext, effectsVolume, masterVolume, muted } = get();
      if (!audioContext || muted) return;
      
      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.4);
        
        const volume = effectsVolume * masterVolume * 0.4;
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.6);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
      } catch (error) {
        console.warn('Lap complete sound failed:', error);
      }
    },
    
    playBackgroundMusic: () => {
      const { audioContext, musicOscillator, musicGain, musicVolume, masterVolume, muted, isMusicPlaying } = get();
      
      if (!audioContext || muted || isMusicPlaying) return;
      
      try {
        if (musicOscillator && musicGain) {
          const volume = musicVolume * masterVolume * 0.1;
          musicGain.gain.setValueAtTime(volume, audioContext.currentTime);
          
          if (audioContext.state === 'suspended') {
            audioContext.resume();
          }
          
          set({ isMusicPlaying: true });
        }
      } catch (error) {
        console.warn('Background music failed:', error);
      }
    },
    
    stopBackgroundMusic: () => {
      const { musicGain, audioContext } = get();
      if (musicGain && audioContext) {
        musicGain.gain.setValueAtTime(0, audioContext.currentTime);
        set({ isMusicPlaying: false });
      }
    },

    playMotivationalMusic: () => {
      const { audioContext, motivationalMusic, musicVolume, masterVolume } = get();
      if (audioContext && !motivationalMusic) {
        try {
          const oscillator1 = audioContext.createOscillator();
          const oscillator2 = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator1.type = 'sawtooth';
          oscillator2.type = 'square';
          
          const baseFreq = 220;
          oscillator1.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
          oscillator2.frequency.setValueAtTime(baseFreq * 1.5, audioContext.currentTime);
          
          gainNode.gain.setValueAtTime(musicVolume * masterVolume * 0.2, audioContext.currentTime);
          
          oscillator1.connect(gainNode);
          oscillator2.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          const playLoop = () => {
            const now = audioContext.currentTime;
            const melody = [220, 277, 330, 370, 440, 370, 330, 277];
            
            melody.forEach((freq, i) => {
              oscillator1.frequency.setValueAtTime(freq, now + i * 0.5);
              oscillator2.frequency.setValueAtTime(freq * 1.5, now + i * 0.5);
            });
            
            setTimeout(() => {
              if (get().motivationalMusic) playLoop();
            }, 4000);
          };
          
          oscillator1.start();
          oscillator2.start();
          playLoop();
          
          set({ motivationalMusic: { oscillator1, oscillator2, gainNode } });
        } catch (error) {
          console.warn('Motivational music failed:', error);
        }
      }
    },

    stopMotivationalMusic: () => {
      const { motivationalMusic } = get();
      if (motivationalMusic) {
        try {
          motivationalMusic.oscillator1.stop();
          motivationalMusic.oscillator2.stop();
          set({ motivationalMusic: null });
        } catch (error) {
          console.warn('Stop motivational music failed:', error);
        }
      }
    },

    initializeAudio: () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const engineOscillator = audioContext.createOscillator();
        const engineGain = audioContext.createGain();
        const engineFilter = audioContext.createBiquadFilter();
        
        engineOscillator.type = 'sawtooth';
        engineOscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        engineFilter.type = 'lowpass';
        engineFilter.frequency.setValueAtTime(800, audioContext.currentTime);
        
        engineOscillator.connect(engineFilter);
        engineFilter.connect(engineGain);
        engineGain.connect(audioContext.destination);
        
        engineGain.gain.setValueAtTime(0, audioContext.currentTime);
        engineOscillator.start();
        
        const musicOscillator = audioContext.createOscillator();
        const musicGain = audioContext.createGain();
        
        musicOscillator.type = 'sine';
        musicOscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        
        musicOscillator.connect(musicGain);
        musicGain.connect(audioContext.destination);
        
        musicGain.gain.setValueAtTime(0, audioContext.currentTime);
        musicOscillator.start();
        
        set({ 
          audioContext, 
          engineOscillator, 
          engineGain,
          musicOscillator,
          musicGain
        });
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    },
  }))
);
