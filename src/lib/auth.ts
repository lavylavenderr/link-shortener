import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "./db";
import { Lucia, Session, TimeSpan, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";

const adapter = new PrismaAdapter(prisma.session, prisma.user);
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "OwOWhatsThis",
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  sessionExpiresIn: new TimeSpan(1, "d"),
  getSessionAttributes: (attributes) => {
    return {
      ipAddress: attributes.ipAddress,
      userAgent: attributes.userAgent,
    };
  },
  getUserAttributes: (attributes) => {
    return {
      discordUsername: attributes.discordUsername,
      discordId: attributes.discordId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }

  interface DatabaseSessionAttributes {
    ipAddress: string;
    userAgent: string;
  }

  interface DatabaseUserAttributes {
    discordUsername: string;
    discordId: string;
  }
}

export const uncachedValidateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId)
    return {
      user: null,
      session: null,
    };

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch (error) {
    console.error(error);
  }

  return result;
};

export const validateRequest = cache(uncachedValidateRequest);
