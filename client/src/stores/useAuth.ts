import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCoins: (amount: number) => void;
  setGuestMode: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const coins = email === 'aribdaniyal88@gmail.com' ? 10000000000 : 1000;
          
          const user: User = {
            id: '1',
            username: email.split('@')[0],
            email,
            coins,
            createdAt: new Date().toISOString(),
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },
      
      signup: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: '1',
            username,
            email,
            coins: 1000,
            createdAt: new Date().toISOString(),
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateCoins: (amount: number) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, coins: user.coins + amount } });
        }
      },
      
      setGuestMode: () => {
        const guestUser: User = {
          id: 'guest',
          username: 'Guest Player',
          email: 'guest@local',
          coins: 1000,
          createdAt: new Date().toISOString(),
        };
        set({ user: guestUser, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
