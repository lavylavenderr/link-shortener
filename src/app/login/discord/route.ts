import { discord } from "@/lib/discord";
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  const state = generateState();
  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify", "email"],
  });

  cookies().set("discord_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}