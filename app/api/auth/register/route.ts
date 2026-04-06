import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are Required" },
        { status: 401 },
      );
    }

    await connectDB();

    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
      return NextResponse.json(
        { error: "User ALready Exits" },
        { status: 400 },
      );
    }

    await User.create({
      email,
      password,
    });

    return NextResponse.json(
      { message: "User registered Successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration Error", error);
    return NextResponse.json(
      { error: "User registeration failed" },
      { status: 501 },
    );
  }
}
