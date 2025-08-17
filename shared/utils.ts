export function formatTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function calculateLapTime(startTime: number, endTime: number): number {
  return endTime - startTime;
}

export function calculateSpeed(velocity: [number, number, number]): number {
  const [x, y, z] = velocity;
  return Math.sqrt(x * x + y * y + z * z) * 3.6;
}

export function interpolatePosition(
  start: [number, number, number],
  end: [number, number, number],
  factor: number
): [number, number, number] {
  return [
    start[0] + (end[0] - start[0]) * factor,
    start[1] + (end[1] - start[1]) * factor,
    start[2] + (end[2] - start[2]) * factor,
  ];
}

export function distanceBetweenPoints(
  point1: [number, number, number],
  point2: [number, number, number]
): number {
  const [x1, y1, z1] = point1;
  const [x2, y2, z2] = point2;
  
  return Math.sqrt(
    Math.pow(x2 - x1, 2) + 
    Math.pow(y2 - y1, 2) + 
    Math.pow(z2 - z1, 2)
  );
}

export function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

export function generateCheckpoints(radius: number, count: number): Array<{
  position: [number, number, number];
  rotation: [number, number, number];
  order: number;
  isFinishLine?: boolean;
}> {
  const checkpoints: Array<{
    position: [number, number, number];
    rotation: [number, number, number];
    order: number;
    isFinishLine?: boolean;
  }> = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    checkpoints.push({
      position: [x, 1, z] as [number, number, number],
      rotation: [0, angle + Math.PI / 2, 0] as [number, number, number],
      order: i,
      isFinishLine: i === count - 1,
    });
  }
  
  return checkpoints;
}

export function calculateRacePosition(
  playerLap: number,
  playerCheckpoint: number,
  otherPlayers: Array<{ lap: number; checkpoint: number }>
): number {
  let position = 1;
  
  for (const other of otherPlayers) {
    if (other.lap > playerLap || 
        (other.lap === playerLap && other.checkpoint > playerCheckpoint)) {
      position++;
    }
  }
  
  return position;
}

export function validateCarPhysics(car: {
  speed: number;
  acceleration: number;
  handling: number;
  braking: number;
}): boolean {
  return (
    car.speed >= 0 && car.speed <= 100 &&
    car.acceleration >= 0 && car.acceleration <= 100 &&
    car.handling >= 0 && car.handling <= 100 &&
    car.braking >= 0 && car.braking <= 100
  );
}

export function calculateCoinsEarned(
  raceTime: number,
  position: number,
  difficulty: string
): number {
  const baseCoins = 100;
  const timeBonus = Math.max(0, 1000 - raceTime / 1000);
  const positionMultiplier = Math.max(0.5, 2 - (position - 1) * 0.3);
  const difficultyMultiplier = {
    easy: 1,
    normal: 1.2,
    hard: 1.5,
    simulation: 2
  }[difficulty] || 1;
  
  return Math.floor(
    (baseCoins + timeBonus) * positionMultiplier * difficultyMultiplier
  );
}

export function calculateExperienceEarned(
  raceTime: number,
  position: number,
  lapsCompleted: number
): number {
  const baseXP = 50;
  const lapBonus = lapsCompleted * 25;
  const positionBonus = Math.max(0, 100 - (position - 1) * 20);
  const timeBonus = Math.max(0, 200 - raceTime / 1000);
  
  return Math.floor(baseXP + lapBonus + positionBonus + timeBonus);
}
