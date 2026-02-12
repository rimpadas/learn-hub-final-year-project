'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Course } from './types'
import { courses as initialCourses } from './data'

interface CourseContextType {
  courses: Course[]
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'students' | 'rating'>) => void
  updateCourse: (id: string, data: Partial<Course>) => void
  deleteCourse: (id: string) => void
  getCourse: (id: string) => Course | undefined
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)

  const addCourse = useCallback(
    (course: Omit<Course, 'id' | 'createdAt' | 'students' | 'rating'>) => {
      const newCourse: Course = {
        ...course,
        id: `c${Date.now()}`,
        students: 0,
        rating: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setCourses((prev) => [...prev, newCourse])
    },
    []
  )

  const updateCourse = useCallback((id: string, data: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  }, [])

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const getCourse = useCallback(
    (id: string) => {
      return courses.find((c) => c.id === id)
    },
    [courses]
  )

  return (
    <CourseContext.Provider value={{ courses, addCourse, updateCourse, deleteCourse, getCourse }}>
      {children}
    </CourseContext.Provider>
  )
}

export function useCourses() {
  const context = useContext(CourseContext)
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider')
  }
  return context
}
