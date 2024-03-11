import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("foxauth");

    if (!authCookie) return NextResponse.redirect(new URL("/", request.url));

    await prisma.session.delete({
      where: { key: authCookie.value },
    });

    return NextResponse.redirect(new URL("/admin/login", request.url));
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error occured whilst logging out", success: false },
      { status: 500 }
    );
  }
}
