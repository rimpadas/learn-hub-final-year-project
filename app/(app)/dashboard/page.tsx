'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useCourses } from '@/lib/course-context'
import { useEnrollment } from '@/lib/enrollment-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  Trophy,
} from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const { courses } = useCourses()
  const { getEnrollmentsForUser, getProgress } = useEnrollment()

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <LogIn className="mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Sign in Required
        </h1>
        <p className="mt-2 text-muted-foreground">
          Please sign in to access your dashboard
        </p>
        <Link href="/login" className="mt-4">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  const userEnrollments = getEnrollmentsForUser(user.id)
  const enrolledCourses = userEnrollments
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId)
      return course
        ? { ...course, progress: getProgress(course.id, user.id), enrollment: e }
        : null
    })
    .filter(Boolean) as (typeof courses[0] & { progress: number; enrollment: (typeof userEnrollments)[0] })[]

  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
        )
      : 0

  const completedCourses = enrolledCourses.filter((c) => c.progress === 100).length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              My Dashboard
            </h1>
          </div>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user.name}. Keep up the great work!
          </p>
        </div>
        <Link href="/courses">
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            Browse More Courses
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enrolled Courses</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                {enrolledCourses.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
              <Trophy className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                {completedCourses}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Progress</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                {averageProgress}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {enrolledCourses.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="font-medium text-foreground">
                No courses enrolled yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse our catalog and start learning today
              </p>
              <Link href="/courses" className="mt-4 inline-block">
                <Button variant="outline" size="sm">
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {enrolledCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="group flex flex-col gap-4 rounded-lg border border-border p-4 transition-all hover:bg-muted/50 hover:shadow-sm sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                      <BookOpen className="h-6 w-6 text-primary/60" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary">
                          {course.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {course.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={course.progress} className="h-2 flex-1" />
                        <span className="text-xs font-medium text-foreground">
                          {course.progress}%
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="hidden h-4 w-4 text-muted-foreground group-hover:text-primary sm:block" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
