import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function formatSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

export function formatRPM(rpm: number): string {
  return `${Math.round(rpm)} RPM`;
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
