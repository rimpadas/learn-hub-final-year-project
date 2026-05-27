import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// simple in-memory rate limiter (per IP) — fine for demo/single-instance
const rateMap = new Map<string, { count: number; firstRequestAt: number }>()
const RATE_LIMIT_MAX = 5 // max requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Rate limiting by IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const entry = rateMap.get(ip) || { count: 0, firstRequestAt: Date.now() }
    if (Date.now() - entry.firstRequestAt > RATE_LIMIT_WINDOW) {
      entry.count = 0
      entry.firstRequestAt = Date.now()
    }
    entry.count += 1
    rateMap.set(ip, entry)
    if (entry.count > RATE_LIMIT_MAX) {
      return NextResponse.json({ message: 'Too many requests, try again later' }, { status: 429 })
    }

    // Create a short-lived JWT token (15 minutes)
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 })
    }
    const token = jwt.sign({ userId: user._id.toString() }, secret, { expiresIn: '15m' })
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`

    // Return reset link for demo/testing (no email sending)
    return NextResponse.json({ message: 'Reset link generated', resetLink });

  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}