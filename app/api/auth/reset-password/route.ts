import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: 'Token and newPassword are required' }, { status: 400 })
    }

    // Server-side password validation
    const lengthOk = newPassword.length >= 8
    const upperOk = /[A-Z]/.test(newPassword)
    const lowerOk = /[a-z]/.test(newPassword)
    const numberOk = /[0-9]/.test(newPassword)
    if (!(lengthOk && upperOk && lowerOk && numberOk)) {
      return NextResponse.json({ message: 'Password does not meet security requirements' }, { status: 400 })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 })
    }

    let payload: any
    try {
      payload = jwt.verify(token, secret) as { userId: string; iat?: number; exp?: number }
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })
    }

    await connectDB();

    const user = await User.findById(payload.userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    // Clear any legacy reset fields
    user.resetToken = undefined as any
    user.resetTokenExpiry = undefined as any
    await user.save()

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (error) {
    return NextResponse.json({ message: "Reset failed" }, { status: 500 });
  }
}