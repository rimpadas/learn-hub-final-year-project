import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from '@/models/User';
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return NextResponse.json({ message: "User created", user });
  } catch (error) {
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}