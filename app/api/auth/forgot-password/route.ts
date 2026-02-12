import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // In production: look up user by email, generate a secure token,
    // store the token with expiry in the database, and send an email
    // with a reset link containing the token.

    // Demo: always succeed
    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      // In production, never reveal whether the email exists
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
