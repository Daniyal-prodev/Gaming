import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import MainMenu from './components/UI/MainMenu';
import GameCanvas from './components/Game/GameCanvas';
import SettingsPanel from './components/UI/SettingsPanel';
import MultiplayerLobby from './components/UI/MultiplayerLobby';
import CareerMode from './components/UI/CareerMode';
import Garage from './components/UI/Garage';
import Shop from './components/UI/Shop';
import { useGame } from './stores/useGame';
import { useAuth } from './stores/useAuth';

const queryClient = new QueryClient();

function App() {
  const { phase } = useGame();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full bg-background text-foreground">
        <Router>
          <Switch>
            <Route path="/game">
              <GameCanvas />
            </Route>
            <Route path="/settings">
              <SettingsPanel />
            </Route>
            <Route path="/multiplayer">
              <MultiplayerLobby />
            </Route>
            <Route path="/career">
              <CareerMode />
            </Route>
            <Route path="/garage">
              <Garage />
            </Route>
            <Route path="/shop">
              <Shop />
            </Route>
            <Route>
              <MainMenu />
            </Route>
          </Switch>
        </Router>
        <Toaster 
          theme="dark" 
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;
