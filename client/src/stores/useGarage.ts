import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Car, CarUpgrade } from '../types';

interface GarageStore {
  ownedCars: Car[];
  selectedCarId: string;
  availableUpgrades: CarUpgrade[];
  
  selectCar: (carId: string) => void;
  purchaseCar: (car: Car) => void;
  installUpgrade: (carId: string, upgradeId: string) => void;
  removeUpgrade: (carId: string, upgradeId: string) => void;
  getSelectedCar: () => Car | null;
  getCarUpgrades: (carId: string) => CarUpgrade[];
  calculateCarStats: (carId: string) => Car | null;
}

const initialCars: Car[] = [
  {
    id: 'cyber-racer',
    name: 'Cyber Racer',
    model: 'CR-2077',
    color: '#00ffff',
    speed: 95,
    acceleration: 88,
    handling: 92,
    braking: 85,
    price: 0,
    owned: true,
    upgrades: []
  }
];

const availableUpgrades: CarUpgrade[] = [
  {
    id: 'turbo-engine',
    name: 'Turbo Engine',
    type: 'engine',
    boost: 15,
    price: 5000,
    installed: false
  },
  {
    id: 'racing-tires',
    name: 'Racing Tires',
    type: 'tires',
    boost: 10,
    price: 2500,
    installed: false
  },
  {
    id: 'sport-suspension',
    name: 'Sport Suspension',
    type: 'suspension',
    boost: 12,
    price: 3500,
    installed: false
  },
  {
    id: 'aero-kit',
    name: 'Aerodynamics Kit',
    type: 'aerodynamics',
    boost: 8,
    price: 4000,
    installed: false
  },
  {
    id: 'nitro-boost',
    name: 'Nitro Boost',
    type: 'engine',
    boost: 25,
    price: 10000,
    installed: false
  },
  {
    id: 'carbon-brakes',
    name: 'Carbon Fiber Brakes',
    type: 'tires',
    boost: 20,
    price: 7500,
    installed: false
  }
];

export const useGarage = create<GarageStore>()(
  persist(
    (set, get) => ({
      ownedCars: initialCars,
      selectedCarId: 'cyber-racer',
      availableUpgrades,
      
      selectCar: (carId: string) => {
        const { ownedCars } = get();
        const car = ownedCars.find(c => c.id === carId);
        if (car) {
          set({ selectedCarId: carId });
        }
      },
      
      purchaseCar: (car: Car) => {
        set((state) => ({
          ownedCars: [...state.ownedCars, { ...car, owned: true, upgrades: [] }]
        }));
      },
      
      installUpgrade: (carId: string, upgradeId: string) => {
        const { ownedCars, availableUpgrades } = get();
        const upgrade = availableUpgrades.find(u => u.id === upgradeId);
        
        if (!upgrade) return;
        
        const updatedCars = ownedCars.map(car => {
          if (car.id === carId) {
            const existingUpgrade = car.upgrades.find((u: CarUpgrade) => u.id === upgradeId);
            if (!existingUpgrade) {
              return {
                ...car,
                upgrades: [...car.upgrades, { ...upgrade, installed: true }]
              };
            }
          }
          return car;
        });
        
        set({ ownedCars: updatedCars });
      },
      
      removeUpgrade: (carId: string, upgradeId: string) => {
        const { ownedCars } = get();
        
        const updatedCars = ownedCars.map(car => {
          if (car.id === carId) {
            return {
              ...car,
              upgrades: car.upgrades.filter((u: CarUpgrade) => u.id !== upgradeId)
            };
          }
          return car;
        });
        
        set({ ownedCars: updatedCars });
      },
      
      getSelectedCar: () => {
        const { ownedCars, selectedCarId } = get();
        return ownedCars.find(car => car.id === selectedCarId) || null;
      },
      
      getCarUpgrades: (carId: string) => {
        const { ownedCars } = get();
        const car = ownedCars.find(c => c.id === carId);
        return car ? car.upgrades : [];
      },
      
      calculateCarStats: (carId: string) => {
        const { ownedCars } = get();
        const car = ownedCars.find(c => c.id === carId);
        
        if (!car) return null;
        
        let modifiedCar = { ...car };
        
        car.upgrades.forEach((upgrade: CarUpgrade) => {
          switch (upgrade.type) {
            case 'engine':
              modifiedCar.speed += upgrade.boost;
              modifiedCar.acceleration += upgrade.boost * 0.8;
              break;
            case 'tires':
              modifiedCar.handling += upgrade.boost;
              modifiedCar.braking += upgrade.boost * 0.9;
              break;
            case 'suspension':
              modifiedCar.handling += upgrade.boost;
              modifiedCar.speed += upgrade.boost * 0.3;
              break;
            case 'aerodynamics':
              modifiedCar.speed += upgrade.boost;
              modifiedCar.handling += upgrade.boost * 0.6;
              break;
          }
        });
        
        modifiedCar.speed = Math.min(100, modifiedCar.speed);
        modifiedCar.acceleration = Math.min(100, modifiedCar.acceleration);
        modifiedCar.handling = Math.min(100, modifiedCar.handling);
        modifiedCar.braking = Math.min(100, modifiedCar.braking);
        
        return modifiedCar;
      }
    }),
    {
      name: 'garage-storage'
    }
  )
);
