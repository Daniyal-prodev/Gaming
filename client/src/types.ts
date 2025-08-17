export interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Car {
  id: string;
  name: string;
  model: string;
  color: string;
  speed: number;
  acceleration: number;
  handling: number;
  braking: number;
  price: number;
  owned: boolean;
  upgrades: CarUpgrade[];
}

export interface CarUpgrade {
  id: string;
  name: string;
  type: 'engine' | 'tires' | 'suspension' | 'aerodynamics';
  boost: number;
  price: number;
  installed: boolean;
}

export interface Track {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  length: number;
  checkpoints: Checkpoint[];
  bestTime?: number;
  weather: WeatherCondition;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
}

export interface Checkpoint {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  order: number;
  isFinishLine: boolean;
}

export interface LapTime {
  lapNumber: number;
  time: number;
  sectorTimes: number[];
  timestamp: Date;
}

export interface RaceResult {
  userId: string;
  trackId: string;
  carId: string;
  totalTime: number;
  lapTimes: LapTime[];
  position: number;
  coinsEarned: number;
  experienceEarned: number;
}

export interface GameSettings {
  audio: {
    masterVolume: number;
    engineVolume: number;
    musicVolume: number;
    effectsVolume: number;
    muted: boolean;
  };
  graphics: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    shadows: boolean;
    reflections: boolean;
    particles: boolean;
    antiAliasing: boolean;
    vsync: boolean;
  };
  controls: {
    accelerate: string;
    brake: string;
    steerLeft: string;
    steerRight: string;
    handbrake: string;
    camera: string;
    sensitivity: number;
  };
  gameplay: {
    difficulty: 'easy' | 'normal' | 'hard' | 'simulation';
    assists: {
      abs: boolean;
      tcs: boolean;
      steeringAssist: boolean;
      brakingAssist: boolean;
    };
    hud: {
      speedometer: boolean;
      minimap: boolean;
      lapTimes: boolean;
      position: boolean;
    };
  };
}

export interface WeatherCondition {
  type: 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog';
  intensity: number;
  windSpeed: number;
  temperature: number;
}

export interface MultiplayerRoom {
  id: string;
  name: string;
  trackId: string;
  maxPlayers: number;
  currentPlayers: Player[];
  status: 'waiting' | 'racing' | 'finished';
  settings: RoomSettings;
}

export interface Player {
  id: string;
  username: string;
  carId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  lapNumber: number;
  racePosition: number;
  ready: boolean;
}

export interface RoomSettings {
  laps: number;
  weather: WeatherCondition;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  assists: boolean;
  collisions: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  items: PurchaseItem[];
}

export interface PurchaseItem {
  type: 'car' | 'upgrade' | 'coins' | 'cosmetic';
  itemId: string;
  quantity: number;
  price: number;
}

export interface GameState {
  phase: 'menu' | 'loading' | 'racing' | 'paused' | 'finished';
  currentTrack?: Track;
  currentCar?: Car;
  raceStartTime?: number;
  currentLap: number;
  totalLaps: number;
  position: number;
  totalPlayers: number;
}

export interface RacingState {
  carPosition: [number, number, number];
  carRotation: [number, number, number];
  carVelocity: [number, number, number];
  speed: number;
  rpm: number;
  gear: number;
  fuel: number;
  damage: number;
  lapTimes: LapTime[];
  currentLapTime: number;
  bestLapTime?: number;
  checkpointsPassed: number;
  nextCheckpoint: number;
  raceFinished: boolean;
}
