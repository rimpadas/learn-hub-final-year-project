import { NextResponse } from 'next/server'
import { courses } from '@/lib/data'

// GET /api/courses/:id - Get a single course
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const course = courses.find((c) => c.id === id)

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  return NextResponse.json({ course })
}

// PUT /api/courses/:id - Update a course
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const course = courses.find((c) => c.id === id)

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const updatedCourse = { ...course, ...body }

    // In production, this would update in MongoDB
    return NextResponse.json({ course: updatedCourse, message: 'Course updated successfully' })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE /api/courses/:id - Delete a course
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const course = courses.find((c) => c.id === id)

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  // In production, this would delete from MongoDB
  return NextResponse.json({ message: 'Course deleted successfully' })
}
