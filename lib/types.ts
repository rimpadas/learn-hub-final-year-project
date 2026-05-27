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
  // optional URL for video lessons
  videoUrl?: string
  // optional URL for reading lessons
  readingUrl?: string
  // optional quiz payload for quiz lessons
  quiz?: {
    questions: Array<{
      id: string
      text: string
      options: string[]
      answer: number
    }>
  }
}

export interface Enrollment {
  courseId: string
  userId: string
  progress: number
  enrolledAt: string
  completedLessons: string[]
}
