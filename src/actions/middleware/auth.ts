import { validateRequest } from "@/lib/auth";

export async function checkAuth() {
  const { user } = await validateRequest();
  return user
}