import React, { Suspense } from 'react';
import { useLocation } from 'wouter';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ArrowLeft, Wrench, Zap, Settings, TrendingUp } from 'lucide-react';
import { useGarage } from '../../stores/useGarage';
import { usePayment } from '../../stores/usePayment';

function CarPreview({ carId }: { carId: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.4, 5]} />
        <meshStandardMaterial 
          color="#001a33" 
          metalness={0.9} 
          roughness={0.1}
        />
        
        <mesh position={[0, 0.4, 0.5]} castShadow>
          <boxGeometry args={[1.6, 0.6, 2]} />
          <meshStandardMaterial 
            color="#000011" 
            transparent 
            opacity={0.2}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
        
        <mesh position={[0, 0, 2.8]} castShadow>
          <coneGeometry args={[0.8, 1.2, 8]} />
          <meshStandardMaterial 
            color="#001a33" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
      </mesh>

      <mesh position={[-1.1, 0.3, 1.8]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.25, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.1, 0.3, 1.8]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.25, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1.1, 0.3, -1.8]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.25, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.1, 0.3, -1.8]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.25, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function Garage() {
  const [, setLocation] = useLocation();
  const { 
    ownedCars, 
    selectedCarId, 
    availableUpgrades, 
    selectCar, 
    installUpgrade, 
    removeUpgrade, 
    getSelectedCar, 
    getCarUpgrades, 
    calculateCarStats 
  } = useGarage();
  const { coins, spendCoins } = usePayment();

  const selectedCar = getSelectedCar();
  const carUpgrades = getCarUpgrades(selectedCarId);
  const carStats = calculateCarStats(selectedCarId);

  const goBack = () => {
    setLocation('/');
  };

  const handleInstallUpgrade = async (upgradeId: string) => {
    const upgrade = availableUpgrades.find(u => u.id === upgradeId);
    if (!upgrade || coins < upgrade.price) return;

    const success = spendCoins(upgrade.price);
    if (success) {
      installUpgrade(selectedCarId, upgradeId);
    }
  };

  const handleRemoveUpgrade = (upgradeId: string) => {
    removeUpgrade(selectedCarId, upgradeId);
  };

  const getUpgradeIcon = (type: string) => {
    switch (type) {
      case 'engine': return <Zap className="w-4 h-4" />;
      case 'tires': return <Settings className="w-4 h-4" />;
      case 'suspension': return <TrendingUp className="w-4 h-4" />;
      case 'aerodynamics': return <Wrench className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  if (!selectedCar) return null;

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
            Garage
          </h1>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-lg font-semibold">{coins.toLocaleString()} coins</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="cyber-panel">
              <CardHeader>
                <CardTitle>3D Car Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <Canvas
                    shadows
                    camera={{ position: [5, 3, 5], fov: 50 }}
                  >
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.4} />
                      <directionalLight 
                        position={[10, 10, 5]} 
                        intensity={1} 
                        castShadow 
                      />
                      <CarPreview carId={selectedCarId} />
                      <OrbitControls 
                        enablePan={false} 
                        enableZoom={true}
                        maxDistance={15}
                        minDistance={3}
                      />
                      <Environment preset="night" />
                    </Suspense>
                  </Canvas>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-panel">
              <CardHeader>
                <CardTitle>Car Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ownedCars.map((car) => (
                    <Card 
                      key={car.id}
                      className={`cursor-pointer transition-all ${
                        selectedCarId === car.id 
                          ? 'border-primary bg-primary/10' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => selectCar(car.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{car.name}</h3>
                            <p className="text-sm text-muted-foreground">{car.model}</p>
                          </div>
                          {selectedCarId === car.id && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Speed: {carStats?.speed || car.speed}</div>
                          <div>Acceleration: {carStats?.acceleration || car.acceleration}</div>
                          <div>Handling: {carStats?.handling || car.handling}</div>
                          <div>Braking: {carStats?.braking || car.braking}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="cyber-panel">
              <CardHeader>
                <CardTitle>{selectedCar.name} Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Speed</span>
                    <span>{carStats?.speed || selectedCar.speed}/100</span>
                  </div>
                  <Progress value={carStats?.speed || selectedCar.speed} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Acceleration</span>
                    <span>{carStats?.acceleration || selectedCar.acceleration}/100</span>
                  </div>
                  <Progress value={carStats?.acceleration || selectedCar.acceleration} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Handling</span>
                    <span>{carStats?.handling || selectedCar.handling}/100</span>
                  </div>
                  <Progress value={carStats?.handling || selectedCar.handling} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Braking</span>
                    <span>{carStats?.braking || selectedCar.braking}/100</span>
                  </div>
                  <Progress value={carStats?.braking || selectedCar.braking} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-panel">
              <CardHeader>
                <CardTitle>Installed Upgrades</CardTitle>
              </CardHeader>
              <CardContent>
                {carUpgrades.length > 0 ? (
                  <div className="space-y-2">
                    {carUpgrades.map((upgrade) => (
                      <div 
                        key={upgrade.id}
                        className="flex items-center justify-between p-2 bg-primary/10 rounded"
                      >
                        <div className="flex items-center gap-2">
                          {getUpgradeIcon(upgrade.type)}
                          <span className="text-sm">{upgrade.name}</span>
                        </div>
                        <Button
                          onClick={() => handleRemoveUpgrade(upgrade.id)}
                          variant="outline"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No upgrades installed
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="cyber-panel">
              <CardHeader>
                <CardTitle>Available Upgrades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableUpgrades
                    .filter(upgrade => !carUpgrades.find(cu => cu.id === upgrade.id))
                    .map((upgrade) => (
                    <div 
                      key={upgrade.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        {getUpgradeIcon(upgrade.type)}
                        <div>
                          <div className="font-medium">{upgrade.name}</div>
                          <div className="text-sm text-muted-foreground">
                            +{upgrade.boost} {upgrade.type}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">
                          {upgrade.price.toLocaleString()} coins
                        </div>
                        <Button
                          onClick={() => handleInstallUpgrade(upgrade.id)}
                          disabled={coins < upgrade.price}
                          size="sm"
                          className="mt-1"
                        >
                          Install
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
