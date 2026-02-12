import { NextResponse } from 'next/server'
import { users } from '@/lib/data'

// POST /api/auth/login
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = users.find((u) => u.email === email)

    if (!user) {
      // For demo, create a new user session
      return NextResponse.json({
        user: {
          id: `u${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: 'student',
          enrolledCourses: [],
          createdAt: new Date().toISOString(),
        },
        message: 'Login successful',
      })
    }

    // In production: validate password with bcrypt
    // const isValid = await bcrypt.compare(password, user.hashedPassword)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrolledCourses: user.enrolledCourses,
      },
      message: 'Login successful',
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
