import { NextResponse } from 'next/server'
import { enrollments } from '@/lib/data'

// GET /api/enrollments?userId=xxx - Get enrollments for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const userEnrollments = enrollments.filter((e) => e.userId === userId)

  return NextResponse.json({ enrollments: userEnrollments })
}

// POST /api/enrollments - Enroll in a course
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { courseId, userId } = body

    if (!courseId || !userId) {
      return NextResponse.json(
        { error: 'courseId and userId are required' },
        { status: 400 }
      )
    }

    const existing = enrollments.find(
      (e) => e.courseId === courseId && e.userId === userId
    )

    if (existing) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 409 }
      )
    }

    // In production, save to MongoDB
    const newEnrollment = {
      courseId,
      userId,
      progress: 0,
      enrolledAt: new Date().toISOString(),
      completedLessons: [],
    }

    return NextResponse.json(
      { enrollment: newEnrollment, message: 'Enrolled successfully' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
