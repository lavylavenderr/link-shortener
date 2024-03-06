import { prisma } from "@/lib/db";
import { serialize } from "cookie";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password)
      return NextResponse.json(
        { message: "Missing data", success: false },
        { status: 400 }
      );

    const userData = await prisma.user.findUnique({
      where: { username },
    });

    if (!userData)
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 400 }
      );

    const doesPassMatch = await bcrypt.compare(password, userData.password);

    if (!doesPassMatch)
      return NextResponse.json(
        { message: "Invaid password", success: false },
        { status: 401 }
      );

    // Create cookie
    const sessionKey = nanoid(32);
    const cookie = serialize("foxauth", sessionKey, {
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      path: "/"
    });

    await prisma.session.create({
      data: { key: sessionKey, userId: userData.id },
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
