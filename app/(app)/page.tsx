'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/course-card'
import { useCourses } from '@/lib/course-context'
import { useAuth } from '@/lib/auth-context'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Trophy,
  Users,
} from 'lucide-react'

export default function HomePage() {
  const { courses } = useCourses()
  const { isAuthenticated } = useAuth()
  const featuredCourses = courses.slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-primary" />
              Your learning journey starts here
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
              Learn Without
              <span className="text-primary"> Limits</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Access high-quality courses taught by expert instructors. Build real skills, track your progress, and advance your career with LearnHub.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/courses">
                <Button size="lg" className="gap-2 px-8">
                  Browse Courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="px-8">
                    Get Started Free
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 lg:px-8">
          {[
            { icon: BookOpen, label: 'Total Courses', value: courses.length.toString() },
            {
              icon: Users,
              label: 'Active Students',
              value: courses
                .reduce((sum, c) => sum + c.students, 0)
                .toLocaleString(),
            },
            { icon: Trophy, label: 'Expert Instructors', value: '4' },
            { icon: LayoutDashboard, label: 'Categories', value: '5' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="font-heading text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Featured Courses
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked courses to kickstart your learning
            </p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="gap-1 text-primary">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl text-balance">
            Ready to Start Learning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join thousands of students already learning on LearnHub. Sign up today and get access to all our courses.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="px-8"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
