'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useCourses } from '@/lib/course-context'
import { useAuth } from '@/lib/auth-context'
import { useEnrollment } from '@/lib/enrollment-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  PlayCircle,
  Star,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getCourse } = useCourses()
  const { user, isAuthenticated } = useAuth()
  const { enroll, isEnrolled, getProgress, completeLesson } = useEnrollment()

  const course = getCourse(id)

  if (!course) {
    notFound()
  }

  const enrolled = user ? isEnrolled(course.id, user.id) : false
  const progress = user ? getProgress(course.id, user.id) : 0
  const enrollment = enrolled
    ? { completedLessons: [] as string[] }
    : null

  // Get actual enrollment for completed lessons
  const { enrollments } = useEnrollment()
  const actualEnrollment = user
    ? enrollments.find((e) => e.courseId === course.id && e.userId === user.id)
    : null

  const handleEnroll = () => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to enroll')
      return
    }
    enroll(course.id, user.id)
    toast.success(`Enrolled in "${course.title}"!`)
  }

  const handleLessonToggle = (lessonId: string) => {
    if (!user) return
    completeLesson(course.id, user.id, lessonId, course.syllabus.length)
  }

  const lessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4 text-primary" />
      case 'reading':
        return <FileText className="h-4 w-4 text-accent-foreground" />
      case 'quiz':
        return <HelpCircle className="h-4 w-4 text-destructive" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Link href="/courses">
        <Button variant="ghost" size="sm" className="mb-6 gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                {course.category}
              </Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold text-foreground md:text-3xl text-balance">
              {course.title}
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {course.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" />
                {course.instructor}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {course.lessons} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {course.students.toLocaleString()} students
              </span>
              {course.rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  {course.rating} rating
                </span>
              )}
            </div>
          </div>

          {/* Syllabus */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Course Syllabus</CardTitle>
              <p className="text-sm text-muted-foreground">
                {course.syllabus.length} lessons in this course
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                {course.syllabus.map((lesson, index) => {
                  const isCompleted =
                    actualEnrollment?.completedLessons.includes(lesson.id) ?? false
                  return (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                        isCompleted ? 'bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                    >
                      {enrolled ? (
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => handleLessonToggle(lesson.id)}
                          aria-label={`Mark "${lesson.title}" as complete`}
                        />
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                      <div className="flex flex-1 items-center gap-2">
                        {lessonIcon(lesson.type)}
                        <span
                          className={`text-sm ${
                            isCompleted
                              ? 'text-muted-foreground line-through'
                              : 'text-foreground'
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {lesson.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {lesson.duration}
                        </span>
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="mb-4 text-center">
                <span className="font-heading text-3xl font-bold text-foreground">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
              </div>

              {enrolled ? (
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg bg-primary/10 p-3 text-center text-sm font-medium text-primary">
                    <CheckCircle2 className="mx-auto mb-1 h-5 w-5" />
                    You are enrolled
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <Separator />
                  <p className="text-center text-xs text-muted-foreground">
                    Check the lessons above to track your progress
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {isAuthenticated ? (
                    <Button onClick={handleEnroll} size="lg" className="w-full">
                      Enroll Now
                    </Button>
                  ) : (
                    <Link href="/login" className="w-full">
                      <Button size="lg" className="w-full">
                        Sign In to Enroll
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              <Separator className="my-4" />
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instructor</span>
                  <span className="font-medium text-foreground">{course.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lessons</span>
                  <span className="font-medium text-foreground">{course.lessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium text-foreground">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-foreground">{course.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
