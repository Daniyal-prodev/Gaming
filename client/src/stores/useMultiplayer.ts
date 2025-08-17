import { create } from 'zustand';
import { MultiplayerRoom, Player } from '../types';

interface MultiplayerStore {
  connected: boolean;
  currentRoom: MultiplayerRoom | null;
  players: Player[];
  ws: WebSocket | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  
  connect: () => void;
  disconnect: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  createRoom: (name: string, trackId: string, maxPlayers: number) => void;
  sendPlayerUpdate: (position: [number, number, number], rotation: [number, number, number], speed: number) => void;
  sendChatMessage: (message: string) => void;
}

export const useMultiplayer = create<MultiplayerStore>((set, get) => ({
  connected: false,
  currentRoom: null,
  players: [],
  ws: null,
  connectionStatus: 'disconnected',
  
  connect: () => {
    const { ws, connectionStatus } = get();
    
    if (ws && connectionStatus === 'connected') return;
    
    set({ connectionStatus: 'connecting' });
    
    try {
      const websocket = new WebSocket('ws://localhost:3000');
      
      websocket.onopen = () => {
        set({ 
          ws: websocket, 
          connected: true, 
          connectionStatus: 'connected' 
        });
        console.log('Connected to multiplayer server');
      };
      
      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          switch (message.type) {
            case 'room_joined':
              set({ 
                currentRoom: message.room,
                players: message.room.currentPlayers 
              });
              break;
              
            case 'player_joined':
              set((state) => ({
                players: [...state.players, message.player]
              }));
              break;
              
            case 'player_left':
              set((state) => ({
                players: state.players.filter(p => p.id !== message.playerId)
              }));
              break;
              
            case 'player_position':
              set((state) => ({
                players: state.players.map(p => 
                  p.id === message.playerId 
                    ? { ...p, position: message.position, rotation: message.rotation, speed: message.speed }
                    : p
                )
              }));
              break;
              
            case 'chat_message':
              console.log(`${message.playerId}: ${message.message}`);
              break;
              
            case 'room_created':
              set({ currentRoom: message.room });
              break;
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      websocket.onclose = () => {
        set({ 
          ws: null, 
          connected: false, 
          connectionStatus: 'disconnected',
          currentRoom: null,
          players: []
        });
        console.log('Disconnected from multiplayer server');
      };
      
      websocket.onerror = (error) => {
        set({ connectionStatus: 'error' });
        console.error('WebSocket error:', error);
      };
      
    } catch (error) {
      set({ connectionStatus: 'error' });
      console.error('Failed to connect to multiplayer server:', error);
    }
  },
  
  disconnect: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
    }
    set({ 
      ws: null, 
      connected: false, 
      connectionStatus: 'disconnected',
      currentRoom: null,
      players: []
    });
  },
  
  joinRoom: (roomId: string) => {
    const { ws, connected } = get();
    if (ws && connected) {
      ws.send(JSON.stringify({
        type: 'join_room',
        roomId
      }));
    }
  },
  
  leaveRoom: () => {
    const { ws, connected, currentRoom } = get();
    if (ws && connected && currentRoom) {
      ws.send(JSON.stringify({
        type: 'leave_room',
        roomId: currentRoom.id
      }));
      set({ currentRoom: null, players: [] });
    }
  },
  
  createRoom: (name: string, trackId: string, maxPlayers: number) => {
    const { ws, connected } = get();
    if (ws && connected) {
      ws.send(JSON.stringify({
        type: 'create_room',
        name,
        trackId,
        maxPlayers
      }));
    }
  },
  
  sendPlayerUpdate: (position: [number, number, number], rotation: [number, number, number], speed: number) => {
    const { ws, connected, currentRoom } = get();
    if (ws && connected && currentRoom) {
      ws.send(JSON.stringify({
        type: 'player_update',
        data: {
          position,
          rotation,
          speed,
          timestamp: Date.now()
        }
      }));
    }
  },
  
  sendChatMessage: (message: string) => {
    const { ws, connected } = get();
    if (ws && connected) {
      ws.send(JSON.stringify({
        type: 'chat_message',
        text: message
      }));
    }
  }
}));
