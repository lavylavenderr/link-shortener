import { discord } from "@/lib/discord";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import axios from "axios";
import { DiscordUser } from "@/lib/types";
import { prisma } from "@/lib/db";
import { lucia } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("discord_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(JSON.stringify({
      message: "Invalid Request",
      success: false
    }), {
      status: 400,
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const { data: userData } = await axios.get<DiscordUser>(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    const userObj = await prisma.user.findUnique({
      where: { discordId: userData.id },
    });

    if (userObj) {
      const session = await lucia.createSession(userObj.id, {
        ipAddress:
          headers().get("x-forwarded-for")?.split(",")[0] ||
          headers().get("x-real-ip") ||
          "0.0.0.0",
        userAgent: headers().get("User-Agent") ?? "None found",
      });
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      await prisma.user.update({
        where: { discordId: userData.id },
        data: { discordUsername: userData.username },
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin",
        },
      });
    } else {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/login",
        },
      });
    }
  } catch (error) {
    console.log(error);

    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }

    return new Response(null, {
      status: 500,
    });
  }
}
