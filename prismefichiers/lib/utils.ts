import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...entrees: ClassValue[]) {
  return twMerge(clsx(entrees));
}

export function minutes(secondes: number): string {
  const m = Math.round(secondes / 60);
  return m < 1 ? 'moins d’1 min' : `${m} min`;
}
