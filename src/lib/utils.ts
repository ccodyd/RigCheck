import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmt = (n: number | null | undefined) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n);

export const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(n);
export const fmtRange = (lo: number, hi: number) => `${fmt(lo)}–${fmt(hi)}`;
