import { NextResponse } from 'next/server'
import { courses } from '@/lib/data'

// GET /api/courses - List all courses
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const search = searchParams.get('search')

  let result = [...courses]

  if (category && category !== 'All') {
    result = result.filter((c) => c.category === category)
  }

  if (level && level !== 'All') {
    result = result.filter((c) => c.level === level)
  }

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
    )
  }

  return NextResponse.json({ courses: result, total: result.length })
}

// POST /api/courses - Create a new course
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, instructor, category, level, duration, lessons, price } = body

    if (!title || !instructor || !duration) {
      return NextResponse.json(
        { error: 'Title, instructor, and duration are required' },
        { status: 400 }
      )
    }

    const newCourse = {
      id: `c${Date.now()}`,
      title,
      description: description || '',
      instructor,
      category: category || 'Web Development',
      level: level || 'Beginner',
      duration,
      lessons: lessons || 0,
      students: 0,
      rating: 0,
      image: '/placeholder-course.jpg',
      price: price || 0,
      syllabus: [],
      createdAt: new Date().toISOString().split('T')[0],
    }

    // In production, this would save to MongoDB
    return NextResponse.json({ course: newCourse, message: 'Course created successfully' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
