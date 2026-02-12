'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { EnrollmentProvider } from '@/lib/enrollment-context'
import { CourseProvider } from '@/lib/course-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CourseProvider>
        <EnrollmentProvider>{children}</EnrollmentProvider>
      </CourseProvider>
    </AuthProvider>
  )
}
