import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses float strings and returns them with different fixed decimal places based on their value
 * and how many decimal places they have.
 *
 * @param floatStr Float string
 * @returns float string with fixed decimal places
 */
export function formatFloat(floatStr: string) {
  const decimalPlaces = `${floatStr}`.split(".")[1]?.length || 0;

  const num = parseFloat(floatStr);

  if (num > 1000) {
    if (!decimalPlaces) return num.toFixed(2);

    return num.toFixed(decimalPlaces > 2 ? 2 : decimalPlaces);
  }

  if (num < 100 && num > 1) {
    if (!decimalPlaces) return num.toFixed(4);

    return num.toFixed(decimalPlaces > 4 ? 4 : decimalPlaces);
  }

  if (num < 1) {
    if (!decimalPlaces) return num.toFixed(6);

    return num.toFixed(decimalPlaces > 6 ? 6 : decimalPlaces);
  }

  return num.toFixed(decimalPlaces > 4 ? 4 : decimalPlaces);
}
