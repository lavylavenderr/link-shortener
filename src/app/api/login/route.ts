import { prisma } from "@/lib/db";
import { serialize } from "cookie";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data: { password: string } = await request.json();
    const password = data.password;

    if (password !== process.env.PASSWORD)
      return NextResponse.json(
        { message: "Invalid login", success: false },
        { status: 400 }
      );
    // Create cookie
    const sessionKey = nanoid(32);
    const cookie = serialize("foxauth", sessionKey);

    await prisma.session.create({
      data: { key: sessionKey },
    });

    return NextResponse.json(
      { success: true },
      { headers: { "Set-Cookie": cookie } }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Unknown error has occured", success: false },
      { status: 500 }
    );
  }
}
