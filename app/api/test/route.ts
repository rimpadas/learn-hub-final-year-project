import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      message: "MongoDB Connected",
      state: mongoose.connection.readyState,
    });
  } catch (error) {
    return NextResponse.json({
      message: "MongoDB Failed",
      error: String(error),
    });
  }
}