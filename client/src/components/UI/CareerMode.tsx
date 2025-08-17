import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Trophy, Star, Lock, ArrowLeft, Play } from 'lucide-react';
import { useCareer } from '../../stores/useCareer';
import { useGame } from '../../stores/useGame';

export default function CareerMode() {
  const [, setLocation] = useLocation();
  const { setPhase } = useGame();
  const { 
    currentLevel, 
    experience, 
    experienceToNext, 
    championships, 
    startChampionship 
  } = useCareer();

  const goBack = () => {
    setLocation('/');
  };

  const handleStartChampionship = (championshipId: string) => {
    startChampionship(championshipId);
    setPhase('loading');
    setLocation('/game');
  };

  const getExperienceProgress = () => {
    const totalForLevel = 1000;
    const currentProgress = totalForLevel - experienceToNext;
    return (currentProgress / totalForLevel) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="absolute inset-0 bg-[url('/images/city-bg.jpg')] bg-cover bg-center opacity-20" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
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
            Career Mode
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cyber-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Driver Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary mb-2">
                  Level {currentLevel}
                </div>
                <div className="text-sm text-muted-foreground">
                  {experience.toLocaleString()} XP
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {currentLevel + 1}</span>
                  <span>{experienceToNext} XP needed</span>
                </div>
                <Progress value={getExperienceProgress()} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-panel">
            <CardHeader>
              <CardTitle>Career Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Championships Won</span>
                  <span className="font-semibold">
                    {championships.filter(c => c.completed).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Experience</span>
                  <span className="font-semibold">{experience.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Level</span>
                  <span className="font-semibold">{currentLevel}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-panel">
            <CardHeader>
              <CardTitle>Next Unlock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {currentLevel < 5 ? (
                  <>
                    <div className="text-lg font-semibold text-primary mb-2">
                      Neon Bolt Car
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unlock at Level 5
                    </div>
                  </>
                ) : currentLevel < 10 ? (
                  <>
                    <div className="text-lg font-semibold text-primary mb-2">
                      Quantum Racer
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unlock at Level 10
                    </div>
                  </>
                ) : currentLevel < 15 ? (
                  <>
                    <div className="text-lg font-semibold text-primary mb-2">
                      Hypercar X1
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unlock at Level 15
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-semibold text-primary mb-2">
                      All Unlocked!
                    </div>
                    <div className="text-sm text-muted-foreground">
                      You've unlocked everything
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Championships</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {championships.map((championship) => {
              const isLocked = currentLevel < championship.requiredLevel;
              const canStart = !isLocked && !championship.completed;
              
              return (
                <Card 
                  key={championship.id} 
                  className={`cyber-panel ${isLocked ? 'opacity-60' : ''}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {championship.completed ? (
                          <Trophy className="w-5 h-5 text-yellow-500" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Trophy className="w-5 h-5 text-primary" />
                        )}
                        {championship.name}
                      </span>
                      
                      {championship.completed ? (
                        <Badge variant="default" className="bg-yellow-600">
                          Completed
                        </Badge>
                      ) : isLocked ? (
                        <Badge variant="secondary">
                          Level {championship.requiredLevel}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Available
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {championship.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="text-sm font-medium mb-1">Tracks</div>
                        <div className="text-sm text-muted-foreground">
                          {championship.tracks.length} races
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-1">Rewards</div>
                        <div className="text-sm text-muted-foreground">
                          {championship.rewards.coins.toLocaleString()} coins, {championship.rewards.experience} XP
                        </div>
                      </div>
                    </div>
                    
                    {championship.completed && (
                      <div className="mb-4">
                        <Progress value={100} className="h-2" />
                        <div className="text-sm text-muted-foreground mt-1">
                          Championship Complete
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => handleStartChampionship(championship.id)}
                      disabled={isLocked || championship.completed}
                      className="cyber-button w-full"
                      size="lg"
                    >
                      {championship.completed ? (
                        'Completed'
                      ) : isLocked ? (
                        `Requires Level ${championship.requiredLevel}`
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Championship
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
