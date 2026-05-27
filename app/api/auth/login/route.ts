import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // remove password before returning
    const returned = user.toObject ? user.toObject() : JSON.parse(JSON.stringify(user));
    delete returned.password;

    return NextResponse.json({ message: "Login successful", token, user: returned });
  } catch (error) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}