import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Users, Wifi, WifiOff, Plus, Play, ArrowLeft } from 'lucide-react';
import { useMultiplayer } from '../../stores/useMultiplayer';
import { useGame } from '../../stores/useGame';

export default function MultiplayerLobby() {
  const [, setLocation] = useLocation();
  const { setPhase } = useGame();
  const { 
    connected, 
    connectionStatus, 
    currentRoom, 
    players, 
    connect, 
    disconnect, 
    joinRoom, 
    createRoom, 
    leaveRoom 
  } = useMultiplayer();
  
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [joinRoomId, setJoinRoomId] = useState('');

  useEffect(() => {
    if (!connected && connectionStatus === 'disconnected') {
      connect();
    }
    
    return () => {
      if (connected) {
        disconnect();
      }
    };
  }, []);

  const handleCreateRoom = () => {
    if (roomName.trim() && connected) {
      createRoom(roomName, 'cyber-circuit', maxPlayers);
    }
  };

  const handleJoinRoom = () => {
    if (joinRoomId.trim() && connected) {
      joinRoom(joinRoomId);
    }
  };

  const handleStartRace = () => {
    if (currentRoom) {
      setPhase('loading');
      setLocation('/game');
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
  };

  const goBack = () => {
    if (currentRoom) {
      leaveRoom();
    }
    setLocation('/');
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
            Multiplayer Racing
          </h1>
          
          <div className="flex items-center gap-2 ml-auto">
            {connected ? (
              <Badge variant="default" className="bg-green-600">
                <Wifi className="w-4 h-4 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="w-4 h-4 mr-1" />
                {connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </Badge>
            )}
          </div>
        </div>

        {!currentRoom ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cyber-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Create Room
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxPlayers">Max Players</Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    min="2"
                    max="8"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  onClick={handleCreateRoom}
                  disabled={!connected || !roomName.trim()}
                  className="cyber-button w-full"
                  size="lg"
                >
                  Create Room
                </Button>
              </CardContent>
            </Card>

            <Card className="cyber-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Join Room
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="joinRoomId">Room ID</Label>
                  <Input
                    id="joinRoomId"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    placeholder="Enter room ID"
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  onClick={handleJoinRoom}
                  disabled={!connected || !joinRoomId.trim()}
                  className="cyber-button w-full"
                  size="lg"
                >
                  Join Room
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="cyber-panel">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {currentRoom.name}
                  </span>
                  <Badge variant="secondary">
                    {players.length}/{currentRoom.maxPlayers} Players
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {Array.from({ length: currentRoom.maxPlayers }, (_, i) => {
                    const player = players[i];
                    return (
                      <Card key={i} className="cyber-panel">
                        <CardContent className="p-4 text-center">
                          {player ? (
                            <>
                              <div className="text-lg font-semibold text-primary">
                                {player.username}
                              </div>
                              <Badge 
                                variant={player.ready ? "default" : "secondary"}
                                className="mt-2"
                              >
                                {player.ready ? "Ready" : "Not Ready"}
                              </Badge>
                            </>
                          ) : (
                            <div className="text-muted-foreground">
                              Waiting for player...
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleStartRace}
                    disabled={players.length < 2}
                    className="cyber-button flex-1"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Race
                  </Button>
                  
                  <Button 
                    onClick={handleLeaveRoom}
                    variant="outline"
                    className="cyber-button"
                    size="lg"
                  >
                    Leave Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
