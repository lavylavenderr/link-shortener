import { discord } from "@/lib/discord";
import { generateState } from "arctic";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  const state = generateState();
  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify", "email"],
  });

  return Response.redirect(url);
}