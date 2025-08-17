import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import MainMenu from './components/UI/MainMenu';
import GameCanvas from './components/Game/GameCanvas';
import SettingsPanel from './components/UI/SettingsPanel';
import { useGame } from './stores/useGame';

const queryClient = new QueryClient();

function App() {
  const { gamePhase } = useGame();

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
