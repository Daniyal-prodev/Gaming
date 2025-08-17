import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'racing-game-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = { id: '1', username, email: `${username}@example.com` };
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = { id, username: 'player', email: 'player@example.com' };
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
  res.json({ success: true, user: req.user });
});

app.post('/api/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

app.get('/api/auth/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { items } = req.body;

    const totalAmount = items.reduce((sum: number, item: any) =>
      sum + (item.price * item.quantity), 0
    );

    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount: totalAmount,
      currency: 'usd',
      status: 'succeeded',
      items
    };

    res.json(paymentIntent);
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

app.get('/api/leaderboard/:trackId', (req, res) => {
  const mockLeaderboard = [
    { username: 'SpeedDemon', time: 125430, car: 'Cyber Racer' },
    { username: 'RaceKing', time: 127890, car: 'Neon Bolt' },
    { username: 'TurboMax', time: 129340, car: 'Lightning Strike' },
  ];

  res.json(mockLeaderboard);
});

app.post('/api/race/result', (req, res) => {
  try {
    const { trackId, carId, totalTime, lapTimes } = req.body;

    const coinsEarned = Math.floor(100 + (1000 / (totalTime / 1000)));
    const experienceEarned = Math.floor(50 + (500 / (totalTime / 1000)));

    res.json({
      success: true,
      coinsEarned,
      experienceEarned,
      position: Math.floor(Math.random() * 5) + 1
    });
  } catch (error) {
    console.error('Race result error:', error);
    res.status(500).json({ error: 'Failed to save race result' });
  }
});

app.get('/api/cars', (req, res) => {
  const cars = [
    {
      id: 'cyber-racer',
      name: 'Cyber Racer',
      model: 'CR-2077',
      color: '#00ffff',
      speed: 95,
      acceleration: 88,
      handling: 92,
      braking: 85,
      price: 50000,
      owned: true
    },
    {
      id: 'neon-bolt',
      name: 'Neon Bolt',
      model: 'NB-X1',
      color: '#ff00ff',
      speed: 92,
      acceleration: 95,
      handling: 88,
      braking: 90,
      price: 75000,
      owned: false
    }
  ];

  res.json(cars);
});

app.get('/api/tracks', (req, res) => {
  const tracks = [
    {
      id: 'cyber-circuit',
      name: 'Cyber Circuit',
      difficulty: 'medium',
      length: 2.5,
      weather: { type: 'clear', intensity: 0 },
      timeOfDay: 'night'
    },
    {
      id: 'neon-speedway',
      name: 'Neon Speedway',
      difficulty: 'hard',
      length: 3.2,
      weather: { type: 'rain', intensity: 0.3 },
      timeOfDay: 'dusk'
    }
  ];

  res.json(tracks);
});

const connectedClients = new Map();

wss.on('connection', (ws) => {
  const clientId = Date.now().toString();
  connectedClients.set(clientId, ws);

  console.log(`Client ${clientId} connected`);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'join_room':
          ws.send(JSON.stringify({
            type: 'room_joined',
            roomId: message.roomId,
            players: []
          }));
          break;

        case 'player_update':
          connectedClients.forEach((client, id) => {
            if (id !== clientId && client.readyState === ws.OPEN) {
              client.send(JSON.stringify({
                type: 'player_position',
                playerId: clientId,
                ...message.data
              }));
            }
          });
          break;

        case 'chat_message':
          connectedClients.forEach((client, id) => {
            if (client.readyState === ws.OPEN) {
              client.send(JSON.stringify({
                type: 'chat_message',
                playerId: id === clientId ? 'You' : clientId,
                message: message.text,
                timestamp: Date.now()
              }));
            }
          });
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    connectedClients.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/public')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  });
file link from which i can install the app} else {
  app.use(express.static(path.join(__dirname, '../client')));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'API endpoint not found' });
    } else {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    }
  });
}

server.listen(PORT, () => {
  console.log(`🏁 Racing game server running on port ${PORT}`);
  console.log(`🎮 Game available at http://localhost:${PORT}`);
});
