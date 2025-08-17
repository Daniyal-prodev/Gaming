import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Gauge, Timer, Trophy, Pause, Home } from 'lucide-react';
import { useLocation } from 'wouter';
import { useRacing } from '../../stores/useRacing';
import { useGame } from '../../stores/useGame';
import { useSettings } from '../../stores/useSettings';

export default function GameHUD() {
  const [, setLocation] = useLocation();
  const { speed, rpm, gear, fuel, lapTimes, currentLapTime, bestLapTime } = useRacing();
  const { currentLap, totalLaps, position } = useGame();
  const { gameplay } = useSettings();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const goHome = () => {
    setLocation('/');
  };

  return (
    <div className="game-hud">
      <div className="absolute top-4 left-4 space-y-4">
        {gameplay.hud.speedometer && (
          <Card className="hud-element p-4 min-w-[200px]">
            <div className="flex items-center gap-3">
              <Gauge className="w-6 h-6 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(speed)} <span className="text-sm">km/h</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  RPM: {Math.round(rpm)} | Gear: {gear}
                </div>
              </div>
            </div>
          </Card>
        )}

        {gameplay.hud.lapTimes && (
          <Card className="hud-element p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Lap Times</span>
              </div>
              <div className="lap-timer text-lg font-mono text-foreground">
                Current: {formatTime(currentLapTime)}
              </div>
              {bestLapTime && (
                <div className="text-sm text-primary">
                  Best: {formatTime(bestLapTime)}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      <div className="absolute top-4 right-4 space-y-4">
        {gameplay.hud.position && (
          <Card className="hud-element p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-primary" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {position}
                  <span className="text-sm">
                    {position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Position</div>
              </div>
            </div>
          </Card>
        )}

        <Card className="hud-element p-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              Lap {currentLap} / {totalLaps}
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentLap / totalLaps) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute bottom-4 left-4">
        <Card className="hud-element p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-foreground">Fuel: {Math.round(fuel)}%</span>
          </div>
        </Card>
      </div>

      <div className="absolute bottom-4 right-4 space-x-2">
        <Button 
          onClick={goHome}
          variant="outline" 
          size="sm"
          className="cyber-button"
        >
          <Home className="w-4 h-4 mr-2" />
          Menu
        </Button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Card className="hud-element p-2">
          <div className="text-xs text-muted-foreground text-center">
            ESC: Menu | C: Camera | WASD/Arrows: Drive | Space: Brake
          </div>
        </Card>
      </div>

      {lapTimes.length > 0 && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <Card className="hud-element p-3 max-h-64 overflow-y-auto">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-foreground mb-2">Recent Laps</div>
              {lapTimes.slice(-5).map((lap, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  Lap {lap.lapNumber}: {formatTime(lap.time)}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
