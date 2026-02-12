export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'admin'
  avatar?: string
  enrolledCourses: string[]
  createdAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  lessons: number
  students: number
  rating: number
  image: string
  price: number
  syllabus: SyllabusItem[]
  createdAt: string
}

export interface SyllabusItem {
  id: string
  title: string
  duration: string
  type: 'video' | 'reading' | 'quiz'
}

export interface Enrollment {
  courseId: string
  userId: string
  progress: number
  enrolledAt: string
  completedLessons: string[]
}
