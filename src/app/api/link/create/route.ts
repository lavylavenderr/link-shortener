import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { originalLink, newLink } = await request.json();

    if (!originalLink || !newLink)
      return NextResponse.json(
        { message: "Missing data", success: false },
        { status: 400 }
      );

    
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Unknown error has occured", success: false },
      { status: 200 }
    );
  }
}
