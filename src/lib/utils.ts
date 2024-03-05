import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function isLoggedIn(cookie: string | undefined) {
  const session = await prisma.session.findUnique({
    where: { key: cookie ?? "" },
  });

  if (!session) return false;
  else return true;
}
