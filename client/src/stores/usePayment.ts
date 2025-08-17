import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { PaymentIntent, PurchaseItem, Car, CarUpgrade } from '../types';

interface PaymentStore {
  coins: number;
  ownedCars: Car[];
  ownedUpgrades: CarUpgrade[];
  cart: PurchaseItem[];
  isProcessing: boolean;
  
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addToCart: (item: PurchaseItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  purchaseWithCoins: (items: PurchaseItem[]) => Promise<boolean>;
  purchaseWithStripe: (items: PurchaseItem[]) => Promise<PaymentIntent>;
  purchaseItem: (items: PurchaseItem[]) => Promise<void>;
  createPaymentIntent: (items: PurchaseItem[]) => Promise<PaymentIntent>;
  buyCar: (car: Car) => Promise<boolean>;
  buyUpgrade: (upgrade: CarUpgrade) => Promise<boolean>;
  buyCoins: (amount: number) => Promise<PaymentIntent>;
}

export const usePayment = create<PaymentStore>()(
  subscribeWithSelector((set, get) => ({
    coins: 99999999999999999,
    ownedCars: [],
    ownedUpgrades: [],
    cart: [],
    isProcessing: false,
    
    addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
    
    spendCoins: (amount) => {
      const { coins } = get();
      if (coins >= amount) {
        set({ coins: coins - amount });
        return true;
      }
      return false;
    },
    
    addToCart: (item) => set((state) => ({
      cart: [...state.cart.filter(i => i.itemId !== item.itemId), item]
    })),
    
    removeFromCart: (itemId) => set((state) => ({
      cart: state.cart.filter(item => item.itemId !== itemId)
    })),
    
    clearCart: () => set({ cart: [] }),
    
    purchaseWithCoins: async (items) => {
      const totalCost = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const success = get().spendCoins(totalCost);
      
      if (success) {
        items.forEach(item => {
          if (item.type === 'car') {
          } else if (item.type === 'upgrade') {
          }
        });
        get().clearCart();
      }
      
      return success;
    },
    
    purchaseWithStripe: async (items) => {
      set({ isProcessing: true });
      
      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });
        
        const paymentIntent = await response.json();
        return paymentIntent;
      } catch (error) {
        console.error('Payment failed:', error);
        throw error;
      } finally {
        set({ isProcessing: false });
      }
    },
    
    buyCar: async (car) => {
      return get().purchaseWithCoins([{
        type: 'car',
        itemId: car.id,
        quantity: 1,
        price: car.price,
      }]);
    },
    
    buyUpgrade: async (upgrade) => {
      return get().purchaseWithCoins([{
        type: 'upgrade',
        itemId: upgrade.id,
        quantity: 1,
        price: upgrade.price,
      }]);
    },
    
    purchaseItem: async (items: PurchaseItem[]) => {
      const totalCost = items.reduce((sum, item) => sum + item.price, 0);
      const success = get().spendCoins(totalCost);
      
      if (!success) {
        throw new Error('Insufficient coins');
      }
    },
    
    createPaymentIntent: async (items: PurchaseItem[]): Promise<PaymentIntent> => {
      return get().purchaseWithStripe(items);
    },

    buyCoins: async (amount) => {
      const pricePerCoin = 0.01;
      return get().purchaseWithStripe([{
        type: 'coins',
        itemId: 'coins',
        quantity: amount,
        price: amount * pricePerCoin,
      }]);
    },
  }))
);
