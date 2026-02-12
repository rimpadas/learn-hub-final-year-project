'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Enrollment } from './types'
import { enrollments as initialEnrollments } from './data'

interface EnrollmentContextType {
  enrollments: Enrollment[]
  enroll: (courseId: string, userId: string) => void
  isEnrolled: (courseId: string, userId: string) => boolean
  getProgress: (courseId: string, userId: string) => number
  completeLesson: (courseId: string, userId: string, lessonId: string, totalLessons: number) => void
  getEnrollmentsForUser: (userId: string) => Enrollment[]
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined)

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments)

  const enroll = useCallback((courseId: string, userId: string) => {
    setEnrollments((prev) => {
      if (prev.find((e) => e.courseId === courseId && e.userId === userId)) return prev
      return [
        ...prev,
        {
          courseId,
          userId,
          progress: 0,
          enrolledAt: new Date().toISOString(),
          completedLessons: [],
        },
      ]
    })
  }, [])

  const isEnrolled = useCallback(
    (courseId: string, userId: string) => {
      return enrollments.some((e) => e.courseId === courseId && e.userId === userId)
    },
    [enrollments]
  )

  const getProgress = useCallback(
    (courseId: string, userId: string) => {
      const enrollment = enrollments.find(
        (e) => e.courseId === courseId && e.userId === userId
      )
      return enrollment?.progress ?? 0
    },
    [enrollments]
  )

  const completeLesson = useCallback(
    (courseId: string, userId: string, lessonId: string, totalLessons: number) => {
      setEnrollments((prev) =>
        prev.map((e) => {
          if (e.courseId === courseId && e.userId === userId) {
            const completedLessons = e.completedLessons.includes(lessonId)
              ? e.completedLessons
              : [...e.completedLessons, lessonId]
            const progress = Math.round((completedLessons.length / totalLessons) * 100)
            return { ...e, completedLessons, progress }
          }
          return e
        })
      )
    },
    []
  )

  const getEnrollmentsForUser = useCallback(
    (userId: string) => {
      return enrollments.filter((e) => e.userId === userId)
    },
    [enrollments]
  )

  return (
    <EnrollmentContext.Provider
      value={{ enrollments, enroll, isEnrolled, getProgress, completeLesson, getEnrollmentsForUser }}
    >
      {children}
    </EnrollmentContext.Provider>
  )
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext)
  if (context === undefined) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider')
  }
  return context
}
