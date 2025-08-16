# GameHub - Production-Level Gaming Platform

## Overview

This is a comprehensive gaming platform featuring multiple racing games, user authentication, purchasing system, multiplayer functionality, garage management, and coin-based economy. The platform includes 3D racing games with high-quality graphics, animations, team modes, solo campaigns, real-time chat, and a complete garage system for vehicle customization and repairs. Built with React Three Fiber for advanced 3D graphics, Express.js backend with real-time WebSocket support, PostgreSQL database, and comprehensive user management systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the main UI framework
- **React Three Fiber** (@react-three/fiber) for 3D graphics rendering
- **React Three Drei** (@react-three/drei) for additional 3D utilities and helpers
- **Zustand** for state management with subscribeWithSelector middleware
- **Vite** as the build tool and development server
- **Tailwind CSS** with shadcn/ui components for styling
- **Canvas-based rendering** with WebGL for 3D graphics

### Game Engine Components
- **Physics System**: Custom car physics implementation with acceleration, deceleration, steering, and collision detection
- **Camera System**: Dynamic camera that follows the car with smooth interpolation
- **Audio System**: Sound effects for engine, collision, and lap completion with mute/unmute functionality
- **Input System**: Keyboard controls using React Three Drei's KeyboardControls
- **Game State Management**: Three main states (ready, racing, finished) with lap timing and checkpoint tracking

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** structure with `/api` prefix for all routes
- **Memory-based storage** implementation with interface for easy database switching
- **Middleware**: JSON parsing, URL encoding, request logging, and error handling
- **Development hot reloading** with Vite integration

### State Management
- **Zustand stores** for different concerns:
  - `useRacing`: Car physics, lap timing, checkpoints, game state
  - `useAudio`: Sound management and mute controls
  - `useGame`: Overall game phase management
- **Separation of concerns** between game logic, audio, and UI state

### Database Schema
- **Drizzle ORM** with PostgreSQL dialect
- **User authentication** schema with username/password fields
- **Migration system** for database versioning
- **Environment-based configuration** for database connections

### UI/UX Architecture
- **Component-based architecture** with reusable UI components from shadcn/ui
- **Responsive design** with mobile-first approach
- **Game HUD overlay** showing lap times, speed, and controls
- **3D scene composition** with proper lighting, shadows, and materials

### Asset Management
- **Texture loading** for track surfaces (asphalt, grass)
- **Font management** with Inter font family
- **Audio file support** for background music and sound effects
- **3D model support** for GLTF/GLB files

### Performance Optimizations
- **Frame-based updates** using useFrame hook for smooth 60fps gameplay
- **Efficient state updates** with Zustand's selective subscriptions
- **Texture optimization** with proper wrapping and repeat settings
- **Memory management** for audio resources

## External Dependencies

### Core Frameworks
- **React Three Fiber**: 3D rendering engine built on Three.js
- **Three.js**: Low-level 3D graphics library (peer dependency)
- **Express.js**: Node.js web framework for the backend API

### Database & ORM
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **Drizzle Kit**: Migration and schema management tools

### State Management & Data Fetching
- **Zustand**: Lightweight state management library
- **TanStack Query**: Server state management and caching

### UI Components & Styling
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer

### Audio & Assets
- **Web Audio API**: Native browser audio handling
- **Font Source**: Inter font family loading
- **GLSL shader support**: For advanced 3D effects

### Build & Deployment
- **Node.js**: Runtime environment
- **npm/package.json**: Dependency management
- **Environment variables**: Configuration for database and API keys