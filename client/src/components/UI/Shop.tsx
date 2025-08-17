import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Car, Wrench, Palette, Coins } from 'lucide-react';
import { usePayment } from '../../stores/usePayment';
import { useGarage } from '../../stores/useGarage';
import { Car as CarType, CarUpgrade } from '../../types';

const shopCars: CarType[] = [
  {
    id: 'neon-bolt',
    name: 'Neon Bolt',
    model: 'NB-X1',
    color: '#ff00ff',
    speed: 92,
    acceleration: 95,
    handling: 88,
    braking: 90,
    price: 25000,
    owned: false,
    upgrades: []
  },
  {
    id: 'quantum-racer',
    name: 'Quantum Racer',
    model: 'QR-3000',
    color: '#00ff00',
    speed: 98,
    acceleration: 92,
    handling: 95,
    braking: 88,
    price: 50000,
    owned: false,
    upgrades: []
  },
  {
    id: 'hypercar-x1',
    name: 'Hypercar X1',
    model: 'HX-9999',
    color: '#ffff00',
    speed: 100,
    acceleration: 98,
    handling: 96,
    braking: 95,
    price: 100000,
    owned: false,
    upgrades: []
  }
];

const coinPackages = [
  { id: 'small', name: 'Small Pack', coins: 10000, price: 4.99 },
  { id: 'medium', name: 'Medium Pack', coins: 25000, price: 9.99 },
  { id: 'large', name: 'Large Pack', coins: 60000, price: 19.99 },
  { id: 'mega', name: 'Mega Pack', coins: 150000, price: 39.99 }
];

const cosmetics = [
  { id: 'neon-paint', name: 'Neon Paint Job', type: 'paint', price: 5000 },
  { id: 'carbon-decals', name: 'Carbon Fiber Decals', type: 'decal', price: 3000 },
  { id: 'racing-stripes', name: 'Racing Stripes', type: 'decal', price: 2500 },
  { id: 'holographic-finish', name: 'Holographic Finish', type: 'paint', price: 8000 }
];

export default function Shop() {
  const [, setLocation] = useLocation();
  const { coins, spendCoins } = usePayment();
  const { ownedCars, purchaseCar } = useGarage();
  const [activeTab, setActiveTab] = useState('cars');

  const goBack = () => {
    setLocation('/');
  };

  const handlePurchaseCar = async (car: CarType) => {
    if (coins < car.price) return;

    const success = spendCoins(car.price);
    if (success) {
      purchaseCar(car);
    }
  };

  const handlePurchaseUpgrade = async (upgrade: CarUpgrade) => {
    if (coins < upgrade.price) return;

    spendCoins(upgrade.price);
  };

  const handlePurchaseCosmetic = async (cosmetic: any) => {
    if (coins < cosmetic.price) return;

    spendCoins(cosmetic.price);
  };

  const handlePurchaseCoins = async (coinPackage: any) => {
    try {
      console.log(`Purchasing ${coinPackage.coins} coins for $${coinPackage.price}`);
    } catch (error) {
      console.error('Failed to purchase coins:', error);
    }
  };

  const isCarOwned = (carId: string) => {
    return ownedCars.some(car => car.id === carId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="absolute inset-0 bg-[url('/images/city-bg.jpg')] bg-cover bg-center opacity-20" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={goBack}
            variant="outline" 
            size="sm"
            className="cyber-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          
          <h1 className="text-4xl font-bold neon-text">
            Shop
          </h1>
          
          <div className="flex items-center gap-2 ml-auto">
            <Coins className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">{coins.toLocaleString()} coins</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Cars
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Upgrades
            </TabsTrigger>
            <TabsTrigger value="cosmetics" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Cosmetics
            </TabsTrigger>
            <TabsTrigger value="coins" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Coins
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cars" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopCars.map((car) => {
                const owned = isCarOwned(car.id);
                const canAfford = coins >= car.price;
                
                return (
                  <Card key={car.id} className="cyber-panel">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{car.name}</span>
                        {owned && <Badge variant="default">Owned</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          {car.model}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Speed: {car.speed}</div>
                          <div>Acceleration: {car.acceleration}</div>
                          <div>Handling: {car.handling}</div>
                          <div>Braking: {car.braking}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">
                            {car.price.toLocaleString()} coins
                          </span>
                          
                          <Button
                            onClick={() => handlePurchaseCar(car)}
                            disabled={owned || !canAfford}
                            className="cyber-button"
                          >
                            {owned ? 'Owned' : canAfford ? 'Purchase' : 'Not enough coins'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="upgrades" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'turbo-v2', name: 'Turbo Engine V2', type: 'engine', boost: 20, price: 8000 },
                { id: 'slick-tires', name: 'Slick Racing Tires', type: 'tires', boost: 15, price: 4000 },
                { id: 'pro-suspension', name: 'Pro Suspension', type: 'suspension', boost: 18, price: 6000 },
                { id: 'advanced-aero', name: 'Advanced Aero Kit', type: 'aerodynamics', boost: 12, price: 5500 }
              ].map((upgrade) => {
                const canAfford = coins >= upgrade.price;
                
                return (
                  <Card key={upgrade.id} className="cyber-panel">
                    <CardHeader>
                      <CardTitle>{upgrade.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground capitalize">
                          {upgrade.type} Upgrade
                        </div>
                        
                        <div className="text-sm">
                          <span className="text-primary">+{upgrade.boost}</span> {upgrade.type}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">
                            {upgrade.price.toLocaleString()} coins
                          </span>
                          
                          <Button
                            onClick={() => handlePurchaseUpgrade(upgrade as CarUpgrade)}
                            disabled={!canAfford}
                            className="cyber-button"
                          >
                            {canAfford ? 'Purchase' : 'Not enough coins'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="cosmetics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cosmetics.map((cosmetic) => {
                const canAfford = coins >= cosmetic.price;
                
                return (
                  <Card key={cosmetic.id} className="cyber-panel">
                    <CardHeader>
                      <CardTitle>{cosmetic.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground capitalize">
                          {cosmetic.type}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">
                            {cosmetic.price.toLocaleString()} coins
                          </span>
                          
                          <Button
                            onClick={() => handlePurchaseCosmetic(cosmetic)}
                            disabled={!canAfford}
                            className="cyber-button"
                          >
                            {canAfford ? 'Purchase' : 'Not enough coins'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="coins" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coinPackages.map((coinPackage) => (
                <Card key={coinPackage.id} className="cyber-panel">
                  <CardHeader>
                    <CardTitle className="text-center">
                      {coinPackage.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {coinPackage.coins.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        coins
                      </div>
                      
                      <div className="text-lg font-semibold">
                        ${coinPackage.price}
                      </div>
                      
                      <Button
                        onClick={() => handlePurchaseCoins(coinPackage)}
                        className="cyber-button w-full"
                      >
                        Purchase
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
