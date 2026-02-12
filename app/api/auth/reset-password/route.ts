import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // In production: validate the token against the database,
    // check if it hasn't expired, hash the new password with bcrypt,
    // update the user's password, and invalidate the token.

    // Demo: always succeed
    return NextResponse.json({
      message: 'Password has been reset successfully.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
