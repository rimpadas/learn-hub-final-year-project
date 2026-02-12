import { NextResponse } from 'next/server'

// POST /api/auth/signup
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // In production: hash password and save to MongoDB
    // const hashedPassword = await bcrypt.hash(password, 12)
    // await db.collection('users').insertOne({ name, email, hashedPassword, role })

    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      role: role || 'student',
      enrolledCourses: [],
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      { user: newUser, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
