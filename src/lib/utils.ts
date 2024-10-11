import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./db";
import { headers } from "next/headers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseURL() {
  return process.env.BASE_URL
}

export function getIP() {
  const fallback = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? fallback;
  }

  return headers().get("x-real-ip") ?? fallback;
}