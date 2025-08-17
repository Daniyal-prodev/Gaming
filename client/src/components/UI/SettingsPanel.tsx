import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { ArrowLeft, Volume2, Monitor, Gamepad2, Settings as SettingsIcon } from 'lucide-react';
import { useSettings } from '../../stores/useSettings';
import { useAudio } from '../../stores/useAudio';

export default function SettingsPanel() {
  const [, setLocation] = useLocation();
  const settings = useSettings();
  const audio = useAudio();

  const goBack = () => {
    settings.saveSettings();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={goBack}
            variant="outline"
            size="sm"
            className="cyber-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold neon-text">Settings</h1>
        </div>

        <Card className="cyber-panel">
          <CardContent className="p-6">
            <Tabs defaultValue="audio" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="audio" className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Audio
                </TabsTrigger>
                <TabsTrigger value="graphics" className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Graphics
                </TabsTrigger>
                <TabsTrigger value="controls" className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Controls
                </TabsTrigger>
                <TabsTrigger value="gameplay" className="flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4" />
                  Gameplay
                </TabsTrigger>
              </TabsList>

              <TabsContent value="audio" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground font-semibold">Master Volume</Label>
                      <div className="mt-2">
                        <Slider
                          value={[settings.audio.masterVolume * 100]}
                          onValueChange={([value]) => {
                            settings.updateAudioSettings({ masterVolume: value / 100 });
                            audio.setMasterVolume(value / 100);
                          }}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <span className="text-sm text-muted-foreground">
                          {Math.round(settings.audio.masterVolume * 100)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-foreground font-semibold">Engine Volume</Label>
                      <div className="mt-2">
                        <Slider
                          value={[settings.audio.engineVolume * 100]}
                          onValueChange={([value]) => {
                            settings.updateAudioSettings({ engineVolume: value / 100 });
                            audio.setEngineVolume(value / 100);
                          }}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <span className="text-sm text-muted-foreground">
                          {Math.round(settings.audio.engineVolume * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground font-semibold">Music Volume</Label>
                      <div className="mt-2">
                        <Slider
                          value={[settings.audio.musicVolume * 100]}
                          onValueChange={([value]) => {
                            settings.updateAudioSettings({ musicVolume: value / 100 });
                            audio.setMusicVolume(value / 100);
                          }}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <span className="text-sm text-muted-foreground">
                          {Math.round(settings.audio.musicVolume * 100)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-foreground font-semibold">Effects Volume</Label>
                      <div className="mt-2">
                        <Slider
                          value={[settings.audio.effectsVolume * 100]}
                          onValueChange={([value]) => {
                            settings.updateAudioSettings({ effectsVolume: value / 100 });
                            audio.setEffectsVolume(value / 100);
                          }}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <span className="text-sm text-muted-foreground">
                          {Math.round(settings.audio.effectsVolume * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="mute-audio"
                    checked={!settings.audio.muted}
                    onCheckedChange={(checked) => {
                      settings.updateAudioSettings({ muted: !checked });
                      audio.toggleMute();
                    }}
                  />
                  <Label htmlFor="mute-audio" className="text-foreground">Enable Audio</Label>
                </div>
              </TabsContent>

              <TabsContent value="graphics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground font-semibold">Graphics Quality</Label>
                      <Select
                        value={settings.graphics.quality}
                        onValueChange={(value: any) => settings.updateGraphicsSettings({ quality: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="ultra">Ultra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="shadows"
                          checked={settings.graphics.shadows}
                          onCheckedChange={(checked) => settings.updateGraphicsSettings({ shadows: checked })}
                        />
                        <Label htmlFor="shadows" className="text-foreground">Shadows</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="reflections"
                          checked={settings.graphics.reflections}
                          onCheckedChange={(checked) => settings.updateGraphicsSettings({ reflections: checked })}
                        />
                        <Label htmlFor="reflections" className="text-foreground">Reflections</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="particles"
                          checked={settings.graphics.particles}
                          onCheckedChange={(checked) => settings.updateGraphicsSettings({ particles: checked })}
                        />
                        <Label htmlFor="particles" className="text-foreground">Particle Effects</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="antialiasing"
                          checked={settings.graphics.antiAliasing}
                          onCheckedChange={(checked) => settings.updateGraphicsSettings({ antiAliasing: checked })}
                        />
                        <Label htmlFor="antialiasing" className="text-foreground">Anti-Aliasing</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="vsync"
                          checked={settings.graphics.vsync}
                          onCheckedChange={(checked) => settings.updateGraphicsSettings({ vsync: checked })}
                        />
                        <Label htmlFor="vsync" className="text-foreground">V-Sync</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="controls" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Key Bindings</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-foreground">Accelerate</Label>
                        <Button variant="outline" size="sm" className="min-w-[100px]">
                          {settings.controls.accelerate === 'ArrowUp' ? '↑' : settings.controls.accelerate}
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Label className="text-foreground">Brake</Label>
                        <Button variant="outline" size="sm" className="min-w-[100px]">
                          {settings.controls.brake === 'ArrowDown' ? '↓' : settings.controls.brake}
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Label className="text-foreground">Steer Left</Label>
                        <Button variant="outline" size="sm" className="min-w-[100px]">
                          {settings.controls.steerLeft === 'ArrowLeft' ? '←' : settings.controls.steerLeft}
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Label className="text-foreground">Steer Right</Label>
                        <Button variant="outline" size="sm" className="min-w-[100px]">
                          {settings.controls.steerRight === 'ArrowRight' ? '→' : settings.controls.steerRight}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground font-semibold">Steering Sensitivity</Label>
                      <div className="mt-2">
                        <Slider
                          value={[settings.controls.sensitivity * 100]}
                          onValueChange={([value]) => settings.updateControlsSettings({ sensitivity: value / 100 })}
                          min={50}
                          max={200}
                          step={5}
                          className="w-full"
                        />
                        <span className="text-sm text-muted-foreground">
                          {Math.round(settings.controls.sensitivity * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-foreground">Handbrake</Label>
                        <Button variant="outline" size="sm" className="min-w-[100px]">
                          Space
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Label className="text-foreground">Camera</Label>
                        <Button variant="outline" size="sm" className="min-w-[100px]">
                          C
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gameplay" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground font-semibold">Difficulty</Label>
                      <Select
                        value={settings.gameplay.difficulty}
                        onValueChange={(value: any) => settings.updateGameplaySettings({ difficulty: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                          <SelectItem value="simulation">Simulation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground">Driving Assists</h3>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="abs"
                          checked={settings.gameplay.assists.abs}
                          onCheckedChange={(checked) => 
                            settings.updateGameplaySettings({ 
                              assists: { ...settings.gameplay.assists, abs: checked }
                            })
                          }
                        />
                        <Label htmlFor="abs" className="text-foreground">ABS (Anti-lock Braking)</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tcs"
                          checked={settings.gameplay.assists.tcs}
                          onCheckedChange={(checked) => 
                            settings.updateGameplaySettings({ 
                              assists: { ...settings.gameplay.assists, tcs: checked }
                            })
                          }
                        />
                        <Label htmlFor="tcs" className="text-foreground">TCS (Traction Control)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="steering-assist"
                          checked={settings.gameplay.assists.steeringAssist}
                          onCheckedChange={(checked) => 
                            settings.updateGameplaySettings({ 
                              assists: { ...settings.gameplay.assists, steeringAssist: checked }
                            })
                          }
                        />
                        <Label htmlFor="steering-assist" className="text-foreground">Steering Assist</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="braking-assist"
                          checked={settings.gameplay.assists.brakingAssist}
                          onCheckedChange={(checked) => 
                            settings.updateGameplaySettings({ 
                              assists: { ...settings.gameplay.assists, brakingAssist: checked }
                            })
                          }
                        />
                        <Label htmlFor="braking-assist" className="text-foreground">Braking Assist</Label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground">HUD Elements</h3>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="speedometer"
                          checked={settings.gameplay.hud.speedometer}
                          onCheckedChange={(checked) => 
                            settings.updateGameplaySettings({ 
                              hud: { ...settings.gameplay.hud, speedometer: checked }
                            })
                          }
                        />
                        <Label htmlFor="speedometer" className="text-foreground">Speedometer</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="lap-times"
                          checked={settings.gameplay.hud.lapTimes}
                          onCheckedChange={(checked) => 
                            settings.updateGameplaySettings({ 
                              hud: { ...settings.gameplay.hud, lapTimes: checked }
                            })
                          }
                        />
                        <Label htmlFor="lap-times" className="text-foreground">Lap Times</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button 
                onClick={settings.resetToDefaults}
                variant="outline"
                className="cyber-button"
              >
                Reset to Defaults
              </Button>
              <Button 
                onClick={goBack}
                className="cyber-button"
              >
                Save & Exit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
