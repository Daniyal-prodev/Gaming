import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Play, Settings, Trophy, Car, Coins, Users } from 'lucide-react';
import { useGame } from '../../stores/useGame';
import { usePayment } from '../../stores/usePayment';
import { useAudio } from '../../stores/useAudio';

export default function MainMenu() {
  const [, setLocation] = useLocation();
  const { setPhase } = useGame();
  const { coins } = usePayment();
  const { initializeAudio, playBackgroundMusic } = useAudio();

  useEffect(() => {
    const handleUserInteraction = async () => {
      await initializeAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [initializeAudio]);

  const startGame = () => {
    setPhase('loading');
    setLocation('/game');
  };

  const openSettings = () => {
    setLocation('/settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/images/city-bg.jpg')] bg-cover bg-center opacity-20" />
      
      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold neon-text mb-4">
            GAMEHUB
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional Racing Experience
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Coins className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">{coins.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="cyber-panel hover:border-primary/60 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Quick Race
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Jump into a single-player race with AI opponents
              </p>
              <Button 
                onClick={startGame}
                className="cyber-button w-full"
                size="lg"
              >
                Start Racing
              </Button>
            </CardContent>
          </Card>

          <Card className="cyber-panel hover:border-primary/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Multiplayer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Race against players from around the world
              </p>
              <Button 
                onClick={() => setLocation('/multiplayer')}
                className="cyber-button w-full"
                size="lg"
              >
                Join Race
              </Button>
            </CardContent>
          </Card>

          <Card className="cyber-panel hover:border-primary/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Career Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Progress through championships and unlock rewards
              </p>
              <Button 
                onClick={() => setLocation('/career')}
                className="cyber-button w-full"
                size="lg"
              >
                Start Career
              </Button>
            </CardContent>
          </Card>

          <Card className="cyber-panel hover:border-primary/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Garage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Customize and upgrade your vehicles
              </p>
              <Button 
                onClick={() => setLocation('/garage')}
                className="cyber-button w-full"
                size="lg"
              >
                Open Garage
              </Button>
            </CardContent>
          </Card>

          <Card className="cyber-panel hover:border-primary/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure audio, graphics, and controls
              </p>
              <Button 
                onClick={openSettings}
                className="cyber-button w-full"
                size="lg"
              >
                Open Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="cyber-panel hover:border-primary/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                Shop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Purchase cars, upgrades, and cosmetics
              </p>
              <Button 
                onClick={() => setLocation('/shop')}
                className="cyber-button w-full"
                size="lg"
              >
                Browse Shop
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Use WASD or Arrow Keys to drive • Press C to change camera • Space for handbrake
          </p>
        </div>
      </div>
    </div>
  );
}
